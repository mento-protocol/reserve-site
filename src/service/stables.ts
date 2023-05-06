import { StableToken } from "@celo/contractkit"
import { ISO427SYMBOLS } from "src/interfaces/ISO427SYMBOLS"
import { getCStableSupply, getCurveCUSD, getMultisigCUSD } from "src/providers/Celo"
import { TokenModel } from "src/service/Data"
import { getOrSave } from "src/service/cache"
import { fiatPrices } from "src/service/rates"
import { ProviderResult } from "src/utils/ProviderResult"
import { valueOrThrow } from "src/utils/Result"
import { SECOND } from "src/utils/TIME"
import { STABLES } from "../stables.config"

async function cStableSupply(token: StableToken) {
  return getOrSave(`cSTABLE-${token}-supply`, () => getCStableSupply(token), 5 * SECOND)
}

async function curveCUSD() {
  return getOrSave("curvePoolCusd", () => getCurveCUSD(), 5 * SECOND)
}

async function multisigCUSD() {
  return getOrSave("multisigCUSD", () => getMultisigCUSD(), 5 * SECOND)
}

interface Circulation {
  units: ProviderResult<number>
  symbol: StableToken
  iso4217: ISO427SYMBOLS
}

async function getCirculations(): Promise<Circulation[]> {
  return Promise.all<Circulation>(
    STABLES.map(async (stable) => {
      return new Promise((resolve, reject) => {
        cStableSupply(stable.symbol)
          .then(
            (units) =>
              resolve({
                units: units,
                symbol: stable.symbol,
                iso4217: stable.iso4217,
              })
            // reject(new Error(`error: getCirculation() provider: ${units.source}`))
          )
          .catch(reject)
      })
    })
  )
}

export default async function stables(): Promise<TokenModel[]> {
  const [prices, circulations] = await Promise.all([fiatPrices(), getCirculations()])
  const curveCUSDAmount = valueOrThrow(await curveCUSD())
  const multisigCUSDAmount = valueOrThrow(await multisigCUSD())

  return circulations.map((tokenData) => {
    if (tokenData.units.hasError == true) {
      return {
        token: tokenData.symbol,
        units: null,
        value: null,
        updated: null,
        hasError: true,
      }
    }

    let units = tokenData.units.value
    let value = prices.value[tokenData.iso4217] * units

    if (tokenData.symbol === StableToken.cUSD) {
      value -= curveCUSDAmount * prices.value[tokenData.iso4217]
      units -= curveCUSDAmount

      value -= multisigCUSDAmount * prices.value[tokenData.iso4217]
      units -= multisigCUSDAmount
    }

    return {
      token: tokenData.symbol,
      units,
      value,
      updated: tokenData.units.time,
      hasError: tokenData.units.hasError,
    }
  })
}

export async function getTotalStableValueInUSD() {
  const all = await stables()
  return Number(all.reduce((sum, { value }) => sum + value, 0).toFixed(2))
}
