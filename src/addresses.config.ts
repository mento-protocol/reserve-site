import { Tokens } from "./service/Data"

export interface ReserveCrypto {
  token: Tokens
  label: string
  addresses: string[]
  tokenAddress?: string
  decimals?: number
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
    ],
  },
  {
    label: "DAI",
    token: "DAI",
    addresses: ["0x16B34Ce9A6a6F7FC2DD25Ba59bf7308E7B38E186"],
    tokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  {
    label: "USDC",
    token: "USDC",
    decimals: 6,
    addresses: ["0x26ac3A7b8a675b741560098fff54F94909bE5E73"],
    tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
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
      return `https://etherscan.io/address/${address}`
    case "cUSD in Curve Pool":
    case "USDC in Curve Pool":
      return `https://explorer.celo.org/mainnet/address/${address}/tokens#address-tabs`
    case "Partial Reserve":
      return `https://explorer.celo.org/address/${address}`
  }
}
