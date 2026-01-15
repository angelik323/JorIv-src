import { IResource } from '@/interfaces/global'

export interface IBulkUploadTemplatesList {
  id?: number | null
  description?: string
  operation?: string
  transaction_method_id?: string
  optional_columns?: {
    id?: number | null
  }[]
  colum_number?: number | null
  name?: string
  selector_modal?: string
  transaction_method_options?: IResource[]
  columns?: {
    id?: 2
    is_optional?: boolean
    name?: string
    operation_type?: string
  }[]
  loading_code?: string
  operation_date?: string
  investment_fund?: string
  office?: string
  status?: string
  created_at?: string
  transaction_method?: [
    {
      account_number?: string
      account_name?: string
    }
  ]
}
