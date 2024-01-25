import { Tokens } from "./service/Data"

const wallets = {
  RESERVE_MULTISIG_ETH: "0xd0697f70E79476195B742d5aFAb14BE50f98CC1E",
  RESERVE_MULTISIG_CELO: "0x87647780180b8f55980c7d3ffefe08a9b29e9ae1",
  CUSTODIAN_ETH: "0x26ac3A7b8a675b741560098fff54F94909bE5E73",
}

const tokensAddresses = {
  WBTC_ON_ETH: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  WETH_ON_ETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  STEUR_ON_CELO: "0x004626a008b1acdc4c74ab51644093b155e59a23",
}

export enum AssetType {
  Native = "Native",
  ERC20 = "ERC20",
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
}

export interface ERC20ReserveAsset extends BaseReserveAsset {
  assetType: AssetType.ERC20
  tokenAddress: string
  decimals?: number
}

export interface NativeReserveAsset extends BaseReserveAsset {
  assetType: AssetType.Native
}

export type ReserveCrypto = ERC20ReserveAsset | NativeReserveAsset

export type ReserveCryptoForDisplay = Omit<ReserveCrypto, "addresses"> & {
  addresses: { address: string; symbol: Tokens }[]
}

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
    addresses: [wallets.RESERVE_MULTISIG_ETH],
    tokenAddress: tokensAddresses.WETH_ON_ETH,
    network: Network.ETH,
  },
  {
    assetType: AssetType.ERC20,
    label: "BTC",
    token: "WBTC",
    addresses: [wallets.CUSTODIAN_ETH],
    tokenAddress: tokensAddresses.WBTC_ON_ETH,
    network: Network.ETH,
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
]
// WHEN Adding new TOKENS also update the TokenColor enum in PieChart.tsx

export default ADDRESSES

export function generateLink(token: Tokens, address: string) {
  switch (token) {
    case "CELO":
      return `https://explorer.celo.org/address/${address}/coin_balances`
    case "BTC":
      return `https://blockchain.info/address/${address}`
    case "ETH":
      return `https://etherscan.io/address/${address}`
    case "USDC":
    case "EUROC":
    case "DAI":
    case "WBTC":
    case "WETH":
      return `https://etherscan.io/address/${address}`
    case "cUSD in Curve Pool":
    case "USDC in Curve Pool":
      return `https://explorer.celo.org/mainnet/address/${address}/tokens#address-tabs`
    case "stEUR":
      return `https://explorer.celo.org/mainnet/address/${address}`
  }
}

const tokensToCombine: Tokens[] = ["WETH", "WBTC"] // List of tokens to remove and combine holding addresses with another token with the same labe

export function combineTokenAddressesByLabel(rawTokenList: ReserveCrypto[]) {
  const combinedList = rawTokenList
    .map((token) => {
      // Add symbols to token addresses to facilitate link gereration on a per address basis instead of per token basis
      return {
        ...token,
        addresses: token.addresses.map((address) => ({ address, symbol: token.token })),
      }
    })
    .map((token, _, arr) => {
      // Combine addresses of tokens that are in the list of tokens to combine with an existing token with the same label
      if (tokensToCombine.includes(token.token)) {
        const tokenToCombineWith = arr.find((t) => t.label === token.label)
        if (tokenToCombineWith) {
          tokenToCombineWith.addresses = [...tokenToCombineWith.addresses, ...token.addresses]
        }
      }
      // Do nothing if token is not in the list of tokens to combine
      return token
    })
    .filter((token) => !tokensToCombine.includes(token.token)) // Remove tokens which addresses were flagged to be combined

  for (const token of combinedList) {
    // Remove duplicate addresses introducted by combining tokens which use the same label for different tokens from the same wallet
    token.addresses = token.addresses.filter(
      (addressWithSymbol, i, arr) =>
        arr.findIndex((a) => a.address === addressWithSymbol.address) === i
    )
  }

  return combinedList
}
