import { Contract } from 'ethers'
import 'source-map-support'
import { DOLA_ABI, F2_MARKET_ABI, F2_ORACLE_ABI } from '@app/config/abis'
import { getNetworkConfigConstants } from '@app/util/networks'
import { getProvider } from '@app/util/providers';
import { getCacheFromRedis, redisSetWithTimestamp } from '@app/util/redis'
import { TOKENS } from '@app/variables/tokens'
import { getBnToNumber } from '@app/util/markets'
import { CHAIN_ID } from '@app/config/constants';

const { F2_MARKETS, DOLA } = getNetworkConfigConstants();

export default async function handler(req, res) {
  const cacheKey = `f2markets-v1.0.1`;

  try {
    const validCache = await getCacheFromRedis(cacheKey, true, 30);
    if (validCache) {
      res.status(200).json(validCache);
      return
    }

    const provider = getProvider(CHAIN_ID);
    const dolaContract = new Contract(DOLA, DOLA_ABI, provider);

    const [
      bnCollateralFactors,
      bnTotalDebts,
      oracles,
      bnDola,
      replenishmentIncentives,
      liquidationIncentives,
      borrowControllers,
    ] = await Promise.all([
      Promise.all(
        F2_MARKETS.map(m => {
          const market = new Contract(m.address, F2_MARKET_ABI, provider);
          return market.collateralFactorBps()
        })
      ),
      Promise.all(
        F2_MARKETS.map(m => {
          const market = new Contract(m.address, F2_MARKET_ABI, provider);
          return market.totalDebt()
        })
      ),
      Promise.all(
        F2_MARKETS.map(m => {
          const market = new Contract(m.address, F2_MARKET_ABI, provider);
          return market.oracle()
        })
      ),
      Promise.all(
        F2_MARKETS.map(m => {
          return dolaContract.balanceOf(m.address);
        })
      ),
      Promise.all(
        F2_MARKETS.map(m => {
          const market = new Contract(m.address, F2_MARKET_ABI, provider);
          return market.replenishmentIncentiveBps();
        })
      ),
      Promise.all(
        F2_MARKETS.map(m => {
          const market = new Contract(m.address, F2_MARKET_ABI, provider);
          return market.liquidationIncentiveBps();
        })
      ),
      Promise.all(
        F2_MARKETS.map(m => {
          const market = new Contract(m.address, F2_MARKET_ABI, provider);
          return market.borrowController();
        })
      ),
    ]);

    const bnPrices = await Promise.all(
      oracles.map((o, i) => {
        const oracle = new Contract(o, F2_ORACLE_ABI, provider);
        return oracle.viewPrice(F2_MARKETS[i].collateral, bnCollateralFactors[i]);
      }),
    );

    const markets = F2_MARKETS.map((m, i) => {
      return {
        ...m,
        bnTotalDebts,
        oracle: oracles[i],
        underlying: TOKENS[m.collateral],
        price: getBnToNumber(bnPrices[i]),
        totalDebt: getBnToNumber(bnTotalDebts[i]),
        collateralFactor: getBnToNumber(bnCollateralFactors[i], 4),
        dolaLiquidity: getBnToNumber(bnDola[i]),
        bnDolaLiquidity: bnDola[i],
        replenishmentIncentive: getBnToNumber(replenishmentIncentives[i], 4),
        liquidationIncentive: getBnToNumber(liquidationIncentives[i], 4),
        borrowController: borrowControllers[i],
        supplyApy: 0,
      }
    })

    const resultData = {
      markets,
      timestamp: +(new Date()),
    }

    await redisSetWithTimestamp(cacheKey, resultData);

    res.status(200).json(resultData)
  } catch (err) {
    console.error(err);
    // if an error occured, try to return last cached results
    try {
      const cache = await getCacheFromRedis(cacheKey, false);
      if (cache) {
        console.log('Api call failed, returning last cache found');
        res.status(200).json(cache);
      } else {
        res.status(500).json({ success: false });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false });
    }
  }
}