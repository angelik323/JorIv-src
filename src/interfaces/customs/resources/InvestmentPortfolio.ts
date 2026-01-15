import { IGenericResource } from './Common'

export interface IQualificationActionResource extends IGenericResource {
  action_rating: string
}

export interface IPaymentCodeOptionResource extends IGenericResource {
  months: number | null
}
export interface IQualificationCodeResource extends IGenericResource {
  rating_code: string
}
export interface IAdministratorsCodesResource extends IGenericResource {
  document_third: string
}
export interface IEmitterCodesResource extends IGenericResource {
  anna_code: string
}

export interface IIsinesEmitterAnnaCode {
  id: number
  description: string
  anna_code: string
}

export interface IQuotasIssuingPermitsResource extends IGenericResource {
  id: number
  third_party_id: string
  description: string
  document_third: string
  account_name: string
  account_number: string
  coin_type: string
  description_emitter_name: string
}

export interface IAmortizationTitleResource extends IGenericResource {
  issue_date: string
  maturity_date: string
}

export interface IGenericDataAmortizationTable {
  isin_code_id: number | string
  mnemonic: string
  isin_code?: string
  description: string
}

export interface IEmitterDividendResource extends IGenericResource {
  type_of_currency: string
}

export interface ICoinsResource extends IGenericResource {
  coin_value?: string
  currency_conversion?: number
}

export interface IOldestUnitValueByEmitterResource {
  issuers_counterparty_id: number
  action_class: string
  unit_value: string
}

export interface ITitlesByEmitterResource {
  issuers_counterparty_id: number
  action_class: string
  available_balance: string
  currency_id?: number
}
export interface IPaperTypeResource extends IGenericResource {
  enable_position_form: boolean
  enable_derivative_form: boolean
}

export interface IMarketTypesBuyFixedIncomeResource {
  label: string
  value: string
}
export interface IEquityOpsResource extends IGenericResource {
  balance: string
  administrator: { nit: string; description: string }
  etf_number: number
  index_description: string | null
  index_type: string | null
  isin: { description: string; mnemonic: number }
  status: { id: number; description: string }
  transmitter: { nit: string; description: string }
  value: string
  rate: string
}

export interface ICounterpartyResource {
  trader_id: number
  investment_portfolio_id: number
  counterparty_id: number
  counterparty_name: string
  counterparty_document: string
  value: string
}

export interface IIssuerDepositResource {
  id: number
  value: string
  description: string
  identification: string
}

export interface ICurrencyForPaperTypeResource {
  id: number
  code: string
  description: string
  value: number
  type_of_currency: string
  paper_type_id: number | null
  paper_type_code: string | null
  currency_code: string | null
  currency_id: number | null
}

export interface IIsinCodeResource extends IGenericDataAmortizationTable {
  id: number
}

export interface IIsinCodeWithIdResource {
  value: number
  label: string
  description: string
}

export interface IIsinesInterestRateResource {
  code: string | null
  id: number
  interest_rate_description: string
  mode: string
  payment_frequency: string
  rate_value: string
}

export interface ICurrencyInValorationFilesResource {
  id: number
  to_currency_id?: number
  rate?: number
}

export interface IInvestmentPortfolioAssociatedTraderResource
  extends IGenericResource {
  trader_id: number
  investment_portfolio_id: number
  portfolio_name: string
  portfolio_code: string
  value: string
}

export interface IEmitterAssociatedTraderResource {
  trader_id: number
  investment_portfolio_id: number
  emitter_id: number
  emitter_name: string
  emitter_document: string
  value: string
}

export interface ITitlesByIssuerResource {
  id: number
  unit_value: number
  balance: number
  issuers_counterparty?: {
    description?: string
  }
  sale_value?: number
  compensation_system?: string
  tir_sale?: number | null
}

export interface ICompensationSystemResource {
  label: string
  value: string
}
export interface IExchangeTradedFundResource extends IEquityOpsResource {
  id: number
  currency?: {
    id: number
    code: string
  }
  total_quantity_in_title?: number | null
}
export interface IGenericInvestmmentPortfolioResourceBenefit
  extends IGenericResource {
  benefit_id: string
  benefit_name: string
  total_value: string
  benefit_nit: string
}

export interface IGenericInvestmentOperationType extends IGenericResource {
  title?: number
  operation_nature?: string
  operation_value?: number
  inversion_type_id?: number
}

export interface IGenericBallotForeignCurrency extends IGenericResource {
  origin_currency_value?: string
  operation_value_origin_currency?: string
  operation_value_local_currency?: string
  resource_placement_date?: string
  compliance_date?: string
  operation_value?: string
  beneficiary?: string
  benefit_id?: number
  operation_origin_currency_value?: string
  local_currency_transaction_value?: string
  currency?: string
  operation_type_id?: number
  operation_type_name?: string
  operation_type_description?: string
}

export interface IInstructionSlipTypeResource extends IGenericResource {
  inversion_type_id: number
}

export interface IGenerateBallotData extends IGenericResource {
  benefit_id?: string
  benefit_name?: string
  operation_nature?: string
  total_value?: string
  benefit_nit?: string
  title_id?: number
  operation_type_description?: string
  origin_currency_value?: string
  operation_value_origin_currency?: string
  operation_value_local_currency?: string
  resource_placement_date?: string
  compliance_date?: string
  operation_value?: string
  inversion_type_id?: number | null
}

export interface IValorationTrmResource {
  valoration_trm: string
}
export interface IGenericRegisterConstitutionInvestment
  extends IGenericResource {
  currency_conversion: string | null
}

export interface ITitleLists {
  id: number
  issuers_counterparty_id: number
  balance: number
  status_id: number
  unit_value: number
  purchase_value: number | null
}

export interface IIsinCodesMnemonicsPortfolioResource extends IGenericResource {
  issuer_id: number | null
  isin_code_id: number | null
  isin_code: string | null
  mnemonic: string | null
  issue_date: string | null
  maturity_date: string | null
  perioricity: string | null
  rate_type: string | null
  rate_code: string | null
  fixed_rate_value: string | null
  modality: string | null
  spread: string | null
}

export interface IPaperTypeEncompassAndDivisionResource
  extends IGenericResource {
  id: number
  description?: string
  investment_class?: string
  investment_type?: string
  currency?: {
    id?: number
    code?: string
    description?: string
    type_of_currency?: string
    value?: string
    currency_conversion?: string
  }
}

export interface IAvailableTitlesForDivisionAndEncompassResource
  extends Partial<IGenericResource> {
  id: number
  title_number?: number | null
  purchasable_type?: string | null
  inversion_class?: string | null
  status?: {
    id?: number | null
    description?: string | null
  }
  emitter?: {
    id?: number | null
    document?: string | null
    description?: string | null
  }
  isin?: {
    id?: number
    code?: string | null
    description?: string | null
    mnemonic?: string | null
    periodicity?: string | null
  }
  paper?: {
    id?: number | null
    description?: string | null
    code?: string | null
  }
  emission_date?: string | null
  expiration_date?: string | null
  buyer_date?: string | null
  periodicity?: string | null
  modality?: string | null
  rate_type?: string | null
  rate_code?: string | null
  fixed_rate_value?: string | null
  spread?: string | null
  currency?: {
    id?: number | null
    code?: string | null
    value?: string | null
  }
  counterparty?: {
    id?: number | null
    document?: string | null
    description?: string | null
  }
  purchase_value?: number | null
  nominal_value?: number | null
  market_value?: number | null
  market_unit_value?: number | null
  tir?: {
    id: string | number
    capital: string
    value: number
  }
  deposit?: {
    id: string | number
    document: string
    description: string
  }
  compensation_system?: string | null
  folio_number?: number | null
}

export interface IStructurePaperType extends IGenericResource {
  investment_type: string
}

export interface IInvestmentPortfolioBankAccountResource {
  id: number
  account_name: string
  account_number: string
  coin_type: string
  bank_id: number
  status_id: number
  account_type: string
  taxed_gmf: boolean
  gmf_rate: string
  coin: number
}
export interface IEmitterResource extends IGenericResource {
  id: number
  document_third?: string
  description?: string
  third_party_id?: number
}
