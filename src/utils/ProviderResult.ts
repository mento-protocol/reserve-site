import { Providers } from "src/providers/Providers";
import { Result, ResultOk, ResultError, okResult, errorResult } from "./Result";

interface ProviderResultOk<T> extends ResultOk<T> {
  source: Providers;
}

interface ProviderError extends ResultError {
  source: Providers;
}

export type ProviderResult<T = number> = ProviderResultOk<T> | ProviderError;

export function providerOk<T>(
  value: T,
  source: Providers,
  time = Date.now(),
): ProviderResultOk<T> {
  return {
    ...okResult(value, time),
    source,
  };
}

export function providerError(error: Error, source: Providers): ProviderError {
  console.info("ERROR", source, error);
  return { ...errorResult(error), source };
}
