import { Providers } from "src/providers/Providers"
import { Result, ResultOk, ResultError, okResult, errorResult } from "./Result"

interface ProviderMetadata {
  source: Providers
}

export type ProviderResult<TValue = number> = Result<TValue, ProviderMetadata>

export function providerOk<TValue>(
  value: TValue,
  source: Providers,
  time = Date.now()
): ResultOk<TValue, ProviderMetadata> {
  return okResult(value, { source }, time)
}

export function providerError(error: Error, source: Providers): ResultError<ProviderMetadata> {
  console.info("ERROR", source, error)
  return errorResult(error, { source })
}
