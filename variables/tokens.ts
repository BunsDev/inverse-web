import { HAS_REWARD_TOKEN } from '@app/config/constants';
import { Token, TokenList } from '@app/types';
import { isAddress } from 'ethers/lib/utils';
import { PROTOCOL_IMAGES, TOKEN_IMAGES } from './images';

// TODO: refacto in cleaner way with markets and tokens

export const getToken = (tokens: TokenList, symbolOrAddress: string, extend = {}) => {
  const t = Object.entries(tokens)
    .map(([address, token]) => token)
    .find(token => isAddress(symbolOrAddress) ? token?.address?.toLowerCase() === symbolOrAddress?.toLowerCase() : token?.symbol?.toLowerCase() === symbolOrAddress?.toLowerCase())
  return { ...t, ...extend }
}

export const getRewardToken = () => {
  return getToken(TOKENS, process.env.NEXT_PUBLIC_REWARD_TOKEN!)
}

const deprecatedBadge = {
  text: "DEPRECATED",
  color: "gray",
}

const pausedBadge = {
  text: "PAUSED",
  color: "gray",
}

const chainTokenAddresses = {
  "1": {
    INV: '0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68',
    DOLA: '0x865377367054516e17014CcdED1e7d814EDC9ce4',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    YFI: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
    XSUSHI: '0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    STETH: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
    INVDOLASLP: '0x5BA61c0a8c4DccCc200cd0ccC40a5725a426d002',
    INVDOLAAURA: '0xA5D7A7690B72a89B7b720E43fC9cBda5419d0C71',
    INVDOLABLP: '0x441b8a1980f2F2E43A9397099d15CC2Fe6D36250',
    INVDOLAULP: '0xb268c1c44a349d06a42cf24988162dadc48d839e',
    INVETHSLP: '0x328dFd0139e26cB0FEF7B0742B49b0fe4325F821',
    INVETHLP: '0x73e02eaab68a41ea63bdae9dbd4b7678827b2352',
    DOLAWETHULP: '0xecfbe9b182f6477a93065c1c11271232147838e5',
    DOLA3POOLCRV: '0xAA5A67c256e27A5d80712c51971408db3370927D',
    DOLAUSDCUNIV3: '0x7c082BF85e01f9bB343dbb460A14e51F67C58cFB',
    DOLADBRUNIV3: '0x6a279e847965ba5dDc0AbFE8d669642F73334A2C',
    THREECRV: '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490',
    FLOKI: '0xcf0c122c6b73ff809c693db761e7baebe62b6a2e',
    WFTM: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
    MIM: '0x99d8a9c45b2eca8864373a26d1459e3dff1e17f3',
    DOLAWETHLP: '0xb204bf10bc3a5435017d3db247f56da601dfe08a',
    CVX: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
    CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
    VLCVX: '0x72a19342e8F1838460eBFCCEf09F6585e32db86E',
    VLAURA: '0x3Fa73f1E5d8A792C80F426fc8F84FBF7Ce9bBCAC',
    LOCKEDDOLAFRAXBP: '0xF06c8696730cf760619e4fA0eDd0f79ea50531A9',    
    BAL: '0xba100000625a3754423978a60c9317c58a424e3D',
    AURA: '0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF',
    DOLAUSDCBALANCER: '0xFf4ce5AAAb5a627bf82f4A571AB1cE94Aa365eA6',
    DBRDOLABALANCER: '0x445494F823f3483ee62d854eBc9f58d5B9972A25',
    DOLABBEUSD: '0x133d241F225750D2c92948E464A5a80111920331',
    BBEUSD: '0x50Cf90B954958480b8DF7958A9E965752F627124',
    SDCRV: '0xd1b5651e55d4ceed36251c61c50c889b36f6abb5',
    SDCRVGAUGE: '0x7f50786A0b15723D741727882ee99a0BF34e3466',
    // yearn vaults
    YVDOLA3POOLCRV: '0xd88dBBA3f9c4391Ee46f5FF548f289054db6E51C',
    YVUSDT: '0x7Da96a3891Add058AdA2E826306D812C638D87a7',
    YVUSDC: '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE',
    YVDAI: '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
    YVYFI: '0xdb25cA703181E7484a155DD612b06f57E12Be5F0',
    YVWETH: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
    YVCRVCVXETH: '0x1635b506a88fBF428465Ad65d00e8d6B6E5846C3',
    YVCRVIB: '0x27b7b1ad7288079A66d12350c828D3C00A6F07d7',
    YVCRV3CRYPTO: '0xE537B5cc158EB71037D4125BDD7538421981E6AA',
    YVCRVSTEHWETH: '0x5faF6a2D186448Dfa667c51CB3D695c7A6E52d8E',
    DOLAFRAXUSDC: '0xE57180685E3348589E9521aa53Af0BCD497E884d',
    INVETHCLP: '0xEAc004214F2ACa7a6BA01C7558cb4a85E7958ddD',
    FRAXUSDC: '0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC',
    FRAX: '0x853d955acef822db058eb8505911ed77f175b99e',
    DBR: '0xAD038Eb671c44b853887A7E32528FaB35dC5D710',
    GOHM: '0x0ab87046fBb341D058F17CBC4c1133F25a20a52f',
    CUSD: '0xC285B7E09A4584D027E5BC36571785B515898246',
    DOLACUSDBLP: '0x384F67aA430376efc4f8987eaBf7F3f84eB9EA5d',
    DOLACUSDALP: '0x0995a508dF9606f1C6D512a2d6BA875Cf3cE94C3',
  },
  "250": {
    DOLA2POOLCRV: '0x28368d7090421ca544bc89799a2ea8489306e3e5',
    SPOOKYLP: '0x49ec56cc2adaf19c1688d3131304dbc3df5e1ccd',
    DOLA: '0x3129662808bEC728a27Ab6a6b9AFd3cBacA8A43c',
    INV: '0xb84527D59b6Ecb96F433029ECc890D4492C5dCe1',
    USDC: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    WFTM: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',    
  },
  "10": {
    DOLA: '0x8aE125E8653821E851F12A49F7765db9a9ce7384',
    VELO: '0x3c8B650257cFb5f272f799F5e2b4e65093a11a05',
    VEVELO: '0x9c7305eb78a432ced5C4D14Cac27E8Ed569A2e26',
    VELODOLAUSDCLP: '0x6C5019D345Ec05004A7E7B0623A91a0D9B8D590d',
    VELODOLALP: '0x1eBE6427f037385dDcB95aa688c18272415e3F46',
    VELODOLAMAILP: '0x21950a0cA249A0ef3d182338c86c8C066B24D801',
    VELODOLAUSDplusLP: '0xa99817d2d286C894F8f3888096A5616d06F20d46',
    USDC: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    USDplus: '0x73cb180bf0521828d8849bc8CF2B920918e23032',
    MAI: '0xdFA46478F9e5EA86d57387849598dbFB2e964b02',
  },
  "5": {
    DOLA: '0x50e6a8a893bDa08D31ADCA88E8B99cC3f9b2dE9A',
    WETH: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    WBTC: '0xDAc02EE9f5F0Fe62d248be235f4ACd0d5E0451a0',
    INV: '0x4C1948bf7E33c711c488f765B3A8dDD9f7bEECb4',
  },
  "56": {
    WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    DOLA: '0x2F29Bc0FFAF9bff337b31CBe6CB5Fb3bf12e5840',
    THENA: '0xF4C8E32EaDEC4BFe97E0F595AdD0f4450a863a11',
    VETHENA: '0xfBBF371C9B0B994EebFcC977CEf603F7f31c070D',
    CUSD: '0xFa4BA88Cf97e282c505BEa095297786c16070129',
    THENADOLACUSDLP: '0x7061F52ed4942021924745D454d722E52e057e03',
    THENADOLAWBNBLP: '0xc5856601712E8a74d57cdc7a47fB1B41C1a6Fae2',
  },
}
chainTokenAddresses["31337"] = chainTokenAddresses["1"];

const ETH = {
  address: '',
  name: 'Ether',
  symbol: 'ETH',
  coingeckoId: 'ethereum',
  image: TOKEN_IMAGES.ETH,
  decimals: 18,
}

const DOLA = {
  name: 'Dola',
  symbol: 'DOLA',
  coingeckoId: 'dola-usd',
  image: TOKEN_IMAGES.DOLA,
  decimals: 18,
}

const chainTokens = {
  "1": {
    // Chain's coin
    CHAIN_COIN: {
      ...ETH,
    },
    // Tokens
    [chainTokenAddresses["1"].DAI]: {
      address: chainTokenAddresses["1"].DAI,
      name: 'Dai',
      symbol: 'DAI',
      coingeckoId: 'dai',
      image: TOKEN_IMAGES.DAI,
      decimals: 18,
    },
    [chainTokenAddresses["1"].USDT]: {
      address: chainTokenAddresses["1"].USDT,
      name: 'Tether',
      symbol: 'USDT',
      coingeckoId: 'tether',
      image: TOKEN_IMAGES.USDT,
      decimals: 6,
    },
    [chainTokenAddresses["1"].USDC]: {
      address: chainTokenAddresses["1"].USDC,
      name: 'USD Coin',
      symbol: 'USDC',
      coingeckoId: 'usd-coin',
      image: TOKEN_IMAGES.USDC,
      decimals: 6,
    },
    [chainTokenAddresses["1"].WETH]: {
      address: chainTokenAddresses["1"].WETH,
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      coingeckoId: 'weth',
      image: TOKEN_IMAGES.WETH,
      decimals: 18,
      isWrappedChainCoin: true,
    },
    [chainTokenAddresses["1"].YFI]: {
      address: chainTokenAddresses["1"].YFI,
      name: 'Yearn',
      symbol: 'YFI',
      coingeckoId: 'yearn-finance',
      image: TOKEN_IMAGES.YFI,
      decimals: 18,
    },
    [chainTokenAddresses["1"].XSUSHI]: {
      address: chainTokenAddresses["1"].XSUSHI,
      name: 'xSUSHI',
      symbol: 'xSUSHI',
      coingeckoId: 'xsushi',
      image: TOKEN_IMAGES.xSUSHI,
      decimals: 18,
      protocolImage: PROTOCOL_IMAGES.SUSHI,
    },
    [chainTokenAddresses["1"].WBTC]: {
      address: chainTokenAddresses["1"].WBTC,
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      coingeckoId: 'wrapped-bitcoin',
      image: TOKEN_IMAGES.WBTC,
      decimals: 8,
    },
    [chainTokenAddresses["1"].STETH]: {
      address: chainTokenAddresses["1"].STETH,
      name: 'Lido Staked Ether',
      symbol: 'stETH',
      coingeckoId: 'staked-ether',
      image: TOKEN_IMAGES.stETH,
      decimals: 18,
      protocolImage: PROTOCOL_IMAGES.LIDO,
    },
    [chainTokenAddresses["1"].GOHM]: {
      address: chainTokenAddresses["1"].GOHM,
      name: 'Governance OHM',
      symbol: 'gOHM',
      coingeckoId: 'governance-ohm',
      image: TOKEN_IMAGES.gOHM,
      protocolImage: PROTOCOL_IMAGES.OHM,
      decimals: 18,      
    },
    [chainTokenAddresses["1"].INVDOLASLP]: {
      address: chainTokenAddresses["1"].INVDOLASLP,
      name: 'INV-DOLA SLP',
      symbol: 'INV-DOLA-SLP',
      image: TOKEN_IMAGES.INV,
      decimals: 18,
      isLP: true,
      pairs: [
        chainTokenAddresses["1"].INV, chainTokenAddresses["1"].DOLA
      ],
      protocolImage: PROTOCOL_IMAGES.SUSHI,
    },
    [chainTokenAddresses["1"].INVETHCLP]: {
      address: chainTokenAddresses["1"].INVETHCLP,
      poolAddress: '0x2AF0a09b3421240f32953FffB13D2D2B8d24fbaE',
      name: 'INV-ETH LP',
      symbol: 'INV-ETH-LP',
      image: TOKEN_IMAGES.INV,
      decimals: 18,
      isLP: true,
      isCrvLP: true,
      pairs: [
        chainTokenAddresses["1"].WETH, chainTokenAddresses["1"].INV
      ],
      protocolImage: PROTOCOL_IMAGES.CRV,
    },
    [chainTokenAddresses["1"].INVDOLAAURA]: {
      address: chainTokenAddresses["1"].INVDOLAAURA,
      name: 'INV-DOLA AURA',
      symbol: 'INV-DOLA-AURA',
      image: TOKEN_IMAGES.INV,
      decimals: 18,
      isLP: true,
      balancerInfos: {
        poolId: '0x441b8a1980f2f2e43a9397099d15cc2fe6d3625000020000000000000000035f',
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      },
      pairs: [
        chainTokenAddresses["1"].INV, chainTokenAddresses["1"].DOLA
      ],
      protocolImage: PROTOCOL_IMAGES.AURA,
    },
    [chainTokenAddresses["1"].INVDOLABLP]: {
      address: chainTokenAddresses["1"].INVDOLABLP,
      name: 'INV-DOLA blp',
      symbol: 'INV-DOLA blp',
      image: TOKEN_IMAGES.INV,
      decimals: 18,
      isLP: true,
      balancerInfos: {
        poolId: '0x441b8a1980f2f2e43a9397099d15cc2fe6d3625000020000000000000000035f',
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      },
      pairs: [
        chainTokenAddresses["1"].INV, chainTokenAddresses["1"].DOLA
      ],
      protocolImage: PROTOCOL_IMAGES.BAL,
      deduce: [chainTokenAddresses["1"].INVDOLAAURA],
    },
    // deprecated
    // [chainTokenAddresses["1"].INVDOLAULP]: {
    //   address: chainTokenAddresses["1"].INVDOLAULP,
    //   name: 'INV-DOLA LP',
    //   symbol: 'INV-DOLA-LP',
    //   image: TOKEN_IMAGES.INV,
    //   decimals: 18,
    //   isLP: true,
    //   pairs: [
    //     chainTokenAddresses["1"].INV, chainTokenAddresses["1"].DOLA
    //   ],
    //   protocolImage: PROTOCOL_IMAGES.UNI,
    // },
    [chainTokenAddresses["1"].DOLAUSDCUNIV3]: {
      address: chainTokenAddresses["1"].DOLAUSDCUNIV3,
      name: 'DOLA-USDC LP',
      symbol: 'DOLA-USDC-LP',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,
      isStable: true,
      isUniV3: true,
      pairs: [
        chainTokenAddresses["1"].DOLA, chainTokenAddresses["1"].USDC
      ],
      protocolImage: PROTOCOL_IMAGES.UNIV3,
    },
    [chainTokenAddresses["1"].DOLADBRUNIV3]: {
      address: chainTokenAddresses["1"].DOLADBRUNIV3,
      name: 'DOLA-DBR LP',
      symbol: 'DOLA-DBR-LP',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,
      isUniV3: true,
      pairs: [
        chainTokenAddresses["1"].DOLA, chainTokenAddresses["1"].DBR
      ],
      protocolImage: PROTOCOL_IMAGES.UNIV3,
    },
    [chainTokenAddresses["1"].INVETHSLP]: {
      address: chainTokenAddresses["1"].INVETHSLP,
      name: 'INV-ETH SLP',
      symbol: 'INV-ETH-SLP',
      image: TOKEN_IMAGES.INV,
      protocolImage: PROTOCOL_IMAGES.SUSHI,
      decimals: 18,
      isLP: true,
      pairs: [
        chainTokenAddresses["1"].INV, chainTokenAddresses["1"].WETH
      ],
    },
    [chainTokenAddresses["1"].INVETHLP]: {
      address: chainTokenAddresses["1"].INVETHLP,
      name: 'INV-WETH LP',
      symbol: 'INV-WETH-LP',
      image: TOKEN_IMAGES.INV,
      protocolImage: PROTOCOL_IMAGES.UNI,
      decimals: 18,
      isLP: true,
      pairs: [
        chainTokenAddresses["1"].INV, chainTokenAddresses["1"].WETH
      ],
    },
    [chainTokenAddresses["1"].DOLAWETHULP]: {
      address: chainTokenAddresses["1"].DOLAWETHULP,
      name: 'DOLA-WETH LP',
      symbol: 'DOLA-WETH-LP',
      image: TOKEN_IMAGES.DOLA,
      protocolImage: PROTOCOL_IMAGES.UNI,
      decimals: 18,
      isLP: true,
      pairs: [
        chainTokenAddresses["1"].DOLA, chainTokenAddresses["1"].WETH
      ],
    },
    // deprecated
    // [chainTokenAddresses["1"].DOLAWETHLP]: {
    //   address: chainTokenAddresses["1"].DOLAWETHLP,
    //   name: 'DOLA-WETH',
    //   symbol: 'DOLA-WETH',
    //   image: TOKEN_IMAGES.DOLA,
    //   decimals: 18,
    //   isLP: true,
    //   balancerInfos: {
    //     poolId: '0xb204bf10bc3a5435017d3db247f56da601dfe08a000200000000000000000230',
    //     vault: '0xba12222222228d8ba445958a75a0704d566bf2c8',
    //   },
    //   pairs: [
    //     chainTokenAddresses["1"].DOLA, chainTokenAddresses["1"].WETH
    //   ],
    //   protocolImage: PROTOCOL_IMAGES.BAL,
    // },
    [chainTokenAddresses["1"].DOLA3POOLCRV]: {
      address: chainTokenAddresses["1"].DOLA3POOLCRV,
      name: 'Dola-3pool CRV LP',
      symbol: 'DOLA-3POOL',
      coingeckoId: 'dai',
      protocolImage: PROTOCOL_IMAGES.CRV,
      decimals: 18,
      isLP: true,
      isStable: true,
      isCrvLP: true,
      pairs: [
        '0x865377367054516e17014CcdED1e7d814EDC9ce4', chainTokenAddresses["1"].THREECRV
      ],
      image: TOKEN_IMAGES.DOLA
    },
    [chainTokenAddresses["1"].DOLAFRAXUSDC]: {
      address: chainTokenAddresses["1"].DOLAFRAXUSDC,
      name: 'DOLA-FRAX-USDC',
      symbol: 'DOLA-FRAX-USDC',      
      protocolImage: PROTOCOL_IMAGES.CRV,
      decimals: 18,
      isLP: true,
      isStable: true,
      isCrvLP: true,
      pairs: [
        '0x865377367054516e17014CcdED1e7d814EDC9ce4', '0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC'
      ],
      image: TOKEN_IMAGES.DOLA
    },
    [chainTokenAddresses["1"].DOLAUSDCBALANCER]: {
      address: chainTokenAddresses["1"].DOLAUSDCBALANCER,
      name: 'DOLA-USDC blp',
      symbol: 'DOLA-USDC blp',
      protocolImage: PROTOCOL_IMAGES.BAL,
      decimals: 18,
      isLP: true,
      isStable: true,
      balancerInfos: {
        poolId: '0xff4ce5aaab5a627bf82f4a571ab1ce94aa365ea6000200000000000000000426',
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      },     
      pairs: [
        '0x865377367054516e17014CcdED1e7d814EDC9ce4', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
      ],
      image: TOKEN_IMAGES.DOLA
    },
    [chainTokenAddresses["1"].DBRDOLABALANCER]: {
      address: chainTokenAddresses["1"].DBRDOLABALANCER,
      name: 'DOLA-DBR blp',
      symbol: 'DOLA-DBR blp',
      protocolImage: PROTOCOL_IMAGES.BAL,
      decimals: 18,
      isLP: true,
      balancerInfos: {
        poolId: '0x445494f823f3483ee62d854ebc9f58d5b9972a25000200000000000000000415',
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      },     
      pairs: [
        chainTokenAddresses["1"].DOLA, chainTokenAddresses["1"].DBR
      ],
      image: TOKEN_IMAGES.DOLA
    },
    [chainTokenAddresses["1"].DOLABBEUSD]: {
      address: chainTokenAddresses["1"].DOLABBEUSD,
      name: 'DOLA-BB-E-USD blp',
      symbol: 'DOLA-bb-e-usd blp',
      protocolImage: PROTOCOL_IMAGES.BAL,
      decimals: 18,
      isLP: true,
      isStable: true,
      balancerInfos: {
        poolId: '0x133d241f225750d2c92948e464a5a80111920331000000000000000000000476',
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      },     
      pairs: [
        '0x133d241F225750D2c92948E464A5a80111920331', '0x50Cf90B954958480b8DF7958A9E965752F627124', '0x865377367054516e17014CcdED1e7d814EDC9ce4'
      ],
      isComposableMetapool: true,
      image: TOKEN_IMAGES.DOLA
    },
    [chainTokenAddresses["1"].BBEUSD]: {
      address: chainTokenAddresses["1"].BBEUSD,
      name: 'BB-EULER-USD',
      symbol: 'BB-EULER-USD',   
      image: TOKEN_IMAGES['BB-EULER-USD'],
      protocolImage: PROTOCOL_IMAGES.EULER,
      decimals: 18,
    },    
    [chainTokenAddresses["1"].THREECRV]: {
      address: chainTokenAddresses["1"].THREECRV,
      name: 'lp-3pool-curve',
      symbol: '3CRV',
      coingeckoId: 'lp-3pool-curve',
      image: TOKEN_IMAGES.THREECRV,
      decimals: 18,
    },
    [chainTokenAddresses["1"].FRAXUSDC]: {
      address: chainTokenAddresses["1"].FRAXUSDC,
      name: 'crvFRAX',
      symbol: 'crvFRAX',
      coingeckoId: 'curve-fi-frax-usdc',
      image: TOKEN_IMAGES.FRAX,
      protocolImage: TOKEN_IMAGES.USDC,
      decimals: 18,
    },
    [chainTokenAddresses["1"].FRAX]: {
      address: chainTokenAddresses["1"].FRAX,
      name: 'FRAX',
      symbol: 'FRAX',
      coingeckoId: 'frax',
      image: TOKEN_IMAGES.FRAX,      
      decimals: 18,
    },
    [chainTokenAddresses["1"].FLOKI]: {
      address: chainTokenAddresses["1"].FLOKI,
      name: 'Floki',
      symbol: 'FLOKI',
      coingeckoId: 'floki-inu',
      image: TOKEN_IMAGES.FLOKI,
      decimals: 9,
      isInPausedSection: true,
      badge: deprecatedBadge,
    },
    [chainTokenAddresses["1"].WFTM]: {
      address: chainTokenAddresses["1"].WFTM,
      name: 'Fantom',
      symbol: 'WFTM',
      coingeckoId: 'fantom',
      image: TOKEN_IMAGES.WFTM,
      decimals: 18,
    },
    [chainTokenAddresses["1"].MIM]: {
      address: chainTokenAddresses["1"].MIM,
      name: 'MIM',
      symbol: 'MIM',
      coingeckoId: 'magic-internet-money',
      image: TOKEN_IMAGES.MIM,
      decimals: 18,
    },
    [chainTokenAddresses["1"].YVCRVCVXETH]: {
      address: chainTokenAddresses["1"].YVCRVCVXETH,
      name: 'YV-CrvCvxEth',
      symbol: 'yvcrvCVXETH',
      image: TOKEN_IMAGES.THREECRV,
      decimals: 18,
      protocolImage: PROTOCOL_IMAGES.YFI,
    },
    [chainTokenAddresses["1"].YVCRVIB]: {
      address: chainTokenAddresses["1"].YVCRVIB,
      name: 'YV-CrvIB',
      symbol: 'yvcrvIB',
      image: TOKEN_IMAGES.yvcrvIB,
      decimals: 18,
      protocolImage: PROTOCOL_IMAGES.YFI,
    },
    [chainTokenAddresses["1"].YVCRV3CRYPTO]: {
      address: chainTokenAddresses["1"].YVCRV3CRYPTO,
      name: 'YV-Crv3crypto',
      symbol: 'yvcrv3Crypto',
      image: TOKEN_IMAGES.yvcrv3Crypto,
      decimals: 18,
      protocolImage: PROTOCOL_IMAGES.YFI,
    },
    [chainTokenAddresses["1"].YVCRVSTEHWETH]: {
      address: chainTokenAddresses["1"].YVCRVSTEHWETH,
      name: 'yvcrvstETH-WETH',
      symbol: 'yvcrvstETH-WETH',
      image: TOKEN_IMAGES.stETH,
      decimals: 18,
      protocolImage: PROTOCOL_IMAGES.YFI,
    },
    [chainTokenAddresses["1"].CVX]: {
      address: chainTokenAddresses["1"].CVX,
      name: 'CVX',
      symbol: 'CVX',
      image: TOKEN_IMAGES.CVX,
      decimals: 18,
      coingeckoId: 'convex-finance',
    },
    [chainTokenAddresses["1"].CRV]: {
      address: chainTokenAddresses["1"].CRV,
      name: 'CRV',
      symbol: 'CRV',
      image: TOKEN_IMAGES.CRV,
      decimals: 18,
      coingeckoId: 'curve-dao-token',
    },
    [chainTokenAddresses["1"].SDCRV]: {
      address: chainTokenAddresses["1"].SDCRV,
      name: 'sdCRV',
      symbol: 'sdCRV',
      image: TOKEN_IMAGES.sdCRV,
      decimals: 18,
      coingeckoId: 'stake-dao-crv',
    },
    [chainTokenAddresses["1"].SDCRVGAUGE]: {
      address: chainTokenAddresses["1"].SDCRVGAUGE,
      name: 'sdCRV-g',
      symbol: 'sdCRV-g',
      image: TOKEN_IMAGES['sdCRV-g'],
      decimals: 18,
      coingeckoId: 'stake-dao-crv',
    },
    [chainTokenAddresses["1"].VLCVX]: {
      address: chainTokenAddresses["1"].VLCVX,
      name: 'vlCVX',
      symbol: 'vlCVX',
      image: TOKEN_IMAGES.CVX,
      decimals: 18,
      coingeckoId: 'convex-finance',
    },
    [chainTokenAddresses["1"].DBR]: {
      address: chainTokenAddresses["1"].DBR,
      name: 'DBR',
      symbol: 'DBR',
      image: TOKEN_IMAGES.DBR,
      decimals: 18,
      coingeckoId: 'dola-borrowing-right',
    },
    [chainTokenAddresses["1"].VLAURA]: {
      address: chainTokenAddresses["1"].VLAURA,
      name: 'vlAURA',
      symbol: 'vlAURA',
      image: TOKEN_IMAGES.vlAURA,
      decimals: 18,
      coingeckoId: 'aura-finance',
    },
    [chainTokenAddresses["1"].LOCKEDDOLAFRAXBP]: {
      address: chainTokenAddresses["1"].LOCKEDDOLAFRAXBP,
      name: 'vlDOLA-FRAXBP',
      symbol: 'vlDOLA-FRAXBP',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      protocolImage: PROTOCOL_IMAGES.CVX,
      convexInfos: {
        account: '0x5170793C4D96f9ca058E2A581BADdA9413EF4b0d',
        fromPrice: '0xE57180685E3348589E9521aa53Af0BCD497E884d',    
      },      
    },
    [chainTokenAddresses["1"].AURA]: {
      address: chainTokenAddresses["1"].AURA,
      name: 'AURA',
      symbol: 'AURA',
      coingeckoId: 'aura-finance',
      image: TOKEN_IMAGES.AURA,
      decimals: 18,
    },
    [chainTokenAddresses["1"].BAL]: {
      address: chainTokenAddresses["1"].BAL,
      name: 'BAL',
      symbol: 'BAL',
      coingeckoId: 'balancer',
      image: TOKEN_IMAGES.BAL,     
      decimals: 18,
    },
    [chainTokenAddresses["1"].CUSD]: {
      address: chainTokenAddresses["1"].CUSD,
      name: 'CUSD',
      symbol: 'CUSD',
      coingeckoId: 'coin98-dollar',
      image: TOKEN_IMAGES.CUSD,
      decimals: 18,
    },
    [chainTokenAddresses["1"].DOLACUSDBLP]: {
      address: chainTokenAddresses["1"].DOLACUSDBLP,
      name: 'DOLA-CUSD blp',
      symbol: 'DOLA-CUSD blp',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,
      isStable: true,
      balancerInfos: {
        poolId: '0x384f67aa430376efc4f8987eabf7f3f84eb9ea5d00020000000000000000043d',
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      },
      pairs: [
        chainTokenAddresses["1"].DOLA, chainTokenAddresses["1"].CUSD
      ],
      protocolImage: PROTOCOL_IMAGES.BAL,
      deduce: [chainTokenAddresses["1"].DOLACUSDALP],
    },
    [chainTokenAddresses["1"].DOLACUSDALP]: {
      address: chainTokenAddresses["1"].DOLACUSDALP,
      name: 'DOLA-CUSD alp',
      symbol: 'DOLA-CUSD alp',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,
      isStable: true,
      balancerInfos: {
        poolId: '0x384f67aa430376efc4f8987eabf7f3f84eb9ea5d00020000000000000000043d',
        vault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      },
      pairs: [
        chainTokenAddresses["1"].DOLA, chainTokenAddresses["1"].CUSD
      ],
      protocolImage: PROTOCOL_IMAGES.AURA,
    },
  },
  "250": {
    CHAIN_COIN: {
      address: '',
      name: 'Fantom',
      symbol: 'FTM',
      coingeckoId: 'fantom',
      image: TOKEN_IMAGES.FTM,
      decimals: 18,
    },
    // deprecated
    // [chainTokenAddresses["250"].DOLA2POOLCRV]: {
    //   address: chainTokenAddresses["250"].DOLA2POOLCRV,
    //   name: 'Dola-2Pool CRV LP',
    //   symbol: 'DOLA-2POOL',
    //   coingeckoId: 'dai',
    //   image: TOKEN_IMAGES.CRV,
    //   decimals: 18,
    //   isLP: true,
    //   isCrvLP: true,
    // },
    // deprecated
    // [chainTokenAddresses["250"].SPOOKYLP]: {
    //   address: chainTokenAddresses["250"].SPOOKYLP,
    //   name: 'Spooky LP',
    //   symbol: 'SPOOKY-LP',
    //   coingeckoId: '',
    //   image: 'https://assets.coingecko.com/markets/images/662/small/spookyswap.png?1639279823',
    //   decimals: 18,
    //   isLP: true,
    //   pairs: [
    //     chainTokenAddresses["250"].DOLA, chainTokenAddresses["250"].WFTM
    //   ],
    // },
  },
  "5": {
    CHAIN_COIN: {
      ...ETH
    },
    [chainTokenAddresses["5"].DOLA]: {
      address: chainTokenAddresses["5"].DOLA,
      ...DOLA,
    },
    [chainTokenAddresses["5"].WETH]: {
      address: chainTokenAddresses["5"].WETH,
      name: 'Wrapped Ethereum',
      symbol: 'WETH',
      coingeckoId: 'weth',
      image: TOKEN_IMAGES.WETH,
      decimals: 18,
      isWrappedChainCoin: true,
    },
    [chainTokenAddresses["5"].WBTC]: {
      address: chainTokenAddresses["5"].WBTC,
      name: 'Wrapped Bitcoin',
      symbol: 'WBTC',
      coingeckoId: 'wrapped-bitcoin',
      image: TOKEN_IMAGES.WBTC,
      decimals: 8,
    },
  },
  "10": {
    CHAIN_COIN: {
      ...ETH,
    },
    [chainTokenAddresses["10"].DOLA]: {
      address: chainTokenAddresses["10"].DOLA,
      ...DOLA,
    },
    [chainTokenAddresses["10"].USDC]: {
      address: chainTokenAddresses["10"].USDC,
      name: 'USD Coin',
      symbol: 'USDC',
      coingeckoId: 'usd-coin',
      image: TOKEN_IMAGES.USDC,
      decimals: 6,
    },
    [chainTokenAddresses["10"].VELO]: {
      address: chainTokenAddresses["10"].VELO,
      name: 'VELO',
      symbol: 'VELO',
      image: TOKEN_IMAGES.VELO,
      decimals: 18,
      coingeckoId: 'velodrome-finance',
    },
    [chainTokenAddresses["10"].USDplus]: {
      address: chainTokenAddresses["10"].USDplus,
      name: 'USD+',
      symbol: 'USD+',
      image: TOKEN_IMAGES['USD+'],
      decimals: 6,
      coingeckoId: 'usd',
    },
    [chainTokenAddresses["10"].MAI]: {
      address: chainTokenAddresses["10"].MAI,
      name: 'MIMATIC',
      symbol: 'MAI',
      image: TOKEN_IMAGES['MAI'],
      decimals: 18,
      coingeckoId: 'mimatic',
    },
    [chainTokenAddresses["10"].VEVELO]: {
      address: chainTokenAddresses["10"].VEVELO,
      name: 'veVELO',
      symbol: 'veVELO',
      image: TOKEN_IMAGES.veVELO,
      decimals: 18,
      coingeckoId: 'velodrome-finance',
      veNftId: '4',
    },
    [chainTokenAddresses["10"].VELODOLAUSDCLP]: {
      address: chainTokenAddresses["10"].VELODOLAUSDCLP,
      name: 'DOLA-USDC',
      symbol: 'DOLA-USDC',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,
      isStable: true,
      isVeloLP: true,
      pairs: [
        chainTokenAddresses["10"].USDC, chainTokenAddresses["10"].DOLA
      ],
      protocolImage: PROTOCOL_IMAGES.VELO,
    },
    [chainTokenAddresses["10"].VELODOLALP]: {
      address: chainTokenAddresses["10"].VELODOLALP,
      name: 'DOLA-VELO',
      symbol: 'DOLA-VELO',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,      
      isVeloLP: true,
      pairs: [
        chainTokenAddresses["10"].VELO, chainTokenAddresses["10"].DOLA
      ],
      protocolImage: PROTOCOL_IMAGES.VELO,
    },
    [chainTokenAddresses["10"].VELODOLAMAILP]: {
      address: chainTokenAddresses["10"].VELODOLAMAILP,
      name: 'DOLA-MAI',
      symbol: 'DOLA-MAI',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,      
      isVeloLP: true,
      isStable: true,
      pairs: [
        chainTokenAddresses["10"].DOLA, chainTokenAddresses["10"].MAI
      ],
      protocolImage: PROTOCOL_IMAGES.VELO,
    },
    [chainTokenAddresses["10"].VELODOLAUSDplusLP]: {
      address: chainTokenAddresses["10"].VELODOLAUSDplusLP,
      name: 'DOLA-USD+',
      symbol: 'DOLA-USD+',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,
      isStable: true,
      isVeloLP: true,
      lpBalanceContract: '0x05d74f34ff651e80b0a1a4bD96D8867626Ac2ddD',
      pairs: [
        chainTokenAddresses["10"].USDplus, chainTokenAddresses["10"].DOLA
      ],
      protocolImage: PROTOCOL_IMAGES.VELO,
    },
  },
  "56": {
    CHAIN_COIN: {
      address: '',
      name: 'BNB',
      symbol: 'BNB',
      coingeckoId: 'binancecoin',
      image: TOKEN_IMAGES.BNB,
      decimals: 18,
    },
    [chainTokenAddresses["56"].WBNB]: {
      address: chainTokenAddresses["56"].WBNB,
      name: 'WBNB',
      symbol: 'WBNB',
      coingeckoId: 'wbnb',
      image: TOKEN_IMAGES.WBNB,
      decimals: 18,
    },
    [chainTokenAddresses["56"].THENA]: {
      address: chainTokenAddresses["56"].THENA,
      name: 'THENA',
      symbol: 'THENA',
      image: TOKEN_IMAGES.THENA,
      decimals: 18,
      coingeckoId: 'thena',
    },
    [chainTokenAddresses["56"].VETHENA]: {
      address: chainTokenAddresses["56"].VETHENA,
      name: 'veTHENA',
      symbol: 'veTHENA',
      image: TOKEN_IMAGES.veTHENA,
      decimals: 18,
      coingeckoId: 'thena',
      veNftId: '13',
      isLockedVeNft: true,
    },
    [chainTokenAddresses["56"].DOLA]: {
      address: chainTokenAddresses["56"].DOLA,
      ...DOLA,
    },
    [chainTokenAddresses["56"].CUSD]: {
      address: chainTokenAddresses["56"].CUSD,
      name: 'CUSD',
      symbol: 'CUSD',
      coingeckoId: 'coin98-dollar',
      image: TOKEN_IMAGES.CUSD,
      decimals: 18,
    },
    [chainTokenAddresses["56"].THENADOLACUSDLP]: {
      address: chainTokenAddresses["56"].THENADOLACUSDLP,
      name: 'DOLA-CUSD',
      symbol: 'DOLA-CUSD',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,
      isStable: true,
      isVeloLP: true,
      pairs: [
        chainTokenAddresses["56"].DOLA, chainTokenAddresses["56"].CUSD
      ],
      protocolImage: PROTOCOL_IMAGES.THENA,
    },[chainTokenAddresses["56"].THENADOLAWBNBLP]: {
      address: chainTokenAddresses["56"].THENADOLAWBNBLP,
      name: 'DOLA-WBNB',
      symbol: 'DOLA-WBNB',
      image: TOKEN_IMAGES.DOLA,
      decimals: 18,
      isLP: true,
      isVeloLP: true,
      pairs: [
        chainTokenAddresses["56"].DOLA, chainTokenAddresses["56"].WBNB
      ],
      protocolImage: PROTOCOL_IMAGES.THENA,
    },
  }
}
chainTokens["31337"] = chainTokens["1"];

const copyAsYearnVault = ['DOLA3POOLCRV', 'USDC', 'USDT', 'DAI', 'YFI', 'WETH'];
copyAsYearnVault.forEach(s => {
  const token = chainTokens["1"][chainTokenAddresses["1"][s]];
  const symbol = `yv${token.symbol}`.replace('yvDOLA-3POOL', 'yvcrvDOLA');
  chainTokens["1"][chainTokenAddresses["1"][`YV${s}`]] = {
    ...token,
    address: chainTokenAddresses["1"][`YV${s}`],
    symbol,
    protocolImage: chainTokens["1"][chainTokenAddresses["1"]['YFI']].image,
    name: symbol,
    coingeckoId: undefined,
    isInPausedSection: false,
    isLP: false,
    isCrvLP: false,
    pairs: undefined,
    image: symbol.startsWith('yvcrv') ? 'https://assets.coingecko.com/markets/images/538/small/Curve.png?1591605481' : token.image,
  }
})

export const TOKENS: TokenList = {
  ...chainTokens[process.env.NEXT_PUBLIC_CHAIN_ID!],
  [process.env.NEXT_PUBLIC_REWARD_TOKEN!]: {
    address: process.env.NEXT_PUBLIC_REWARD_TOKEN,
    name: process.env.NEXT_PUBLIC_REWARD_TOKEN_NAME,
    symbol: process.env.NEXT_PUBLIC_REWARD_TOKEN_SYMBOL,
    coingeckoId: process.env.NEXT_PUBLIC_REWARD_TOKEN_CG_ID,
    image: TOKEN_IMAGES.INV,
    decimals: 18,
    order: 0,
  },
  [process.env.NEXT_PUBLIC_DOLA!]: {
    address: process.env.NEXT_PUBLIC_DOLA,
    ...DOLA,
  },
};

const copyToFtm = ["DOLA", "INV", "USDC", "WFTM"];
copyToFtm.forEach(sym => {
  chainTokens["250"][chainTokenAddresses["250"][sym]] = {
    ...TOKENS[chainTokenAddresses["1"][sym]],
    address: chainTokenAddresses["250"][sym],
  }
});

export const CHAIN_TOKENS: { [key: string]: TokenList } = { ...chainTokens, [process.env.NEXT_PUBLIC_CHAIN_ID!]: TOKENS };

const toV1 = (token: Token) => {
  if(!token) return {};
  return {
    ...token,
    symbol: `${token.symbol}-v1`,
    name: `${token.name}-v1`,
    isInPausedSection: true,
    badge: pausedBadge,
    order: 1000,
  }
}

/* 
 * Anchor Markets Underlyings
 * Markets listed here will appear in UI
 * Key: Anchor Market Address, value: Underlying Token
 */
const chainUnderlying = {
  "1": {
    '0x697b4acAa24430F254224eB794d2a85ba1Fa1FB8': toV1(TOKENS.CHAIN_COIN),
    '0x17786f3813E6bA35343211bd8Fe18EC4de14F28b': toV1(getToken(TOKENS, chainTokenAddresses["1"].WBTC)!),
    '0xde2af899040536884e062D3a334F2dD36F34b4a4': toV1(getToken(TOKENS, chainTokenAddresses["1"].YFI)!),
    // v2 markets
    '0x8e103Eb7a0D01Ab2b2D29C91934A9aD17eB54b86': { ...TOKENS.CHAIN_COIN, order: 10 },
    '0xE8A2eb30E9AB1b598b6a5fc4aa1B80dfB6F90753': getToken(TOKENS, chainTokenAddresses["1"].WBTC!, { order: 20 }),
    '0x55e9022e1E28831609B22F773fAdb41318F8a8Cc': getToken(TOKENS, chainTokenAddresses["1"].YFI!, { order: 30 }),
    // others
    '0x7Fcb7DAC61eE35b3D4a51117A7c58D53f0a8a670': getToken(TOKENS, chainTokenAddresses["1"].DOLA, { order: 1 }),
    '0xD60B06B457bFf7fc38AC5E7eCE2b5ad16B288326': getToken(TOKENS, chainTokenAddresses["1"].XSUSHI, { order: 80 }),
    '0xA978D807614c3BFB0f90bC282019B2898c617880': getToken(TOKENS, chainTokenAddresses["1"].STETH, { order: 60 }),
    '0xc528b0571D0BE4153AEb8DdB8cCeEE63C3Dd7760': getToken(TOKENS, chainTokenAddresses["1"].DOLA3POOLCRV, { order: 70 }),
    '0x4B228D99B9E5BeD831b8D7D2BCc88882279A16BB': getToken(TOKENS, chainTokenAddresses["1"].INVDOLASLP, { order: 50 }),
    '0x0BC08f2433965eA88D977d7bFdED0917f3a0F60B': getToken(TOKENS, chainTokenAddresses["1"].FLOKI),
    // yearn vaults
    '0x3cFd8f5539550cAa56dC901f09C69AC9438E0722': getToken(TOKENS, chainTokenAddresses["1"].YVDOLA3POOLCRV, { order: 40 }),
    '0x4597a4cf0501b853b029cE5688f6995f753efc04': getToken(TOKENS, chainTokenAddresses["1"].YVUSDT, { order: 41 }),
    '0x7e18AB8d87F3430968f0755A623FB35017cB3EcA': getToken(TOKENS, chainTokenAddresses["1"].YVUSDC, { order: 42 }),
    '0xD79bCf0AD38E06BC0be56768939F57278C7c42f7': getToken(TOKENS, chainTokenAddresses["1"].YVDAI, { order: 43 }),
    // bacth 2
    '0xE809aD1577B7fF3D912B9f90Bf69F8BeCa5DCE32': getToken(TOKENS, chainTokenAddresses["1"].YVYFI),
    '0xD924Fc65B448c7110650685464c8855dd62c30c0': getToken(TOKENS, chainTokenAddresses["1"].YVWETH),
    '0xa6F1a358f0C2e771a744AF5988618bc2E198d0A0': getToken(TOKENS, chainTokenAddresses["1"].YVCRVCVXETH),
    // batch 3
    '0xb7159DfbAB6C99d3d38CFb4E419eb3F6455bB547': getToken(TOKENS, chainTokenAddresses["1"].YVCRVIB),
    '0x1429a930ec3bcf5Aa32EF298ccc5aB09836EF587': getToken(TOKENS, chainTokenAddresses["1"].YVCRV3CRYPTO),
    '0xD904235Dc0CD28f42AEECc0CD6A7126d871edaa4': getToken(TOKENS, chainTokenAddresses["1"].YVCRVSTEHWETH),
  }
}
chainUnderlying["31337"] = chainUnderlying["1"];

const underlying: TokenList = {
  ...chainUnderlying[process.env.NEXT_PUBLIC_CHAIN_ID!],
}

if (HAS_REWARD_TOKEN) {
  underlying[process.env.NEXT_PUBLIC_REWARD_STAKED_TOKEN!] = getToken(TOKENS, process.env.NEXT_PUBLIC_REWARD_TOKEN);
  if (process.env.NEXT_PUBLIC_REWARD_STAKED_TOKEN_OLD) {
    underlying[process.env.NEXT_PUBLIC_REWARD_STAKED_TOKEN_OLD] = {
      ...getToken(TOKENS, process.env.NEXT_PUBLIC_REWARD_TOKEN, { order: 1000 }), isInPausedSection: true,
    };
  }
}

export const UNDERLYING = underlying;

export const REWARD_TOKEN = getRewardToken()
export const RTOKEN_CG_ID = REWARD_TOKEN?.coingeckoId!;
export const RTOKEN_SYMBOL = REWARD_TOKEN?.symbol!;

export const BONDS = [
  {
    input: chainTokenAddresses["1"].INVDOLASLP,
    abiType: 1,
    ctoken: '0x4B228D99B9E5BeD831b8D7D2BCc88882279A16BB',
    underlying: getToken(TOKENS, chainTokenAddresses["1"].INVDOLASLP)!,
    bondContract: '0x34eb308c932fe3bbda8716a1774ef01d302759d9',
    howToGetLink: 'https://app.sushi.com/add/0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68/0x865377367054516e17014ccded1e7d814edc9ce4',
  },
  {
    input: chainTokenAddresses["1"].DOLA,
    abiType: 0,
    ctoken: '0x7Fcb7DAC61eE35b3D4a51117A7c58D53f0a8a670',
    underlying: getToken(TOKENS, chainTokenAddresses["1"].DOLA)!,
    bondContract: '0xdBfBb1140F8ba147ca4C8c27A2e576dfed0449BD',
    howToGetLink: 'https://www.inverse.finance/swap/DAI/DOLA',
    inputPrice: 1,
  },
  {
    input: chainTokenAddresses["1"].DOLA3POOLCRV,
    abiType: 0,
    ctoken: '0xc528b0571D0BE4153AEb8DdB8cCeEE63C3Dd7760',
    underlying: getToken(TOKENS, chainTokenAddresses["1"].DOLA3POOLCRV)!,
    bondContract: '0x8E57A30A3616f65e7d14c264943e77e084Fddd25',
    howToGetLink: 'https://curve.fi/factory/27/deposit',
    disabled: true,
  },
  {
    input: chainTokenAddresses["1"].DOLA,
    abiType: 0,
    ctoken: '0x7Fcb7DAC61eE35b3D4a51117A7c58D53f0a8a670',
    underlying: getToken(TOKENS, chainTokenAddresses["1"].DOLA)!,
    bondContract: '0xBfB90b9CE47F36841c776a1B82EE49157D4c746b',
    howToGetLink: 'https://www.inverse.finance/swap/DAI/DOLA',
    inputPrice: 1,
  },
  {
    input: chainTokenAddresses["1"].DOLA,
    abiType: 0,
    ctoken: '0x7Fcb7DAC61eE35b3D4a51117A7c58D53f0a8a670',
    underlying: getToken(TOKENS, chainTokenAddresses["1"].DOLA)!,
    bondContract: '0x3Fe012C3a1A747f249a376CC9536f9a94796eE81',
    howToGetLink: 'https://www.inverse.finance/swap/DAI/DOLA',
    inputPrice: 1,
  },
]

export const REPAY_ALL_CONTRACTS = {
  '0x697b4acAa24430F254224eB794d2a85ba1Fa1FB8': '0xbE0C9650cf8Ce5279b990e7A6634c63323adfEAE',
  '0x8e103Eb7a0D01Ab2b2D29C91934A9aD17eB54b86': '0xa7711C2432af5518fedBeE4b6AA9385e342d844F',
}

export const CHAIN_TOKEN_ADDRESSES = chainTokenAddresses;