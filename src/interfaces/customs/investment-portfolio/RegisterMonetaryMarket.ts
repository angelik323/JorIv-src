export enum TtvTypes {
  VALUES_VS_VALUES = 'Valores contra valores',
  VALUES_VS_MONEY = 'Valores contra dinero',
}

export enum PositionTypes {
  ORIGINATOR = 'Originador',
  RECEIVER = 'Receptor',
}

export enum RateClasses {
  EFFECTIVE = 'Efectivo',
  NOMINAL = 'Nominal',
}

export enum DaysBase {
  DAYS_360 = 360,
  DAYS_365 = 365,
}

export enum CommissionBaseMonetaryMarket {
  PERCENTAGE = 'Porcentaje',
  FIXED_VALUE = 'Valor fijo',
  NOT_APPLICABLE = 'No aplica',
}

export enum CommissionModality {
  ADVANCED = 'Anticipada',
  EXPIRED = 'Vencida',
}

export enum RepoTypes {
  OPEN = 'Abierto',
  CLOSED = 'Cerrado',
}

export enum RepoPosition {
  ACTIVE = 'Activo',
  PASSIVE = 'Pasivo',
}

export interface IMonetaryMarketOperation {
  id: number
  operation_type_id: number
  operation_type_description: string
  portfolio_id: number
  portfolio_code: string
  portfolio_description: string
  security_code: string
  title_number: string
  operation_number: string
  operation_date: string
  maturity_date: string | null
  status: string
  created_at: string
  updated_at: string
  position?: 'Activa' | 'Pasiva'
  paper_id?: number | null
  days_number?: number | null
  rate_value?: number | null
  rate_class?: RateClasses
  days_base?: DaysBase
  nominal_value?: number | null
  counterparty_id?: number | null
  currency_id?: string | number | null
  folio?: number | null
  compensation_system?: string | null
  warranty_value?: number | null
  warranty_percentage?: number | null
  return_value?: number | null
  repo_type?: string | null
  repo?: string | null
  delivered?: ITitleDelivered
  received?: ITitlesReceived
  negotiation_value?: number | null
  yield_value?: number | null
}

export interface IMonetaryMarketOperationsListResponse {
  data: IMonetaryMarketOperation[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface IMonetaryMarketOperationsFilters {
  portfolio_id: number | null
  operation_type_id: number | null
  search: string
  operation_date: string | null
  status: string | null
  page: number
  rows: number
}

export type TtvId = number | string

export interface ITtvOption {
  value: TtvId
  label?: string
  code?: string
  description?: string
  active?: boolean
}

export interface ITtvInformationFormData {
  user: string
  operation_date: string
  investment_portfolio_id: TtvId | null
  description_portfolio_name: string
  status?: string
  operation_number?: string
  title_number?: string
  ttv_type: TtvTypes | null
  position: PositionTypes | null
  paper_id: TtvId | null
  paper_description?: string
  isin_code?: string
  operation_type_id: TtvId | null
  operation_type_description: string
  number_days: number | null
  end_date: string
  counterparty_id: TtvId | null
  currency_id: TtvId | null
  currency_value: number | null
  folio: number | null
  compensation_system: string | null
  negotiation_value: number | null
  nominal_delivered: number | null
  market_delivered: number | null
  nominal_received: number | null
  market_received: number | null
  money_value: number | null
  money_yield: boolean
  yield_percentage: number | null
  yield_value: number | null
  comission_base: CommissionBaseMonetaryMarket | null
  commission_value: number | null
  commission_result: number | null
  commission_modality: CommissionModality | null
  return_value: number | null
  paper_type_id: number | null
  counterparty_description?: string | null
  percentage_yield?: number | null
  perfomance_value?: number | null
  basic_status?: string | null
  basic_number_title?: string | null
  basic_number_operation?: string | null
}

export interface ITtvInformationSelectOptions {
  investment_portfolio: ITtvOption[]
  operation_type: ITtvOption[]
  paper: ITtvOption[]
  currency: ITtvOption[]
  counterparties?: ITtvOption[]
  compensation_systems?: ITtvOption[]
  [key: string]: ITtvOption[] | undefined
}

export interface IRegisterTtvPayload {
  operation_date: string
  investment_portfolio_id: number | null
  ttvs: string | null
  position: string | null
  paper_type_id: number | null
  operation_type_id: number | null
  start_date: string | null
  number_days: number | null
  end_date: string | null
  counterparty_id: number | null
  currency_id: number | null
  folio: number | null
  compensation_system: string | null
  ttv_negotiation_value: number | null
  face_value_title_delivered: number | null
  market_value_title_delivered: number | null
  face_value_title_received: number | null
  market_value_title_received: number | null
  value_money: number | null
  money_perfomance: boolean | null
  comission_base: string | null
  comission_value?: number | null
  commission_modality?: string | null
  value?: number | null
  commission_value?: number | null
  percentage_yield?: number | null
  perfomance_value?: number | null
  return_value: number | null
  titles_delivered: ITtvTitle[]
  titles_received: ITtvTitle[]
}

export interface ITtvTitle {
  title_id: number
  issuer_id: number
  deposit_id: number
  isin_code_id: number
  paper_type_id: number
  currency_id: number
  market_value: number
}

export interface IRepoInformationForm {
  user: string
  operation_date: string
  investment_portfolio_id: number | null
  paper_description?: string
  operation_type_description: string
  description_portfolio_name: string
  counterparty_description?: string | null
  portfolio_code?: string | null
  repo: RepoPosition | null
  repo_type: RepoTypes | null
  paper_id: number | null
  operation_type_id: number | null
  start_date: string
  days_number: number | null
  end_date: string
  rate_value: number | null
  rate_class: RateClasses | null
  days_base: DaysBase
  nominal_value: number | null
  counterparty_id: number | null
  currency_id: number | null
  folio: number | null
  compensation_system: string | null
  warranty_value: number | null
  warranty_percentage: number | null
  return_value: number | null
  status?: string
  operation_number?: string
  title_number?: string
  isin_code?: string
  negotiation_value?: number | null
  yield_value?: number | null
  yield_percentage?: number | null
  commission_base?: CommissionBaseMonetaryMarket | null
  commission_value?: number | null
  commission_mode?: CommissionModality | null
}

export interface IRegisterRepoPayload {
  operation_date: string
  investment_portfolio_id: number
  repo: string
  repo_type: string
  paper_type_id: number
  operation_type_id: number
  start_date: string
  number_days: number
  end_date: string
  agreed_rate: number
  rate_class: string
  base_days: string
  face_value: number
  counterparty_id: number
  currency_id: number
  folio: number
  compensation_system: string
  guarantee_value: number
  guarantee_percentage: number
  return_value: number
  repo_warranty: IRepoWarranty[]
}

export interface IRepoWarranty {
  title_id: number
  issuer_id: number
  deposit_id: number
  isin_code_id: number
  paper_type_id: number
  currency_id: number
  market_value: number
}

export interface ISimultaneousInformationForm {
  user: string
  operation_date: string
  investment_portfolio_id: string | number | null
  description_portfolio_name: string
  position: 'Activa' | 'Pasiva'
  paper_id: number | null
  paper_description?: string
  operation_type_description: string
  operation_type_id: number | null
  start_date: string
  days_number: number | null
  end_date: string
  rate_value: number | null
  rate_class: RateClasses
  days_base: DaysBase
  nominal_value: number | null
  counterparty_id: number | null
  counterparty_description?: string | null
  currency_id: number | null
  folio: number | null
  compensation_system: string | null
  warranty_value: number | null
  warranty_percentage: number | null
  return_value: number | null
  status?: string
  operation_number?: string
  title_number?: string
}

export interface IRegisterSimultaneousPayload {
  operation_date: string
  investment_portfolio_id: number
  simultaneous: string
  paper_type_id: number
  operation_type_id: number
  start_date: string
  number_days: number
  end_date: string
  agreed_rate: number
  rate_class: string
  base_days: string
  face_value: number
  counterparty_id: number
  currency_id: number
  folio: number
  compensation_system: string
  guarantee_value: number
  guarantee_percentage: number
  return_value: number
  simultaneous_warranty: ISimultaneousWarranty[]
}

export interface ISimultaneousWarranty {
  title_id: number
  issuer_id: number
  deposit_id: number
  isin_code_id: number
  paper_type_id: number
  currency_id: number
  market_value: number
}

export interface IOptionSelect {
  label: string
  value: string | number
}

export interface IWarrantyFormData {
  rate?: number | null
  title_id: number | null
  issuer_id: number | null
  isin_code: string
  issuer_description?: string | null
  mnemonic: string
  paper_id: number | null
  paper_description?: string | null
  issue_date: string
  maturity_date: string
  rate_type: string
  rate_code: string
  rate_value: number | null
  spread: number | null
  modality: string
  currency_id: number | null
  currency_description?: string | null
  periodicity: string
  tir_purchase: number | null
  deposit_id: number | null
  deposit_description?: string | null
  face_value: number | null
  units_value: number | null
  market_value: number | null
  isin_code_id?: number | string | null
  paper_type_id?: number | null
  currency_code?: string | null
}

export interface IOperationHistory {
  created_at: string
  updated_at: string
  creator_data: string
  update_data: string
}

export interface ITtvResponse {
  information: ITtvInformationFormData
  delivered: ITitleDelivered
  received: ITitlesReceived
  history?: IOperationHistory
}

export interface IRepoResponse {
  information: IRepoInformationForm
  warranty: IWarrantyFormData
  history: IOperationHistory
  interests: IInterestItem[]
}

export interface ISimultaneousResponse {
  information: ISimultaneousInformationForm
  warranty: IWarrantyFormData
  history?: IOperationHistory
  interests?: IInterestItem[]
}

export interface IInterestItem {
  id: number
  flow_date: string
  interest: number
  number_days: number
}

export interface ITtvIsinRaw {
  id: number
  isin_code_id?: string | number
  isin_code: string
  mnemonic?: string
  issue_date?: string
  maturity_date?: string
  perioricity?: string
  rate_type?: string
  rate_code?: string
  rate_value?: string | number | null
  modality?: string
  spread?: string | number | null
}

export interface ITtvIsinMeta {
  mnemonic: string
  issue_date: string
  maturity_date: string
  perioricity: string
  periodicity: string
  rate_type: string
  rate_code: string
  rate_value: number | null
  modality: string
  spread: number | null
}

export interface ITitleDelivered {
  title_id: number | null
  paper_id?: number | null
  paper_description?: string | null
  issuer_id: string | number
  isin_code_id: string | number | null
  mnemonic: string
  paper_type_id: number | null
  issue_date: string
  maturity_date: string
  rate_type?: string
  rate_code?: string
  rate_value?: number | null
  spread?: number | null
  modality?: string
  currency_id: number | null
  currency_description?: string | null
  currency_code?: string | null
  periodicity?: string
  tir_purchase?: number | null
  deposit_id: number | null
  deposit_description?: string | null
  face_value: number | null
  units_value: number | null
  market_value: number | null
}

export interface ITitlesReceived {
  title_id: number | null
  issuer_id: string | number | null
  isin_code_id: string | number | null
  mnemonic: string | null
  paper_type_id: number | null
  paper_description?: string | null
  issue_date: string
  maturity_date: string
  rate_type?: string
  rate_code?: string
  rate_value?: number | null
  spread?: number | null
  modality?: string | null
  currency: number | null
  currency_id?: number | null
  currency_code?: string | null
  currency_description?: string | null
  periodicity?: string | null
  tir_purchase?: number | null
  deposit_id?: number | null
  deposit_description?: string | null
  face_value?: number | null
  units_value: number | null
  market_value: number | null
}

export interface IMonetaryMarketOperationListItem {
  id: number
  operation: string
  operation_date: string
  investment_portfolio_code: string
  investment_portfolio_description: string
  paper: string
  title: number
  operation_number: number
  end_date: string
  status: string
  type: 'TTV' | 'Repo' | 'Simultáneo'
}

export type IRegisterMonetaryMarketPayload =
  | IRegisterTtvPayload
  | IRegisterRepoPayload
  | IRegisterSimultaneousPayload

export interface ITitleExtraInfo {
  id: number
  issuers_counterparty_id: number
  balance: number
  status_id: number
  unit_value: number
  purchase_value: number
  isin_code_id: number
  tir: number
  paper_type_id: number
  deposit_issuer_id: number
  currency_code: string
  paper_type_description?: string
}

export interface IHistoryTransaction {
  created_at: string
  created_by_user: string
  updated_at: string | null
  updated_by_user: string | null
}

export interface ITtvBackendResponse {
  success: boolean
  message: string
  data: {
    basic_data: {
      created_by_user: string
      operation_date: string
      portfolio_code: string
      portfolio_description: string
      status: string
      number_title: number
      number_operation: number
    }
    information_operation: {
      ttvs: string
      position: string
      paper_type: string
      operation_type: string
      start_date: string
      number_days: number
      end_date: string
      counterparty: string
      currency: string
      currency_value: string
      folio: number
      compensation_system: string
      ttv_negotiation_value: string
      face_value_title_delivered: string
      market_value_title_delivered: string
      face_value_title_received: string
      market_value_title_received: string
      value_money: string
      money_perfomance: boolean
      percentage_yield: number | null
      perfomance_value: string
      comission_base: 'No aplica' | 'Porcentaje' | 'Valor fijo'
      value: string | null
      commission_value: string
      commission_modality: 'Anticipada' | 'Vencida' | null
      return_value: string
    }
    'history of monetary transactions': IHistoryTransaction
    titles_awarded: {
      title_id: number
      issuer: string
      isin: string
      mnemonic: string
      paper: string
      issue_date: string
      maturity_date: string
      rate_type: string
      rate_code: string
      fixed_rate_value: string
      spread: string | null
      modality: string
      currency: string
      perioricity: string
      deposit_id: string
      market_value: string
      irr_purchase: number
      face_value: string
      status: string
    }
    titles_received: {
      title_id: number
      issuer: string
      isin: string
      mnemonic: string
      paper: string
      issue_date: string
      maturity_date: string
      rate_type: string
      rate_code: string
      fixed_rate_value: string
      spread: string | null
      modality: string
      currency: string
      perioricity: string
      deposit_id: string
      market_value: string
      irr_purchase: number
      face_value: string
      status: string
    }
  }
}

export interface ISimultaneousInterestFlow {
  id: number
  flow_date: string
  interest: string
  number_days: number
}

export interface ISimultaneousBackendResponse {
  success: boolean
  message: string
  data: {
    basic_data: {
      created_by_user: string
      operation_date: string
      portfolio_code: string
      portfolio_description: string
      status: string
      number_title: number
      number_operation: number
    }
    information_operation: {
      simultaneous: 'Activa' | 'Pasiva'
      paper_type: string
      operation_type: string
      start_date: string
      number_days: number
      end_date: string
      agreed_rate: string
      rate_class: 'Nominal' | 'Efectivo'
      base_days: 360 | 365
      face_value: string
      counterparty: string
      currency: string
      folio: number
      compensation_system: string
      guarantee_value: string
      guarantee_percentage: string
      return_value: string
    }
    guarantee: {
      title_id: number
      issuer: string
      isin: string
      mnemonic: string
      paper: string
      issue_date: string
      maturity_date: string
      rate_type: string
      rate_code: string
      fixed_rate_value: string
      spread: string | null
      modality: string
      currency: string
      perioricity: string
      deposit_id: string
      market_value: string
      irr_purchase: number
      face_value: string
      status: string
    }
    interests: ISimultaneousInterestFlow[]
  }
}

export interface IRepoBackendResponse {
  success: boolean
  data: {
    basic_data: {
      created_by_user: string
      operation_date: string
      portfolio_code: string
      portfolio_description: string
      status: string
      number_title: number
      number_operation: number
    }
    information_operation: {
      repo: string
      repo_type: string
      paper_type: string
      operation_type: string
      start_date: string
      number_days: number
      end_date: string
      agreed_rate: string
      rate_class: string
      base_days: number
      face_value: string
      counterparty: string
      currency: string
      folio: number
      compensation_system: string
      guarantee_value: string
      guarantee_percentage: string
      return_value: string
    }
    guarantee: {
      title_id: number
      issuer: string
      isin: string
      mnemonic: string
      paper: string
      issue_date: string
      maturity_date: string
      rate_type: string
      rate_code: string
      fixed_rate_value: string
      spread: string | null
      modality: string
      currency: string
      perioricity: string
      deposit_id: string
      market_value: string
      irr_purchase: number
      face_value: string
      status: string
    }
    interests: {
      id: number
      flow_date: string
      interest: string
      number_days: number
    }[]
  }
  message: string
}

export type DropdownOptions = {
  label: string
  icon?: string
  routeName?: string
  action?: () => void
}

export interface ICurrencyForPaperTypeMonetaryRaw {
  paper_type_code: string
  paper_type_id: number
  type_of_currency: string
  description_currency: string
  value: number
  currency_id: number
  currency_code: string
}

export interface ICurrencyMonetaryMeta {
  rate: number
  code: string
  type_of_currency: string
  paper_type_id: number
  paper_type_code: string
}

export interface IOptionsMonetary {
  label: string
  value: string | number
}

export interface IOptionMonetaryWithMeta<M> extends IOptionsMonetary {
  meta: M
}

export interface IInvestmentPortfolioOption {
  label: string
  value: { code: string; description: string }
  code: string
  description: string
}

export interface IMoneyMarketTransactionRecord {
  id: number
  created_by_user: string | null
  operation_date: string | null
  investment_portfolio_code: string | null
  investment_portfolio_description: string | null
  operation_number: string | null
  start_date: string | null
  number_days: number | null
  end_date: string | null
  counterparty: string | null
  negotiation_value: number | null
  rate_value: number | null
  return_value: number | null
}

export interface IUpdateMoneyMarketPayload {
  modification_type: string
  observation: string
  number_days: number
}

export interface IEditOperationForm {
  user: string
  operation_date: string
  portfolio_code: string
  portfolio_description: string
  operation_number: string
  start_date: string
  days_number: number | null
  end_date: string
  counterparty: string
  negotiation_value: number
  rate_value: number
  return_value: number
  modification_type: string | null
  observation: string
}

export interface IOptionsEditForm {
  label: string
  value: string
}
