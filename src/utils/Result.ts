export interface ResultBase {
  hasError: boolean
}

export interface ResultOk<T> extends ResultBase {
  hasError: false
  value: T
  time: number
}

export interface ResultError extends ResultBase {
  hasError: true
  error: Error
}

export type Result<T> = ResultOk<T> | ResultError

export type Ok<TResult extends Result<any>> = TResult extends ResultOk<infer T>
  ? ResultOk<T>
  : never

export function okOrThrow<T>(result: Result<T>): ResultOk<T> {
  if (result.hasError == true) {
    throw result.error
  }
  return result
}

export function valueOrThrow<T>(result: Result<T>): T {
  return okOrThrow(result).value
}

export function allOkOrThrow<TResult extends Result<any>>(results: TResult[]): Ok<TResult>[] {
  results.forEach(okOrThrow)
  return results as unknown as Ok<TResult>[]
}

export function okResult<T>(value: T, time = Date.now()): ResultOk<T> {
  return { hasError: false as const, value, time }
}

export function errorResult(error: Error): ResultError {
  return { hasError: true as const, error }
}
