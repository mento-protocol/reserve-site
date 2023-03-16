import BigNumber from "bignumber.js"
import { providerError, providerOk, ProviderResult } from "src/utils/ProviderResult"
import { Providers } from "./Providers"

// Usage limit 5 calls per second

interface EthScanPriceResponse {
  status: string
  message: string
  result: {
    ethbtc: string
    ethbtc_timestamp: string
    ethusd: string
    ethusd_timestamp: string
  }
}

interface EthScanBalanceResponse {
  status: string
  message: string
  result: string
}

const API_KEY = process.env.ETHERSCAN_API

export async function getEthPrice(): Promise<ProviderResult<number>> {
  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_KEY}`
    )
    const data = (await response.json()) as EthScanPriceResponse
    return providerOk(
      Number(data.result.ethusd),
      Providers.etherscan,
      Number(data.result.ethusd_timestamp)
    )
  } catch (error) {
    return providerError(error, Providers.etherscan)
  }
}

export async function getETHBalance(address: string): Promise<ProviderResult<number>> {
  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${API_KEY}`
    )
    const data = (await response.json()) as EthScanBalanceResponse
    return providerOk(formatNumber(data.result), Providers.etherscan)
  } catch (error) {
    return providerError(error, Providers.etherscan)
  }
}

export async function getERC20onEthereumMainnetBalance(
  tokenAddress: string,
  accountAddress: string,
  decimals?: number
) {
  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${tokenAddress}&address=${accountAddress}&tag=latest&apikey=${API_KEY}`
    )
    const data = await response.json()
    return providerOk(formatNumber(data.result, decimals), Providers.etherscan)
  } catch (error) {
    return providerError(error, Providers.etherscan)
  }
}

function formatNumber(value, decimals?: number) {
  if (decimals) {
    return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals)).toNumber()
  } else {
    return new BigNumber(value).dividedBy(1_000_000_000_000_000_000).toNumber()
  }
}
