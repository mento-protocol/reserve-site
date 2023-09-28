import { Tokens } from "./service/Data"

const wallets = {
  CUSTODIAN_SAFE: "0xd0697f70E79476195B742d5aFAb14BE50f98CC1E",
}

const tokensAddresses = {
  WBTC_ON_ETH: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  WETH_ON_ETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
}

export interface ReserveCrypto {
  token: Tokens
  label: string
  addresses: string[]
  tokenAddress?: string
  decimals?: number
}

export type ReserveCryptoForDisplay = Omit<ReserveCrypto, "addresses"> & {
  addresses: { address: string; symbol: Tokens }[]
}

const ADDRESSES: ReserveCrypto[] = [
  {
    label: "BTC",
    token: "BTC",
    addresses: ["38EPdP4SPshc5CiUCzKcLP9v7Vqo5u1HBL", "3Hc1Wje1DeJU5ahXdmD8Pt2yAfoYep331z"],
  },
  {
    label: "ETH",
    token: "ETH",
    addresses: [
      "0xe1955eA2D14e60414eBF5D649699356D8baE98eE",
      "0x8331C987D9Af7b649055fa9ea7731d2edbD58E6B",
      wallets.CUSTODIAN_SAFE,
    ],
  },
  {
    label: "DAI",
    token: "DAI",
    addresses: [
      "0x16B34Ce9A6a6F7FC2DD25Ba59bf7308E7B38E186",
      "0xd0697f70E79476195B742d5aFAb14BE50f98CC1E",
    ],
    tokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  {
    label: "USDC",
    token: "USDC",
    decimals: 6,
    addresses: ["0x26ac3A7b8a675b741560098fff54F94909bE5E73", wallets.CUSTODIAN_SAFE],
    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  {
    label: "ETH",
    token: "WETH",
    addresses: [wallets.CUSTODIAN_SAFE],
    tokenAddress: tokensAddresses.WETH_ON_ETH,
  },
  {
    label: "BTC",
    token: "WBTC",
    addresses: [wallets.CUSTODIAN_SAFE],
    tokenAddress: tokensAddresses.WBTC_ON_ETH,
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
    case "DAI":
    case "WBTC":
    case "WETH":
      return `https://etherscan.io/address/${address}`
    case "cUSD in Curve Pool":
    case "USDC in Curve Pool":
      return `https://explorer.celo.org/mainnet/address/${address}/tokens#address-tabs`
    case "Partial Reserve":
      return `https://explorer.celo.org/address/${address}`
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
    .map((token, i, arr) => {
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
