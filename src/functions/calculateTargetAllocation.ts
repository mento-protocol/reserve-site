import Allocation, { AssetTypes } from "src/interfaces/allocation"
import StableValueTokensAPI from "src/interfaces/stable-value-tokens"

const EMPTY_TARGETS: Allocation[] = [
  { type: "celo-native-asset" as const, token: "CELO", percent: 0 },
  { type: "other-crypto-assets" as const, token: "BTC", percent: 0 },
  { type: "other-crypto-assets" as const, token: "ETH", percent: 0 },
  { type: "stable-value" as const, token: "DAI", percent: 0 },
  { type: "stable-value" as const, token: "USDC", percent: 0 },
  { type: "stable-value-eur" as const, token: "EUROC", percent: 0 },
  { type: "natural-capital" as const, token: "cMCO2", percent: 0 },
]

export function calculateTargetAllocation(
  stableData: StableValueTokensAPI,
  totalReserveUSD: number
): Allocation[] {
  const totalStablesUSDValue = stableData.totalStableValueInUSD
  const stables = stableData.tokens

  const eurBackedStables = ["cEUR", "eXOF"]
  const eurBackedStablesUSDValue = stables
    .filter((s) => eurBackedStables.includes(s.token))
    .reduce((prev, current) => {
      return prev + current.value
    }, 0)
  const usdBackedStablesUSDValue = totalStablesUSDValue - eurBackedStablesUSDValue

  let celoTarget: number
  let usdCollateralTarget: number
  let eurCollateralTarget: number
  let natCollateralTarget: number
  let otherCollateralTarget: number

  const ratio = totalReserveUSD / totalStablesUSDValue
  if (ratio >= 1.9) {
    usdCollateralTarget = usdBackedStablesUSDValue / totalReserveUSD
    eurCollateralTarget = eurBackedStablesUSDValue / totalReserveUSD
    celoTarget = 0.45
    otherCollateralTarget = (1 - usdCollateralTarget - eurCollateralTarget - celoTarget) * 0.98
    natCollateralTarget = (1 - usdCollateralTarget - eurCollateralTarget - celoTarget) * 0.02
  } else if (ratio < 1.9 && ratio >= 1) {
    usdCollateralTarget = usdBackedStablesUSDValue / totalReserveUSD
    eurCollateralTarget = eurBackedStablesUSDValue / totalReserveUSD
    celoTarget = 1 - usdCollateralTarget - eurCollateralTarget
  } else if (ratio < 1) {
    usdCollateralTarget = usdBackedStablesUSDValue / totalStablesUSDValue
    eurCollateralTarget = eurBackedStablesUSDValue / totalStablesUSDValue
  }

  const targetAllocation: Allocation[] = JSON.parse(JSON.stringify(EMPTY_TARGETS))
  targetAllocation.forEach((a) => {
    switch (a.type) {
      case "celo-native-asset":
        a.percent = getPercent(a.type, celoTarget)
        break

      case "stable-value":
        a.percent = getPercent(a.type, usdCollateralTarget)
        break

      case "stable-value-eur":
        a.percent = getPercent(a.type, eurCollateralTarget)
        break

      case "other-crypto-assets":
        a.percent = getPercent(a.type, otherCollateralTarget)
        break

      case "natural-capital":
        a.percent = getPercent(a.type, natCollateralTarget)
        break

      default:
        break
    }
  })

  return targetAllocation
}

function getPercent(assetType: AssetTypes, target: number): number {
  const numTypes = EMPTY_TARGETS.filter((t) => t.type === assetType).length
  const percent = (target * 100) / numTypes

  return isNaN(percent) ? 0 : percent
}
