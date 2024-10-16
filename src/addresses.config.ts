import { Tokens } from "./service/Data";

const wallets = {
  RESERVE_MULTISIG_ETH: "0xd0697f70E79476195B742d5aFAb14BE50f98CC1E",
  CUSTODIAN_ETH: "0x26ac3A7b8a675b741560098fff54F94909bE5E73",
};

const tokensAddresses = {
  WBTC_ON_ETH: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  WETH_ON_ETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  STEUR_ON_CELO: "0x004626a008b1acdc4c74ab51644093b155e59a23",
  SAVINGS_DAI: "0x83f20f44975d03b1b09e64809b757c47f942beea",
  LIDO_STAKED_ETH: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
  USDT_ON_CELO: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
  GLO_ON_CELO: "0x4f604735c1cf31399c6e711d5962b2b3e0225ad3",
};

// TODO: These should be consolidated in the addresses.config.ts file.
export const CMCO2_ADDRESS = "0x32a9fe697a32135bfd313a6ac28792dae4d9979d";

export const RESERVE_CMCO2_ADDRESS =
  "0x298FbD6dad2Fc2cB56d7E37d8aCad8Bf07324f67";

export const RESERVE_MULTISIG_CELO =
  "0x87647780180b8f55980c7d3ffefe08a9b29e9ae1";

export const GOVERNANCE_CELO = "0xD533Ca259b330c7A88f74E000a3FaEa2d63B7972";

export const CURVE_FACTORY_POOL_ADDRESS =
  "0x854ec4ede802e1205802c2bd2c08a43f778fc9a6";

export const UNIV3_FACTORY_ADDRESS =
  "0xAfE208a311B21f13EF87E33A90049fC17A7acDEc";

export const UNIV3_POSITION_TOKEN_ADDRESS =
  "0x3d79EdAaBC0EaB6F08ED885C05Fc0B014290D95A";

export const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

export const EXOF_ADDRESS = "0x73F93dcc49cB8A239e2032663e9475dd5ef29A08";

export const USDC_AXELAR_ADDRESS = "0xEB466342C4d449BC9f53A865D5Cb90586f405215";

export const EUROC_AXELAR_ADDRESS =
  "0x061cc5a2C863E0C1Cb404006D559dB18A34C762d";

export const BTC_AXELAR_ADDRESS = "0x1a35EE4640b0A3B87705B0A4B45D227Ba60Ca2ad";

export const ETH_AXELAR_ADDRESS = "0xb829b68f57CC546dA7E5806A929e53bE32a4625D";

export const USDC_WORMHOLE_ADDRESS =
  "0x37f750B7cC259A2f741AF45294f6a16572CF5cAd";

export const BTC_WORMHOLE_ADDRESS =
  "0xd71Ffd0940c920786eC4DbB5A12306669b5b81EF";

export const ETH_WORMHOLE_ADDRESS =
  "0x66803FB87aBd4aaC3cbB3fAd7C3aa01f6F3FB207";

export const STAKED_CELO_MANAGER_ADDRESS =
  "0x0239b96D10a434a56CC9E09383077A0490cF9398";

export const STAKED_CELO_ERC20_ADDRESS =
  "0xC668583dcbDc9ae6FA3CE46462758188adfdfC24";

export const CELO_ADDRESS = "0x471EcE3750Da237f93B8E339c536989b8978a438";

export const RESERVE_ADDRESS = "0x9380fA34Fd9e4Fd14c06305fd7B6199089eD4eb9";

export const USDC_CELO_NATIVE_ADDRESS =
  "0xcebA9300f2b948710d2653dD7B07f33A8B32118C";

export const CKES_ADDRESS = "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0";

export enum AssetType {
  Native = "Native",
  ERC20 = "ERC20",
  ERC20InCurvePool = "ERC20InCurvePool",
}

export enum Network {
  ETH = "ethereum",
  CELO = "celo",
  BTC = "btc",
}

export interface BaseReserveAsset {
  token: Tokens;
  label: string;
  addresses: string[];
  network: Network;
  isWrappedAsset?: boolean;
}

export interface ERC20InCurvePoolReserveAsset extends BaseReserveAsset {
  assetType: AssetType.ERC20InCurvePool;
  curvePool?: string;
}

export interface ERC20ReserveAsset extends BaseReserveAsset {
  assetType: AssetType.ERC20;
  tokenAddress: string;
  decimals?: number;
}

export interface NativeReserveAsset extends BaseReserveAsset {
  assetType: AssetType.Native;
}

interface DisplayAsReserveAddress {
  shouldDisplay: boolean;
}

export type ReserveCrypto =
  | (ERC20ReserveAsset & DisplayAsReserveAddress)
  | (NativeReserveAsset & DisplayAsReserveAddress)
  | (ERC20InCurvePoolReserveAsset & DisplayAsReserveAddress);

const ADDRESSES: ReserveCrypto[] = [
  {
    assetType: AssetType.ERC20,
    label: "Operational Multisig on Celo",
    token: "USDC",
    addresses: [RESERVE_MULTISIG_CELO],
    tokenAddress: USDC_AXELAR_ADDRESS,
    network: Network.CELO,
    shouldDisplay: true,
  },
  {
    assetType: AssetType.Native,
    label: "Bitcoin",
    token: "BTC",
    addresses: [
      "38EPdP4SPshc5CiUCzKcLP9v7Vqo5u1HBL",
      "3Hc1Wje1DeJU5ahXdmD8Pt2yAfoYep331z",
    ],
    network: Network.BTC,
    shouldDisplay: true,
  },
  {
    assetType: AssetType.ERC20,
    label: "Mento Reserve on Ethereum",
    token: "sDAI",
    decimals: 18,
    addresses: [wallets.RESERVE_MULTISIG_ETH],
    tokenAddress: tokensAddresses.SAVINGS_DAI,
    network: Network.ETH,
    shouldDisplay: true,
  },
  {
    assetType: AssetType.ERC20InCurvePool,
    label: "Curve Pool on Celo",
    token: "USDC",
    addresses: [CURVE_FACTORY_POOL_ADDRESS],
    network: Network.CELO,
    shouldDisplay: true,
  },
  {
    assetType: AssetType.ERC20,
    label: "GloDollar",
    token: "USDGLO",
    decimals: 18,
    addresses: [RESERVE_MULTISIG_CELO],
    tokenAddress: tokensAddresses.GLO_ON_CELO,
    network: Network.CELO,
    shouldDisplay: false,
  },
  {
    assetType: AssetType.Native,
    label: "ETH",
    token: "ETH",
    addresses: [
      "0xe1955eA2D14e60414eBF5D649699356D8baE98eE",
      "0x8331C987D9Af7b649055fa9ea7731d2edbD58E6B",
      wallets.CUSTODIAN_ETH,
      wallets.RESERVE_MULTISIG_ETH,
    ],
    network: Network.ETH,
    shouldDisplay: false,
  },
  {
    assetType: AssetType.ERC20,
    label: "DAI",
    token: "DAI",
    addresses: [
      "0x16B34Ce9A6a6F7FC2DD25Ba59bf7308E7B38E186",
      wallets.RESERVE_MULTISIG_ETH,
    ],
    tokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
    network: Network.ETH,
    shouldDisplay: false,
  },
  {
    assetType: AssetType.ERC20,
    label: "USDC",
    token: "USDC",
    decimals: 6,
    addresses: [wallets.RESERVE_MULTISIG_ETH, wallets.CUSTODIAN_ETH],
    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    network: Network.ETH,
    shouldDisplay: false,
  },
  {
    assetType: AssetType.ERC20,
    label: "EUROC",
    token: "EUROC",
    decimals: 6,
    addresses: [wallets.RESERVE_MULTISIG_ETH, wallets.CUSTODIAN_ETH],
    tokenAddress: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
    network: Network.ETH,
    shouldDisplay: false,
  },
  {
    assetType: AssetType.ERC20,
    label: "ETH",
    token: "WETH",
    addresses: [wallets.RESERVE_MULTISIG_ETH, wallets.CUSTODIAN_ETH],
    tokenAddress: tokensAddresses.WETH_ON_ETH,
    network: Network.ETH,
    isWrappedAsset: true,
    shouldDisplay: false,
  },
  {
    assetType: AssetType.ERC20,
    label: "BTC",
    token: "WBTC",
    decimals: 8,
    addresses: [wallets.CUSTODIAN_ETH, wallets.RESERVE_MULTISIG_ETH],
    tokenAddress: tokensAddresses.WBTC_ON_ETH,
    network: Network.ETH,
    isWrappedAsset: true,
    shouldDisplay: false,
  },
  {
    assetType: AssetType.ERC20,
    label: "Staked agEUR",
    token: "stEUR",
    decimals: 18,
    addresses: [RESERVE_MULTISIG_CELO],
    tokenAddress: tokensAddresses.STEUR_ON_CELO,
    network: Network.CELO,
    shouldDisplay: false,
  },
  {
    assetType: AssetType.ERC20,
    label: "Lido Staked ETH",
    token: "stETH",
    decimals: 18,
    addresses: [wallets.RESERVE_MULTISIG_ETH],
    tokenAddress: tokensAddresses.LIDO_STAKED_ETH,
    network: Network.ETH,
    shouldDisplay: false,
  },
  {
    assetType: AssetType.ERC20,
    label: "USDT",
    token: "USDT",
    decimals: 6,
    addresses: [RESERVE_MULTISIG_CELO, RESERVE_ADDRESS],
    tokenAddress: tokensAddresses.USDT_ON_CELO,
    network: Network.CELO,
    shouldDisplay: false,
  },
];
// WHEN Adding new TOKENS also update the TokenColor enum in PieChart.tsx

export default ADDRESSES;

export type ReserveCryptoForDisplay = Omit<ReserveCrypto, "addresses"> & {
  addresses: { address: string; symbol: Tokens }[];
};

export function generateLink(token: ReserveCrypto, address: string) {
  if (
    token.assetType == AssetType.ERC20 ||
    token.assetType == AssetType.Native
  ) {
    switch (token.token) {
      case "CELO":
        return `https://celoscan.io/tokenholdings?a=${address}`;
      case "BTC":
        return `https://blockchain.info/address/${address}`;
      case "ETH":
      case "USDC":
      case "EUROC":
      case "DAI":
      case "WBTC":
      case "WETH":
      case "stETH":
      case "sDAI":
        return token.network === Network.CELO
          ? `https://celoscan.io/tokenholdings?a=${address}`
          : `https://etherscan.io/tokenholdings?a=${address}`;
      case "stEUR":
        return `https://celoscan.io/tokenholdings?a=${address}`;
      case "USDT":
        return `https://celoscan.io/tokenholdings?a=${address}`;
    }
  } else if (token.assetType === AssetType.ERC20InCurvePool) {
    // TODO: This mimics the existing implementation but we can think of a better
    // way to link to this, e.g. by linking to the LP tokens of the pool.
    switch (token.token) {
      case "cUSD":
      case "USDC":
        return `https://celoscan.io/tokenholdings?a=${address}`;
    }
  }
}

export type ReserveAssetByLabel = Record<string /* label */, ReserveCrypto[]>;

export function combineTokenAddressesByLabel(
  assets: ReserveCrypto[],
): ReserveAssetByLabel {
  const labels = Array.from(new Set(assets.map((a) => a.label)));
  return Object.fromEntries(
    labels.map((label) => {
      return [label, assets.filter((asset) => asset.label === label)];
    }),
  );
}
