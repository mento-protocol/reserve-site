import { Providers } from "src/providers/Providers"
import { Result, ResultOk, ResultError, okResult, errorResult } from "./Result"

interface DuelResultOk extends ResultOk<number> {
  sources: Providers[]
}

interface DuelError extends ResultError {
  sources: Providers[]
}

export type DuelResult = DuelResultOk | DuelError

export function duelOk(value: number, sources: Providers[], time = Date.now()) {
  return { ...okResult(value, time), sources }
}

export function duelError(error: Error, sources: Providers[]) {
  console.info("ERROR", sources, error)
  return { ...errorResult(error), sources }
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
    sources: current.sources,
  }
}
