import normalizeBTCvalue from "src/utils/normalizeBTCValue"
import { Providers } from "./Providers"
import { ProviderResult, providerOk, providerError } from "src/utils/ProviderResult"

// Usage Limits 1 req every 10 seconds

type BalanceReponse = Record<
  string,
  {
    final_balance: number
    n_tx: number
    total_received: number
  }
>

export async function getBTCBalance(address: string): Promise<ProviderResult<number>> {
  try {
    const response = await fetch(`https://blockchain.info/balance?active=${address}`)
    const data = (await response.json()) as BalanceReponse
    if (!(typeof data[address]?.final_balance === "number")) {
      return providerError(new Error("final_balance is not a number"), Providers.blockchainDotCom)
    }
    return providerOk(normalizeBTCvalue(data[address].final_balance), Providers.blockchainDotCom)
  } catch (error) {
    return providerError(error, Providers.blockchainDotCom)
  }
}

interface PriceResponse {
  symbol: "BTC-USD"
  price_24h: number
  volume_24h: number
  last_trade_price: number
}

export async function getBTCPrice(): Promise<ProviderResult<number>> {
  try {
    const response = await fetch(`https://api.blockchain.com/v3/exchange/tickers/BTC-USD`)
    const data = (await response.json()) as PriceResponse
    if (!data.last_trade_price) {
      return providerError(new Error("last_trade_price missing"), Providers.blockchainDotCom)
    }

    return providerOk(data.last_trade_price, Providers.blockchainDotCom)
  } catch (error) {
    return providerError(error, Providers.blockchainDotCom)
  }
}
