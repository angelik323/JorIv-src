interface DefaultCancellationCode {
  id?: number
  description: string
  type: string
}
export interface ICancellationCodes extends DefaultCancellationCode {
  code?: string
  reverses_conciliation: boolean
  retains_consecutive_check: boolean
}

export interface ICancellationCodesResponse extends DefaultCancellationCode {
  cancellation_code?: string
  reverse_conciliation: string | boolean
  preserve_consecutive_check: string | boolean
}
