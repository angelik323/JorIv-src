export interface IFractionationDivisions {
  nominal_value_fraction: number | null
  buy_value_fraction: number | null
  market_value_fraction: number | null
  market_unit_value_fraction: number | null
}
export interface IFractionationUserData {
  id?: number
  document_type?: string
  document_type_abbreviation?: string
  number_document?: string
  complete_name?: string
  email?: string
  status?: {
    id: number
    status: string
    comments: string | null
  }
}
export interface IFractionationBasicDataForm {
  id?: number | null
  investment_portfolio?: {
    id?: number
    code?: string
    description?: string
  }
  operation_type?: {
    id?: number
    code?: string
    description?: string
  }
  investment_class?: string
  created_by?: IFractionationUserData | null
  divisions: IFractionationDivisions[]
  investment_portfolio_id?: string | null
  operation_type_id?: number | null
  operation_date?: string
  title_id?: number | null
}

export interface IFractionationTitlesUserData {
  id?: number
  parent_title_number?: number
  operation_date?: string
  investment_class?: string
  investment_portfolio?: {
    id: number
    code: string
    description: string
  } | null
  operation_type?: {
    id: number
    code: string
    description: string
  } | null
  complete_name?: string
  email?: string
  document_type?: string
  document_type_abbreviation?: string
  number_document?: string
  status?: {
    id: number
    status: string
    comments: string | null
  }
}

export interface IFractionationSendData {
  investment_portfolio_id: string
  operation_type_id: number
  operation_date: string
  title_id: number
  divisions: IFractionationDivisions[]
}

export interface IFractionationGenericData {
  id?: number | null
  title_number?: number | null
  purchasable_type?: string
  inversion_class?: string
  status?: {
    id?: number
    description?: string
  }
  emitter: {
    id?: number
    document?: string
    description?: string
  }
  isin: {
    id?: number
    code?: string
    description?: string
    mnemonic?: string
    periodicity?: string
  }
  paper?: {
    id?: number
    description?: string
    code?: string
  }
  emission_date?: string | null
  expiration_date?: string | null
  buyer_date?: string | null
  periodicity?: string
  modality?: string
  rate_type?: string
  rate_code?: string | null
  fixed_rate_value?: string
  spread?: string | null
  currency?: {
    id: number
    code: string
    value: string
  }
  counterparty?: {
    id: number
    document: string
    description: string
  }
  purchase_value?: number
  nominal_value?: number
  market_value?: number
  market_unit_value?: number
  tir?: {
    id: number
    capital: string
    value: number
  }
  deposit?: {
    id: number
    document: string
    description: string
  }
  compensation_system?: string
  folio_number?: number
}
export interface IFractionationTitleRows {
  id: string | number
  parent_title_number: string | number
  operation_date: string
  investment_portfolio: {
    id: string | number
    code: string
    description: string
  }
  status: {
    id: string | number
    description: string
  }
}

export interface IFractionationTitles {
  id: number | null
  parent_title_number: number
  origin_title: IFractionationGenericData | null
  operation_date: string
  investment_class?: string
  investment_portfolio: {
    id: number
    code: string
    description: string
  } | null
  operation_type: {
    id: number
    code: string
    description: string
  } | null
  created_by: IFractionationUserData | null
  divisions: IFractionationGenericData[]
}

export interface IFractionationTitlesTable {
  id: number | string
  title_number: number | string
  operation_number: string
  invertion_class: string
  status: {
    id: string | number | null
    description: string | null
  }
  emitter: string
  isin_code: string
  nemonic: string
  paper: string
  issue_date: string
  maturity_date: string | null
  purchase_date: string
  periodicity: string
  rate_mode: string
  rate_type: string
  rate_code: string
  rate_value: string
  spread: string
  currency: string
  currency_value: string
  counterparty: string
  nominal_value: number | undefined
  purchase_value: number | undefined
  purchase_tir: string
  market_value: number | undefined
  deposit: string
  clearing_system: string
  folio: number | undefined
  market_value_units: number | undefined
}
