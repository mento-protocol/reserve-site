import { Providers } from "./Providers"
import { ProviderResult, providerOk, providerError } from "src/utils/ProviderResult"
import normalizeBTCvalue from "src/utils/normalizeBTCValue"

//usage limits unknown
interface BlockstreamAddress {
  address: string
  chain_stats: {
    funded_txo_count: number
    funded_txo_sum: number
    spent_txo_count: number
    spent_txo_sum: number
    tx_count: number
  }
  mempool_stats: {
    funded_txo_count: number
    funded_txo_sum: number
    spent_txo_count: number
    spent_txo_sum: number
    tx_count: number
  }
}

export default async function getBTCBalance(address: string): Promise<ProviderResult<number>> {
  try {
    const response = await fetch(`https://blockstream.info/api/address/${address}`)
    const data = (await response.json()) as BlockstreamAddress
    return providerOk(
      normalizeBTCvalue(data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum),
      Providers.blockstream
    )
  } catch (error) {
    return providerError(error, Providers.blockchainDotCom)
  }
}
