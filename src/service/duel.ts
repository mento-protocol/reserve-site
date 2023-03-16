import { ProviderResult } from "src/utils/ProviderResult"
import { DuelResult, duelError, duelOk } from "src/utils/DuelResult"

export type ProviderPromise<TValue = number> = Promise<ProviderResult<TValue>>

export function providerToDuel(result: ProviderResult): DuelResult {
  if (result.hasError === true) {
    return duelError(result.error, [result.source])
  } else {
    return duelOk(result.value, [result.source], result.time)
  }
}

export async function duel(alef: ProviderPromise, bet: ProviderPromise): Promise<DuelResult> {
  const results = await Promise.all([alef, bet])
  const sourceA = results[0]
  const sourceB = results[1]
  if (sourceA.hasError == true && sourceB.hasError == true) {
    console.warn(`Error ${sourceA.source} & ${sourceB.source} could not get new data`)
    return duelError(sourceA.error, [])
  }

  if (sourceA.hasError == true && sourceB.hasError == false) {
    console.warn(`Error with: ${sourceA.source}`)
    return duelOk(sourceB.value, [sourceB.source], sourceB.time)
  }

  if (sourceB.hasError == true && sourceA.hasError == false) {
    console.warn(`Error with: ${sourceB.source}`)
    return duelOk(sourceA.value, [sourceA.source], sourceA.time)
  }

  if (sourceA.hasError == false && sourceB.hasError == false) {
    if (sourceA.value === sourceB.value) {
      return duelOk(
        sourceA.value,
        results.map((result) => result.source),
        Math.max(sourceA.time, sourceB.time)
      )
    }

    if (sourceA.value !== sourceB.value) {
      const recent = sourceA.time > sourceB.time ? sourceA : sourceB
      if (percentDif(sourceA.value, sourceB.value) > 0.6) {
        console.info(
          `Sources: ${sourceA.source} (${sourceA.value}) differs from ${sourceB.source} (${
            sourceB.value
          }) ${percentDif(sourceA.value, sourceB.value).toPrecision(5)}%`
        )
      }
      return duelOk(recent.value, [recent.source], recent.time)
    }
  }
}

function percentDif(x: number, y: number) {
  return Math.abs((1 - x / y) * 100)
}
