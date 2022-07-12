import useSWR from "swr"
import { fetcher } from "src/utils/fetcher"
import Allocation from "src/interfaces/allocation"
import StableValueTokensAPI from "src/interfaces/stable-value-tokens"
import useHoldings from "./useHoldings"
import { HoldingsApi } from "src/service/holdings"
import { calculateTargetAllocation } from "src/functions/calculateTargetAllocation"

const EMPTY_TARGETS: Allocation[] = [
  { type: "celo-native-asset" as const, token: "CELO", percent: 0 },
  { type: "other-crypto-assets" as const, token: "BTC", percent: 0 },
  { type: "other-crypto-assets" as const, token: "ETH", percent: 0 },
  { type: "other-crypto-assets" as const, token: "other", percent: 0 },
]

export default function useTargets() {
  const stablesData = useSWR<StableValueTokensAPI>("/api/stable-value-tokens", fetcher, {
    shouldRetryOnError: true,
  })

  const holdingsApi = useHoldings()

  if (stablesData.error || holdingsApi.error || !stablesData.data) {
    return { data: EMPTY_TARGETS, isLoading: true }
  }

  const allocationData = calculateTargetAllocation(
    stablesData.data.totalStableValueInUSD,
    getTotalReserveUSD(holdingsApi.data)
  )

  return {
    data: group(allocationData),
    isLoading: false,
  }
}

function group(list: Allocation[]) {
  const map = new Map<string, Allocation>()

  list.forEach((item) => {
    const key = item.type
    if (key === "stable-value" || key === "natural-capital") {
      const collection = map.get(key)
      if (!collection) {
        map.set(key, { ...item, token: key })
      } else {
        map.set(key, { ...collection, percent: collection.percent + item.percent })
      }
    } else {
      map.set(item.token, item)
    }
  })
  return Array.from(map.values())
}

function getTotalReserveUSD(reserveHoldings: HoldingsApi): number {
  const { custody, frozen, unfrozen } = reserveHoldings.celo
  const totalCelo = custody.value + unfrozen.value + frozen.value

  const totalOtherAssets = reserveHoldings.otherAssets.reduce(
    (prev, current) => current.value + prev,
    0
  )

  return totalOtherAssets + totalCelo
}
