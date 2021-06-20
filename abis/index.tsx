import { ANCHOR_TOKENS, COMPTROLLER, LENS, TOKENS, XINV } from '@inverse/config'

export const COMPTROLLER_ABI = [
  'function claimComp(address) public',
  'function compBorrowerIndex(address, address) public view returns (uint256)',
  'function compBorrowState(address) public view returns (uint224, uint32)',
  'function compSpeeds(address) public view returns (uint256)',
  'function compSupplierIndex(address, address) public view returns (uint256)',
  'function compSupplyState(address) public view returns (uint224, uint32)',
  'function enterMarkets(address[]) returns (uint[])',
  'function exitMarket(address) returns (uint256)',
  'function getAccountLiquidity(address) external view returns (uint256, uint256, uint256)',
  'function getAllMarkets() public view returns (address[])',
  'function getAssetsIn(address) view returns (address[])',
  'function markets(address) external view returns (bool, uint256, bool)',
]

export const CTOKEN_ABI = [
  'function balanceOf(address) external view returns (uint256)',
  'function borrow(uint256) returns (uint256)',
  'function borrowBalanceStored(address) external view returns (uint256)',
  'function borrowIndex() public view returns (uint256)',
  'function borrowRatePerBlock() external view returns (uint256)',
  'function exchangeRateCurrent() public view returns (uint256)',
  'function exchangeRateStored() public view returns (uint256)',
  'function getCash() external view returns (uint256)',
  'function mint(uint256) returns (uint256)',
  'function redeemUnderlying(uint256) returns (uint256)',
  'function repayBorrow(uint256) returns (uint256)',
  'function supplyRatePerBlock() external view returns (uint256)',
  'function totalBorrowsCurrent() external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function underlying() external view returns (address)',
]

export const CETHER_ABI = ['function mint() payable', 'function repayBorrow() payable']

export const ERC20_ABI = [
  'function allowance(address, address) external view returns (uint256)',
  'function approve(address, uint256)',
  'function balanceOf(address) external view returns (uint256)',
]

export const GOVERNANCE_ABI = [
  'function proposalCount() public view returns (uint256)',
  'function proposals(uint256) public view returns (uint256 id, address proposer, uint256 eta, uint256 startBlock, uint256 endBlock, uint256 forVotes, uint256 againstVotes, bool canceled, bool executed)',
]

export const LENS_ABI = [
  'function getCompBalanceMetadataExt(address, address, address) returns (uint256, uint256, uint256, uint256)',
]

export const STABILIZER_ABI = ['function supply() external view returns (uint256)']

export const VAULT_ABI = [
  'function totalSupply() external view returns (uint256)',
  'function underlying() external view returns (address)',
]

export const XINV_ABI = [
  'function balanceOf(address) external view returns (uint256)',
  'function exchangeRateStored() public view returns (uint256)',
  'function getCash() external view returns (uint256)',
  'function rewardPerBlock() external view returns (uint256)',
  'function totalSupply() external view returns (uint256)',
  'function underlying() external view returns (address)',
]

export const ABIs = new Map<string, any>(
  // @ts-ignore
  ANCHOR_TOKENS.map((address) => [address, CTOKEN_ABI]).concat(
    [
      [XINV, XINV_ABI],
      [COMPTROLLER, COMPTROLLER_ABI],
      [LENS, LENS_ABI],
    ],
    Object.keys(TOKENS).map((address) => [address, ERC20_ABI])
  )
)
