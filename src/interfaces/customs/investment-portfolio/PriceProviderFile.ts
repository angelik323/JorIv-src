export interface IPricesProviderFileItem {
  id: number
  document_third: number | string
  identification: string
}

export interface IPriceProviderFilePages {
  currentPage: number
  lastPage: number
}

export interface IPriceProviderFile {
  'filter[search]': string
}

export interface IPriceProviderFileModel {
  id?: number
  document_third?: number | string
  identification?: string
}

export interface IFileItem {
  id: number
  name: string
  prefix: string
  date_format: string
  extension: string
  identification: string
  status_id: number
}

export interface IPriceProviderFileFormModel {
  issuers_counterparty_id: number | string
  document_third?: number | string
  description: string
  files: IFileItem[]
  code?: string
}

export interface IPriceProviderFileFormViewModel {
  issuers_counterparty_id: number | string
  document_third: number | string
  code: string
  description: string
  files: IFileItem[]
  change_history?: {
    created_at: string
    created_by_user: string
    updated_at: string
    updated_by_user: string
  }
}
