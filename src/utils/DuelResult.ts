import { Providers } from "src/providers/Providers"
import { Result, okResult, errorResult } from "./Result"

export interface DuelMetadata {
  sources: Providers[]
}

export type DuelResult = Result<number, DuelMetadata>

export function duelOk(value: number, sources: Providers[], time = Date.now()) {
  return okResult(value, { sources }, time)
}

export function duelError(error: Error, sources: Providers[]) {
  console.info("ERROR", sources, error)
  return errorResult(error, { sources })
}

export function sumMerge(acc: DuelResult, current: DuelResult): DuelResult {
  if (acc.hasError == true) {
    return acc
  }
  if (current.hasError == true) {
    return current
  }

  return {
    ...acc,
    value: acc.value + current.value,
    time: current.time,
    metadata: current.metadata,
  }
}
