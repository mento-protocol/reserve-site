import Allocation, { AssetTypes } from "src/interfaces/allocation"

const EMPTY_TARGETS: Allocation[] = [
  { type: "celo-native-asset" as const, token: "CELO", percent: 0 },
  { type: "other-crypto-assets" as const, token: "BTC", percent: 0 },
  { type: "other-crypto-assets" as const, token: "ETH", percent: 0 },
  { type: "stable-value" as const, token: "DAI", percent: 0 },
  { type: "stable-value" as const, token: "USDC", percent: 0 },
  { type: "natural-capital" as const, token: "cMC02", percent: 0 },
]

export function calculateTargetAllocation(
  outstandingStablesUSD: number,
  totalReserveUSD: number
): Allocation[] {
  const targetAllocation: Allocation[] = JSON.parse(JSON.stringify(EMPTY_TARGETS))

  let celoTarget: number
  let stablesTarget: number
  let natCapTarget: number
  let otherCryptoTarget: number

  const ratio = totalReserveUSD / outstandingStablesUSD

  if (ratio >= 2) {
    stablesTarget = outstandingStablesUSD / totalReserveUSD
    celoTarget = 0.5
    otherCryptoTarget = (1 - stablesTarget - celoTarget) * 0.98
    natCapTarget = (1 - stablesTarget - celoTarget) * 0.02
  } else if (ratio < 2 && ratio >= 1) {
    stablesTarget = outstandingStablesUSD / totalReserveUSD
    celoTarget = 1 - stablesTarget
  } else if (ratio < 1) {
    stablesTarget = 1
  }

  targetAllocation.forEach((a) => {
    switch (a.type) {
      case "celo-native-asset":
        a.percent = getPercent(a.type, celoTarget)
        break

      case "other-crypto-assets":
        a.percent = getPercent(a.type, otherCryptoTarget)
        break

      case "stable-value":
        a.percent = getPercent(a.type, stablesTarget)
        break

      case "natural-capital":
        a.percent = getPercent(a.type, natCapTarget)
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
