export const CURVE_FACTORY_POOL_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function get_balances() view returns (uint256[2])",
];

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
];

export const STAKED_CELO_MANAGER_ABI = [
  "function toCelo(uint256 amount) view returns (uint256)",
];

export const UNIV3_POOL_ABI = [
  "function slot0() view returns (uint160, int24, uint16, uint16, uint16, uint8, bool)",
];

export const UNIV3_POSITION_TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function tokenOfOwnerByIndex(address, uint256) view returns (uint256)",
  "function positions(uint256) view returns (uint96, address, address, address, uint24, int24, int24, uint128, uint256, uint256, uint128, uint128)",
];

export const UNIV3_FACTORY_ABI = [
  "function getPool(address, address, uint24) view returns (address)",
];
