export const CURVE_FACTORY_POOL_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function get_balances() view returns (uint256[2])",
]

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
]

export const UNIV3_POOL_ABI = ["function liquidity() view returns (uint256)"]

export const UNIV3_POSITION_TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function tokenOfOwnerByIndex(address, uint256) view returns (uint256)",
  "function positions(uint256) view returns (uint96, address, address, address, uint24, int24, int24, uint128, uint256, uint256, uint128, uint128)",
]

export const UNIV3_FACTORY_ABI = [
  "function getPool(address, address, uint24) view returns (address)",
]
