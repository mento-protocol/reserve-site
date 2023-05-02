export const CURVE_FACTORY_POOL_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function get_balances() view returns (uint256[2])",
]

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
]

export const STAKED_CELO_MANAGER_ABI = ["function toCelo(uint256 amount) view returns (uint256)"]
