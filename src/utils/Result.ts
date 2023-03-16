export interface ResultBase {
  hasError: boolean
}

export interface ResultOk<TValue> extends ResultBase {
  hasError: false
  value: TValue
  time: number
}

export interface ResultError extends ResultBase {
  hasError: true
  error: Error
}

export type Result<TValue> = ResultOk<TValue> | ResultError

export type Ok<TResult extends Result<any>> = TResult extends ResultOk<infer TValue>
  ? ResultOk<TValue>
  : never

export function valueOrThrow<T>(result: Result<T>): T {
  if (result.hasError == true) {
    throw result.error
  }
  return result.value
}

export function okOrThrow<T>(result: Result<T>): ResultOk<T> {
  if (result.hasError == true) {
    throw result.error
  }
  return result
}

export function allOkOrThrow<TResult extends Result<any>>(results: TResult[]): Ok<TResult>[] {
  const resultWithError = results.find((r) => r.hasError === true) as ResultError
  if (resultWithError) {
    throw resultWithError.error
  }
  return results as unknown as Ok<TResult>[]
}

export function okResult<T>(value: T, time = Date.now()): ResultOk<T> {
  return { hasError: false as const, value, time }
}

export function errorResult(error: Error): ResultError {
  return { hasError: true as const, error }
}
