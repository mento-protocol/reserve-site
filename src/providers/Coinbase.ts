import { Providers } from "./Providers"
import { ProviderResult, providerOk, providerError } from "src/utils/ProviderResult"

// usage limits 10,000 requests per hour ()
interface CBResponse {
  data: { base: "BTC" | "ETH"; currency: "USD"; amount: string }
}

export async function getBTCInUSD(): Promise<ProviderResult<number>> {
  try {
    const response = await fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot")
    return amountOrError(response)
  } catch (error) {
    return providerError(error, Providers.coinbase)
  }
}

export async function getETHInUSD(): Promise<ProviderResult<number>> {
  try {
    const response = await fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot")
    return amountOrError(response)
  } catch (error) {
    return providerError(error, Providers.coinbase)
  }
}

export async function getDAIInUSD(): Promise<ProviderResult<number>> {
  try {
    const response = await fetch("https://api.coinbase.com/v2/prices/DAI-USD/spot")
    return amountOrError(response)
  } catch (error) {
    return providerError(error, Providers.coinbase)
  }
}

export async function getCELOPrice(): Promise<ProviderResult<number>> {
  try {
    const response = await fetch("https://api.coinbase.com/v2/prices/CGLD-USD/spot")
    return amountOrError(response)
  } catch (error) {
    return providerError(error, Providers.coinbase)
  }
}

async function amountOrError(response: Response): Promise<ProviderResult<number>> {
  const data = (await response.json()) as CBResponse
  const value = Number(data.data.amount)
  if (!value || isNaN(value)) {
    return providerError(new Error("invalid value"), Providers.coinbase)
  }
  return providerOk(value, Providers.coinbase)
}
