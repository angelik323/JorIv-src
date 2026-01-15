export interface IPaymentAuthorizersItemList {
  id: number
  autorized_user: {
    id: number
    email: string
    full_name: string
  }
  amount_from: string
  amount_to: string
  created_at: string
}

export interface IPaymentAuthorizersForm {
  autorized_user_id: number | null
  amount_from: string | null
  amount_to: string | null
  created_at?: string | null
}

export interface IPaymentAuthorizersCreateBulkPayload {
  valid_rows: IPaymentAuthorizersImportItemList[]
}

export interface IPaymentAuthorizersFileValidationResponse {
  has_errors: boolean
  total_valid_rows: number
  total_invalid_rows: number
  total_rows: number
  valid_rows: IPaymentAuthorizersImportItemList[]
  errors_file_id: string | null
}

export interface IPaymentAuthorizersImportItemList {
  row_id: number
  authorized_user_id: number | null
  amount_from: string | null
  amount_to: string | null
}
