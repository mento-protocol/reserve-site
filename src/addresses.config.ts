import { Tokens } from "./service/Data"
import { RESERVE_MULTISIG_CELO } from "./contract-addresses"

const wallets = {
  RESERVE_MULTISIG_ETH: "0xd0697f70E79476195B742d5aFAb14BE50f98CC1E",
  RESERVE_MULTISIG_CELO,
  CUSTODIAN_ETH: "0x26ac3A7b8a675b741560098fff54F94909bE5E73",
}

const tokensAddresses = {
  WBTC_ON_ETH: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  WETH_ON_ETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  STEUR_ON_CELO: "0x004626a008b1acdc4c74ab51644093b155e59a23",
  SAVINGS_DAI: "0x83f20f44975d03b1b09e64809b757c47f942beea",
  LIDO_STAKED_ETH: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
}

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
  token: Tokens
  label: string
  addresses: string[]
  network: Network
  isWrappedAsset?: boolean
}

export interface ERC20InCurvePoolReserveAsset extends BaseReserveAsset {
  assetType: AssetType.ERC20InCurvePool
  curvePool?: string
}

export interface ERC20ReserveAsset extends BaseReserveAsset {
  assetType: AssetType.ERC20
  tokenAddress: string
  decimals?: number
}

export interface NativeReserveAsset extends BaseReserveAsset {
  assetType: AssetType.Native
}

export type ReserveCrypto = ERC20ReserveAsset | NativeReserveAsset | ERC20InCurvePoolReserveAsset

const ADDRESSES: ReserveCrypto[] = [
  {
    assetType: AssetType.Native,
    label: "BTC",
    token: "BTC",
    addresses: ["38EPdP4SPshc5CiUCzKcLP9v7Vqo5u1HBL", "3Hc1Wje1DeJU5ahXdmD8Pt2yAfoYep331z"],
    network: Network.BTC,
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
  },
  {
    assetType: AssetType.ERC20,
    label: "DAI",
    token: "DAI",
    addresses: ["0x16B34Ce9A6a6F7FC2DD25Ba59bf7308E7B38E186", wallets.RESERVE_MULTISIG_ETH],
    tokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
    decimals: 18,
    network: Network.ETH,
  },
  {
    assetType: AssetType.ERC20,
    label: "USDC",
    token: "USDC",
    decimals: 6,
    addresses: [wallets.RESERVE_MULTISIG_ETH, wallets.CUSTODIAN_ETH],
    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    network: Network.ETH,
  },
  {
    assetType: AssetType.ERC20,
    label: "EUROC",
    token: "EUROC",
    decimals: 6,
    addresses: [wallets.RESERVE_MULTISIG_ETH, wallets.CUSTODIAN_ETH],
    tokenAddress: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
    network: Network.ETH,
  },
  {
    assetType: AssetType.ERC20,
    label: "ETH",
    token: "WETH",
    addresses: [wallets.RESERVE_MULTISIG_ETH, wallets.CUSTODIAN_ETH],
    tokenAddress: tokensAddresses.WETH_ON_ETH,
    network: Network.ETH,
    isWrappedAsset: true,
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
  },
  {
    assetType: AssetType.ERC20,
    label: "Staked agEUR",
    token: "stEUR",
    decimals: 18,
    addresses: [wallets.RESERVE_MULTISIG_CELO],
    tokenAddress: tokensAddresses.STEUR_ON_CELO,
    network: Network.CELO,
  },
  {
    assetType: AssetType.ERC20,
    label: "Savings DAI",
    token: "sDAI",
    decimals: 18,
    addresses: [wallets.RESERVE_MULTISIG_ETH],
    tokenAddress: tokensAddresses.SAVINGS_DAI,
    network: Network.ETH,
  },
  {
    assetType: AssetType.ERC20,
    label: "Lido Staked ETH",
    token: "stETH",
    decimals: 18,
    addresses: [wallets.RESERVE_MULTISIG_ETH],
    tokenAddress: tokensAddresses.LIDO_STAKED_ETH,
    network: Network.ETH,
  },
]
// WHEN Adding new TOKENS also update the TokenColor enum in PieChart.tsx

export default ADDRESSES

export type ReserveCryptoForDisplay = Omit<ReserveCrypto, "addresses"> & {
  addresses: { address: string; symbol: Tokens }[]
}

export function generateLink(token: ReserveCrypto, address: string) {
  if (token.assetType == AssetType.ERC20 || token.assetType == AssetType.Native) {
    switch (token.token) {
      case "CELO":
        return `https://explorer.celo.org/address/${address}/coin_balances`
      case "BTC":
        return `https://blockchain.info/address/${address}`
      case "ETH":
      case "USDC":
      case "EUROC":
      case "DAI":
      case "WBTC":
      case "WETH":
      case "stETH":
      case "sDAI":
        return `https://etherscan.io/address/${address}`
      case "stEUR":
        return `https://explorer.celo.org/mainnet/address/${address}`
    }
  } else if (token.assetType === AssetType.ERC20InCurvePool) {
    // TODO: This mimics the existing implementation but we can think of a better
    // way to link to this, e.g. by linking to the LP tokens of the pool.
    switch (token.token) {
      case "cUSD":
      case "USDC":
        return `https://explorer.celo.org/mainnet/address/${address}/tokens#address-tabs`
    }
  }
}

export type ReserveAssetByLabel = Record<string /* label */, ReserveCrypto[]>

export function combineTokenAddressesByLabel(assets: ReserveCrypto[]): ReserveAssetByLabel {
  const labels = Array.from(new Set(assets.map((a) => a.label)))
  return Object.fromEntries(
    labels.map((label) => {
      return [label, assets.filter((asset) => asset.label === label)]
    })
  )
}
