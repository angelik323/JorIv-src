export enum TaxTypeEnum {
  RFT = 'RFT',
  RIV = 'RIV',
  RIC = 'RIC',
  RTE = 'RTE',
}

export type TaxType = TaxTypeEnum

export const TAX_TYPE_LABELS: Record<TaxType, string> = {
  RFT: 'Retención en la fuente',
  RIV: 'Retención de IVA',
  RIC: 'Retención de ICA',
  RTE: 'Impuestos territoriales',
}

export interface ITaxMatrixColumns {
  [key: string]: boolean
}

export interface ITaxMatrixRow {
  third_obligation: string
  columns: ITaxMatrixColumns
}

export interface ITaxMatrixItem {
  id?: number
  tax_type: TaxType
  tax_type_label: string
  rows: ITaxMatrixRow[]
  created_at?: string
  updated_at?: string
}

export interface ITaxMatrixListResponse {
  success: boolean
  data: {
    current_page: number
    data: ITaxMatrixItem[]
    first_page_url: string
    from: number
    last_page: number
    last_page_url: string
    links: Array<{
      url: string | null
      label: string
      active: boolean
    }>
    next_page_url: string | null
    path: string
    per_page: number
    prev_page_url: string | null
    to: number
    total: number
  }
  message: string
}

export interface ITaxMatrixSingleResponse {
  success: boolean
  data: {
    tax_type: TaxType
    rows: ITaxMatrixRow[]
  }
  message: string
}

export interface ITaxMatrixUpdatePayload {
  combinations: Array<{
    third_obligation: string
    nit_obligation: string
    applies: string
  }>
}

export interface ITaxMatrixForm {
  tax_type: TaxType
  rows: ITaxMatrixRow[]
}

export interface ITaxMatrixEditState {
  RFT: ITaxMatrixForm | null
  RIV: ITaxMatrixForm | null
  RIC: ITaxMatrixForm | null
  RTE: ITaxMatrixForm | null
}
