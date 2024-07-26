import { StableToken, Token } from "@celo/contractkit";

export type Tokens =
  | "CELO"
  | "BTC"
  | "DAI"
  | "ETH"
  | "cMCO2"
  | "USDC"
  | "EUROC"
  | "WBTC"
  | "WETH"
  | "stEUR"
  | "sDAI"
  | "stETH"
  | "USDT"
  | "cEUR"
  | "cUSD"
  | "cREAL"
  | "cKES"
  | "eXOF"
  | Token
  | StableToken;

export interface Address {
  address: string;
  label: string;
  token: Tokens;
  status?: "active" | "inactive";
}

export interface TokenModel {
  token: Tokens;
  units: number;
  value: number;
  updated: number;
  hasError?: boolean;
}
