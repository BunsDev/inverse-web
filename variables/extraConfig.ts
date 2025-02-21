import { FEDS_PARAMS } from '@app/config/feds-params';
import { NetworkIds } from '@app/types';

const mainConfig = {
    INVDOLASLP: '0x5BA61c0a8c4DccCc200cd0ccC40a5725a426d002',
    DOLA3POOLCRV: '0xAA5A67c256e27A5d80712c51971408db3370927D',
    DOLA_PAYROLL: '0x32edDd879B199503c6Fc37DF95b8920Cd415358F',
    DEPLOYER: '0x3FcB35a1CbFB6007f9BC638D388958Bc4550cB28',
    stabilizer: '0x7eC0D931AFFBa01b77711C2cD07c76B970795CDd',
    harvester: '0xb677e5c5cbc42c25bff9578dda2959adb7eecc96',
    // governance alpha (old)
    governanceAlpha: '0x35d9f4953748b318f18c30634bA299b237eeDfff',
    // governance mills (old mills)
    // governance: '0xeF3bD8cA3beAC259D898b2C546F804B49D52e2FD',
    // governance mills (new mills)
    governance: '0xBeCCB6bb0aa4ab551966A7E4B97cec74bb359Bf6',
    // multiDelegator
    multiDelegator: '0x1ba87bE4C20Fa2d4cbD8e4Ae9998649226207F76',
    xinvManager: '0x07eB8fD853c847d6E25F29e566d605cFf474909D',
    policyCommittee: '0x4b6c63E6a94ef26E2dF60b89372db2d8e211F1B7',
    opBondManager: '0x9de7b925247c9bd98ecee5abb7ea06a4aa7d13cd',
    xinvVestorFactory: '0xe1C67007D1074bcAcC577DD946661F0CB9053A19',
    swapRouter: '0x66F625B8c4c635af8b74ECe2d7eD0D58b4af3C3d',
    disperseApp: '0xD152f549545093347A162Dce210e7293f1452150',
    debtRepayer: '0x9eb6BF2E582279cfC1988d3F2043Ff4DF18fa6A0',
    debtConverter: '0x1ff9c712B011cBf05B67A6850281b13cA27eCb2A',
    dbrAirdrop: '0x4C7b266B4bf0A8758fa85E69292eE55c212236cF',
    dbr: '0xAD038Eb671c44b853887A7E32528FaB35dC5D710',
    f2Oracle: '0xaBe146CF570FD27ddD985895ce9B138a7110cce8',
    f2controller: '0x20C7349f6D6A746a25e66f7c235E96DAC880bc0D',
    f2helper: '0x6c31147E995074eA6aaD2Fbe95060B0Aef7363E1',    
    f2markets: [
        {
            name: 'WETH',
            collateral: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            address: '0x63Df5e23Db45a2066508318f172bA45B9CD37035',
            escrowImplementation: '0xc06053FcAd0A0Df7cC32289A135bBEA9030C010f',
            icon: '/assets/projects/Ether.png',
            helper: true,
            oracleType: "chainlink",
            badgeInfo: 'High CF',
        },
        {
            name: 'stETH',
            collateral: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
            address: '0x743A502cf0e213F6FEE56cD9C6B03dE7Fa951dCf',
            escrowImplementation: '0xc06053FcAd0A0Df7cC32289A135bBEA9030C010f',
            icon: 'https://assets.coingecko.com/coins/images/13442/large/steth_logo.png',
            helper: true,
            oracleType: "chainlink",
            badgeInfo: 'Yield-Bearing',
            badgeProps: { bgColor: 'success', color: 'white' },
        },
        {
            name: 'gOHM',
            collateral: '0x0ab87046fBb341D058F17CBC4c1133F25a20a52f',
            address: '0x7Cd3ab8354289BEF52c84c2BF0A54E3608e66b37',
            escrowImplementation: '0xb4c4cD74e7b99ad2cf2f7b3A4F7091efB8BCeb7A',            
            helper: true,
            oracleType: "chainlink",
            badgeInfo: 'Keep Voting',
            badgeProps: { bgColor: 'accentTextColor', color: 'white' },
            isGovTokenCollateral: true,
        },
    ],
    feds: FEDS_PARAMS,
    multisigs: [
        {
            address: '0x9D5Df30F475CEA915b1ed4C0CCa59255C897b61B',
            name: 'Treasury Working Group',
            shortName: 'TWG',
            purpose: 'Optimize Inverse Treasury management on Ethereum',
            governanceLink: 'https://www.inverse.finance/governance/proposals/mills/10',
            chainId: NetworkIds.mainnet,
            order: 0,
        },
        {
            address: '0x7f063F7B7A1326eE8B64ACFdc81Bf544ecc974bC',
            name: 'Treasury Working Group on Fantom',
            shortName: 'TWG on FTM',
            purpose: 'Optimize Inverse Treasury management on Fantom',
            governanceLink: 'https://www.inverse.finance/governance/proposals/mills/10',
            chainId: NetworkIds.ftm,
            order: 1,
        },
        {
            address: '0xa283139017a2f5BAdE8d8e25412C600055D318F8',
            name: 'Treasury Working Group on Optimism',
            shortName: 'TWG on OP',
            purpose: 'Optimize Inverse Treasury management on Fantom',
            governanceLink: 'https://www.inverse.finance/governance/proposals/mills/10',
            chainId: NetworkIds.optimism,
            order: 2,
        },
        {
            address: '0x4b6c63E6a94ef26E2dF60b89372db2d8e211F1B7',
            name: 'Policy Committee',
            shortName: 'PC',
            purpose: 'Handle Reward Rates and Bonds Policies',
            governanceLink: 'https://www.inverse.finance/governance/proposals/mills/6',
            chainId: NetworkIds.mainnet,
            order: 5,
        },
        {
            address: '0x07de0318c24D67141e6758370e9D7B6d863635AA',
            name: 'Growth Working Group',
            shortName: 'GWG',
            purpose: 'Handle Investments & Costs regarding Growth',
            governanceLink: 'https://www.inverse.finance/governance/proposals/mills/5',
            chainId: NetworkIds.mainnet,
            order: 7,
        },
        {
            address: '0xa40FBd692350C9Ed22137F97d64E6Baa4f869E8C',
            name: 'Community Working Group',
            shortName: 'CWG',
            purpose: 'Boost Community participation and improve On-Boarding',
            governanceLink: 'https://www.inverse.finance/governance/proposals/mills/14',
            chainId: NetworkIds.mainnet,
        },
        {
            address: '0x943dBdc995add25A1728A482322F9b3c575b16fb',
            name: 'Bug Bounty Program',
            shortName: 'BBP',
            purpose: 'Handle rewards for Bug Bounties',
            governanceLink: 'https://www.inverse.finance/governance/proposals/mills/17',
            chainId: NetworkIds.mainnet,
        },
        {
            address: '0x49BB4559e65fc5f2236780079265d2f8F4f75c03',
            name: 'Analytics Working Group',
            shortName: 'AWG',
            purpose: 'Handle analytics costs (The Graph etc)',
            governanceLink: 'https://www.inverse.finance/governance/proposals/mills/25',
            chainId: NetworkIds.mainnet,
        },
        {
            address: '0xE3eD95e130ad9E15643f5A5f232a3daE980784cd',
            name: 'Risk Working Group',
            shortName: 'RWG',
            purpose: 'Assumes Guardian role',
            governanceLink: 'https://www.inverse.finance/governance/proposals/mills/42',
            chainId: NetworkIds.mainnet,
            order: 6,
        },
        {
            address: '0x8F97cCA30Dbe80e7a8B462F1dD1a51C32accDfC8',
            name: 'Fed Chair',
            shortName: 'FedChair',
            purpose: 'Manage Fed Policies',
            chainId: NetworkIds.mainnet,
            order: 4,
        },
        {
            address: '0xF7Da4bC9B7A6bB3653221aE333a9d2a2C2d5BdA7',
            name: 'Treasury Working Group on BSC',
            shortName: 'TWG on BSC',
            purpose: 'Optimize Inverse Treasury management on BSC',            
            chainId: NetworkIds.bsc,
            order: 3,
        },
        // '0x77C64eEF5F4781Dd6e9405a8a77D80567CFD37E0': 'Rewards Committee',
    ],
};

export const EXTRA_CONFIG = {
    "1": mainConfig,
    "31337": mainConfig,
    "5": {
        ...mainConfig,
        dbrAirdrop: '0x80819e03829A71FeE5fDcA95acbC006e2eBF91F0',
        dbr: '0x7F51228934F1E8a5f09C4dBC1E249Cf6581976f2',
        f2Oracle: '0x214c60045e8d1D79c1Cb5C8053EcB27393DC4C78',
        f2controller: '0x5efE6C540fA6495DCD129c34a019f9E6C31a81fB',
        f2markets: [
            {
                name: 'WETH',
                // collateral: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                collateral: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
                address: '0xE2b4cb4d44Bf51D44F963D7A1Ba77dC275717415',
                escrowImplementation: '0x8b70f2ED64DcbbeC47bd4b241b4628d7D5d7C30a',
                icon: '/assets/projects/Ether.png',
                helper: '',
            },
            {
                name: 'WBTC',
                collateral: '0xDAc02EE9f5F0Fe62d248be235f4ACd0d5E0451a0',
                address: '0x1A0A98db3D0A1fa19dA3b833f4feCc987e0bb296',
                escrowImplementation: '0x8b70f2ED64DcbbeC47bd4b241b4628d7D5d7C30a',
                icon: 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png',
                helper: '',
            },
        ],
    }
}