export interface IAmortizationTitleTable {
  issue_date?: string | null
  maturity_date?: string | null
  mnemonic?: string | null
  payment_frequency: string | null
  modality: boolean | string | null
  flow_type: 'Regular' | 'Irregular' | null
  details: Array<{
    id?: number
    date: string
    percentage: number
    origin: string
  }>
  history_amortizable_titles?: {
    created_at: string
    created_by_user: string
    updated_at: string
    updated_by_user: string
  }
}

export interface IAmortizationTitleTableRows {
  id?: number
  mnemonic?: string
  payment_frequency?: string
  modality?: string
  issue_date?: string
  maturity_date?: string
  flow_type?: string
  percentage_total?: number | null
  total?: number
  status_id?: number
  date?: string
  name?: string
}

export interface IAmortizationTitleInformationForm {
  id: number
  date: string
  percentage?: number | null
  origin?: string
  name?: string
  total?: number
  status_id?: number
}

export interface IAmortizationTitleUploadReject {
  failedPropValidation?: string
  fileName?: string
  fileType?: string
  fileSize?: number
}

export type IPeriodicity =
  | 'Mensual'
  | 'Bimestral'
  | 'Trimestral'
  | 'Cuatrimestral'
  | 'Semestral'
  | 'Periodo'
