import { StableToken, Token } from "@celo/contractkit"

export type Tokens =
  | "BTC"
  | "DAI"
  | "ETH"
  | "cMCO2"
  | "USDC"
  | StableToken
  | Token
  | "cUSD in Curve Pool"
  | "USDC in Curve Pool"
export interface Address {
  address: string
  label: string
  token: Tokens
  status?: "active" | "inactive"
}

export interface TokenModel {
  token: Tokens
  units: number | null
  value: number | null
  updated: number | null
  hasError: boolean
}
