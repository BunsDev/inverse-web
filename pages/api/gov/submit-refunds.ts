import { getRedisClient } from '@app/util/redis';
import { RefundableTransaction } from '@app/types';
import { getProvider } from '@app/util/providers';
import { getNetworkConfigConstants } from '@app/util/networks';

const client = getRedisClient();

const { MULTISIGS } = getNetworkConfigConstants();
const TWG = MULTISIGS.find(m => m.shortName === 'TWG')!;

export default async function handler(req, res) {
    const {
        method,
    } = req
    let refunded: RefundableTransaction[]

    switch (method) {
        case 'POST':
            try {
                const { refunds, refundTxHash } = req.body;

                const provider = getProvider(process.env.NEXT_PUBLIC_CHAIN_ID!);

                const tx = await provider.getTransaction(refundTxHash);

                if (!tx) {
                    res.status(401).json({ status: 'warning', message: 'TX not found' })
                    return
                } 

                const { from } = tx;

                if (from.toLowerCase() !== TWG.address.toLowerCase()) {
                    res.status(401).json({ status: 'warning', message: 'Unauthorized: TWG only' })
                    return
                };

                const signedAt = Date.now();

                refunded = JSON.parse(await client.get('refunded-txs') || '[]');
                refunds.forEach(r => {
                    const existingIndex = refunded.findIndex(past => past.txHash === r.txHash);
                    const refund = { ...r, refunded: !!refundTxHash, signedAt, signedBy: from, refundTxHash };
                    if (existingIndex !== -1 && !refundTxHash) {
                        refunded.splice(existingIndex, 1);
                    } else if (existingIndex !== -1) {
                        refunded[existingIndex] = refund;
                    } else {
                        refunded.push(refund);
                    };
                });

                await client.set('refunded-txs', JSON.stringify(refunded));

                res.status(200).json({
                    status: 'success',
                    message: 'Refunds Updated',
                    refunds,
                    signedAt,
                    signedBy: from,
                    refundTxHash,
                })
            } catch (e) {
                console.log(e);
                res.status(500).json({ status: 'error', message: 'An error occured' })
            }
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}