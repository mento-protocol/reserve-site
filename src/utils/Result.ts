export interface ResultBase<TMetadata> {
  hasError: boolean
  metadata: TMetadata
}

export interface ResultOk<TValue, TMetadata> extends ResultBase<TMetadata> {
  hasError: false
  value: TValue
  time: number
}

export interface ResultError<TMetadata> extends ResultBase<TMetadata> {
  hasError: true
  error: Error
}

export type Result<TValue, TMetadata> = ResultOk<TValue, TMetadata> | ResultError<TMetadata>

export type Ok<TResult extends Result<any, any>> = TResult extends ResultOk<
  infer TValue,
  infer TMetadata
>
  ? ResultOk<TValue, TMetadata>
  : never

export function valueOrThrow<TValue>(result: Result<TValue, any>): TValue {
  if (result.hasError == true) {
    throw result.error
  }
  return result.value
}

export function okOrThrow<TValue, TMetadata>(
  result: Result<TValue, TMetadata>
): ResultOk<TValue, TMetadata> {
  if (result.hasError == true) {
    throw result.error
  }
  return result
}

export function allOkOrThrow<TResult extends Result<any, any>>(results: TResult[]): Ok<TResult>[] {
  const resultWithError = results.find((r) => r.hasError === true) as ResultError<any>
  if (resultWithError) {
    throw resultWithError.error
  }
  return results as unknown as Ok<TResult>[]
}

export function okResult<TValue, TMetadata>(
  value: TValue,
  metadata: TMetadata,
  time = Date.now()
): ResultOk<TValue, TMetadata> {
  return { hasError: false as const, metadata, value, time }
}

export function errorResult<TMetadata>(error: Error, metadata: TMetadata): ResultError<TMetadata> {
  return { hasError: true as const, metadata, error }
}
