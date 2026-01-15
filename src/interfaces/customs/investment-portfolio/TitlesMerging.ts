import { IAvailableTitlesForDivisionAndEncompassResource } from '@/interfaces/customs'

type NullableNumberString = number | string | null

export interface IMergedTitleListItem {
  id: number
  investment_portfolio: {
    id: number
    code: string
    description: string
  }
  new_title_number: number
  operation_number: number
  created_date: string
  status: {
    id: number
    status: string
  }
}

export interface IOriginTitleResponse {
  id: number
  status?: {
    id?: number
    description?: string
  }
  purchase_value?: number
  purchase_date?: string
  nominal_value?: number
  market_value?: number
  market_unit_value?: number
}

export interface ITitlesMergingResponse {
  id: number
  title_information?: {
    created_by?: {
      id?: number
      document_type?: string
      document_type_abbreviation?: string
      number_document?: string
      complete_name?: string
      email?: string
      status?: {
        id?: number
        status?: string
        comments?: string | null
      }
    } | null
    inversion_class?: string
    emission_date?: string
    emitter?: {
      id?: number
      description?: string
      document?: string
    }
    paper_type?: {
      id?: number
      code?: string
      description?: string
      investment_type?: string
      investment_class?: string
      rate_type?: string | null
      rate_class?: string | null
      rate?: string | null
      rate_mode?: string | null
      base_flow_rate?: string | null
      flow_type?: string | null
      payment_flow?: string | null
      amortization_type?: string | null
    }
    isin_code?: {
      id?: number
      isin_code?: string
      mnemonic?: string
      issuer_code?: string
      administrator_code?: string
      issuance_series?: string
      issuance_year?: number
      title_class?: string
      modality?: string
      spread?: string
      periodicity?: string
      rate_type?: string
      fixed_rate_value?: string
      rate_code?: string
      rate_behavior?: string
    }
    operation_type?: {
      id?: number
      code?: number
      description?: string
    }
  }
  origin_titles?: IOriginTitleResponse[]
  title_result?: {
    id?: number
    title_number?: number
    emission_date?: string | null
    expiration_date?: string | null
    investment_portfolio?: {
      id?: number
      name?: string | null
      code?: string | null
    }
    status?: {
      id?: number
      status?: string
    }
    emitter?: {
      id?: number
      description?: string
      document?: string
    }
    paper_type?: {
      id?: number
      code?: string
      description?: string
      investment_type?: string
      investment_class?: string
      rate_type?: string | null
      rate_class?: string | null
      rate?: string | null
      rate_mode?: string | null
      base_flow_rate?: string | null
      flow_type?: string | null
      payment_flow?: string | null
      amortization_type?: string | null
      currency?: {
        id?: number
        code?: string | null
        description?: string | null
      }
    }
    isin_code?: {
      id?: number
      isin_code?: string
      mnemonic?: string
      issuer_code?: string
      administrator_code?: string
      issuance_series?: string
      issuance_year?: number
      title_class?: string
      modality?: string
      spread?: string
      periodicity?: string
      rate_type?: string
      fixed_rate_value?: string
      rate_code?: string
      rate_behavior?: string
    }
    operation_type?: {
      id?: number
      code?: number
      description?: string
    }
    nominal_value?: number
    tir?: {
      id?: number
      capita?: string
      value?: string
    }
    market_value?: number
    market_unit_value?: number
  }
}

export interface ITitlesMergingBasicDataForm {
  id?: number
  investment_portfolio: NullableNumberString
  operation_type: NullableNumberString
  emitter: NullableNumberString
  inversion_class: NullableNumberString
  paper: NullableNumberString
  isin: NullableNumberString
  issue_date: string | null
  periodicity: string | null
  modality: string | null
  rate_type: string | null
  rate_code: string | null
  rate_value: string | null
  spread: string | null
  currency: string | null
  titles: IAvailableTitlesForDivisionAndEncompassResource[]
  selectedTitles: IAvailableTitlesForDivisionAndEncompassResource[]
  mergedTitlesPreview: IMergedTitle[]
  created_by?: string | null
}

export interface IMergedTitlesValues {
  title: IMergedTitle | null
  nominal_value: NullableNumberString
  market_value: NullableNumberString
  market_unit_value: NullableNumberString
  tir_value: NullableNumberString
}

export interface ITitlesToMerge {
  operation_date: string
  titles: {
    title_id: number
  }[]
}

export interface IMergedTitle {
  title_information: {
    created_by: string | null
    inversion_class: string
    emitter: {
      id: number
      description: string
      document: string
    }
    paper_type: {
      id: number
      code: string
      description: string
      investment_type: string
      investment_class: string
      rate_type: string | null
      rate_class: string | null
      rate: string | null
      rate_mode: string | null
      base_flow_rate: string | null
      flow_type: string | null
      payment_flow: string | null
      amortization_type: string | null
    }
    isin_code: {
      id: number
      isin_code: string
      mnemonic: string
      issuer_code: string
      administrator_code: string
      issuance_series: string
      issuance_year: number
      title_class: string
      modality: string
      spread: string
      periodicity: string
      rate_type: string
      fixed_rate_value: string
      rate_code: string
      rate_behavior: string
    }
  }
  origin_titles: {
    id: number
    status: {
      id: number
      description: string
    }
    purchase_value: number
    purchase_date: string
    nominal_value: number
    market_value: number
    market_unit_value: number
  }[]
  title_result: {
    id: number | null
    title_number: number | null
    emission_date: string | null
    expiration_date: string | null
    status: {
      id: number
      status: string
    }
    emitter: {
      id: number
      description: string
      document: string
    }
    operation_type?: {
      code: number
      description: string
      id: number
    }
    paper_type: {
      id: number
      code: string
      description: string
      investment_type: string
      investment_class: string
      rate_type: string | null
      rate_class: string | null
      rate: string | null
      rate_mode: string | null
      base_flow_rate: string | null
      flow_type: string | null
      payment_flow: string | null
      amortization_type: string | null
    }
    isin_code?: {
      id: number
      isin_code: string
      mnemonic: string
      issuer_code: string
      administrator_code: string
      issuance_series: string
      issuance_year: number
      title_class: string
      modality: string
      spread: string
      periodicity: string
      rate_type: string
      fixed_rate_value: string
      rate_code: string
      rate_behavior: string
    }
    nominal_value: number
    tir: {
      id: number | null
      capita: number
      value: number
    }
    market_value: number
    market_unit_value: number
  }
}
