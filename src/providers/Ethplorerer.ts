import { Providers } from "./Providers"
import BigNumber from "bignumber.js"
import { providerError, providerOk, ProviderResult } from "src/utils/ProviderResult"

// usage limits 4,762,800 req/week | 35,000req /hour

interface TokenInfo {
  address: string
  name: string
  symbol: string
  decimals: string
}

interface Token {
  tokenInfo: TokenInfo // token data (same format as token info),
  balance: string // token balance (as is, not reduced to a floating point value),
  totalIn: string // total incoming token value
  totalOut: string // total outgoing token value
}

interface AcountInfo {
  error?: {
    code: number
    message: string
  }
  address: string // address,
  ETH: {
    //# ETH specific information
    balance: string // # ETH balance
    totalIn: string // Total incoming ETH value (showETHTotals parameter should be set to get this value)
    totalOut: string // Total outgoing ETH value (showETHTotals parameter should be set to get this value)
  }
  contractInfo?: {
    // exists if specified address is a contract
    creatorAddress: string // contract creator address,
    transactionHash: string // contract creation transaction hash,
    timestamp: string // contract creation timestamp
  }
  tokenInfo?: TokenInfo // exists if specified address is a token contract address (same format as token info),
  tokens: Token[] // exists if specified address has any token balances
  countTxs: string // Total count of incoming and outgoing transactions (including creation one),
}

const API_KEY = process.env.ETHPLORER_KEY

const BASE_URL = "https://api.ethplorer.io"

export async function getETHBalance(address: string): Promise<ProviderResult<number>> {
  try {
    const response = await fetch(`${BASE_URL}/getAddressInfo/${address}?apiKey=${API_KEY}`)
    const data = (await response.json()) as AcountInfo
    return providerOk(formatETHBalance(data?.ETH?.balance), Providers.ethplorer)
  } catch (error) {
    return providerError(error, Providers.ethplorer)
  }
}

export async function getERC20OnEthereumBalance(
  tokenAddress: string,
  address: string
): Promise<ProviderResult<number>> {
  try {
    const response = await fetch(`${BASE_URL}/getAddressInfo/${address}?apiKey=${API_KEY}`)
    const data = (await response.json()) as AcountInfo
    const token = data.tokens?.find((token) => token?.tokenInfo?.address === tokenAddress)
    const balance = new BigNumber(token.balance)
    const exp = new BigNumber(10).pow(token.tokenInfo.decimals)

    return providerOk(balance.dividedBy(exp).toNumber(), Providers.ethplorer)
  } catch (error) {
    return providerError(error, Providers.ethplorer)
  }
}

function formatETHBalance(value: string) {
  return new BigNumber(value).decimalPlaces(8).toNumber()
}
