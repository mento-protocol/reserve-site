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

const API_KEY = process.env.ETHERSCAN_API

export async function getEthPrice(): Promise<ProviderResult<number>> {
  try {
    const response = await fetch(
      `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${API_KEY}`
    )
    const data = (await response.json()) as EthScanPriceResponse
    if (data.status === "0") {
      return providerError(
        new Error(`etherscan: ${data.message} ${data.result}`),
        Providers.etherscan
      )
    }
    return providerOk(
      Number(data.result.ethusd),
      Providers.etherscan,
      Number(data.result.ethusd_timestamp)
    )
  } catch (error) {
    return providerError(error, Providers.etherscan)
  }
}
