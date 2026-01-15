export enum EGuaranteeOperationType {
  MARGIN_CALL = 'Llamado al margen',
  MAINTENANCE = 'Mantenimiento de garantias',
}

export interface IGuaranteeOperationsList {
  id?: number
  type?: string
  operation?: string
  operation_date?: Date
  portfolio_code?: string
  portfolio_description?: string
  paper?: string
  number_operation?: number
  title_id?: number
  position?: string
  status?: string
}

export interface IGuaranteeOperationForm {
  id: number
  operation_date: string
  investment_portfolio_id: number | null
  investment_portfolio_code: string | null
  investment_portfolio_description: string
  operation_filter: string | null
  operation: string | null
  position: string | null
  money_market_transaction_record_id: number | null
  title_guarantee_new_id: number | null
}

export interface IGuaranteeOperationCurrentWarranty {
  issuer?: string
  isin_code?: string
  mnemonic?: string
  number_title?: number
  paper?: string
  issue_date?: string
  maturity_date?: string
  rate_type?: string
  rate_code?: string
  fixed_rate_value?: string
  spread?: string
  modality?: string
  perioricity?: string
  currency_code?: string
  deposit?: string
  face_value?: string
  unit_value?: string
  market_value?: string
  irr_purchase?: string
  title_id?: number
}

export interface IGuaranteeOperationMoneyOperationsList {
  id?: number
  type?: string
  operation?: string
  operation_code?: number
  start_date?: string
  end_date?: string
  agreed_rate?: string
  rate_class?: string
  base_days?: number
  face_value?: string
  return_value?: string
  guarantee_value?: string
  guarantee_percentage?: string
  title_id?: number
  current_warranty?: IGuaranteeOperationCurrentWarranty
}

export interface IGuaranteeOperationAvailableTitlesPortfolioList {
  id?: number
  issuers_counterparty_id?: number
  balance?: number
  status_id?: number
  unit_value?: string
  purchase_value?: number
  isin_code_id?: number
  tir?: string
  paper_type_id?: number
  deposit_issuer_id?: string
  currency_code?: string
  issuer?: string
  isin?: string
  mnemonic?: string
  paper?: string
  issue_date?: string
  maturity_date?: string
  rate_type?: string
  rate_code?: string
  rate_value?: string
  modality?: string
  spread?: string
  perioricity?: string

  isin_code?: string
  title_id?: number
  fixed_rate_value?: string
  currency?: string
  irr_purchase?: string
  deposit?: string
  face_value?: string
  market_value?: string
}

export interface IGuaranteeOperationMoneyOperationsResponse {
  data: IGuaranteeOperationMoneyOperationsList[]
  current_page: number
  last_page: number
}

export interface IGuaranteeOperationTilesResponse {
  data: IGuaranteeOperationAvailableTitlesPortfolioList[]
  current_page: number
  last_page: number
}

export interface IGuaranteeOperationPayload {
  position: string
  money_market_transaction_record_id: number
  operation: string
  title_guarantee_new_id: number
  type_guarantee_operation: string
}

interface IMonetaryOperation {
  number_operation?: number
  operation?: string
  operation_type?: number
  operation_description?: string
  start_date?: string
  end_date?: string
  agreed_rate?: string
  rate_class?: string
  base_days?: number
  face_value?: string
  return_value?: string
  guarantee_value?: string
  guarantee_percentage?: string
  title_id?: number
}

interface IGuaranteeOperation {
  issuer?: string
  isin_code?: string
  mnemonic?: string
  number_title?: number
  paper?: string
  issue_date?: string
  maturity_date?: string
  rate_type?: string
  rate_code?: string
  fixed_rate_value?: string
  spread?: string
  modality?: string
  perioricity?: string
  currency_code?: string
  deposit?: string
  face_value?: string
  unit_value?: string
  market_value?: string
  irr_purchase?: string
}

interface ICurrentWarranty extends IGuaranteeOperation {}

export interface IGuaranteeOperationResponseById {
  basic_data: {
    created_by_user: string
    operation_date: string
    portfolio_code: string
    portfolio_description: string
    operation: string
    position: string
    status: string
  }
  monetary_operation: IMonetaryOperation
  current_warranty: ICurrentWarranty
  guarantee_operation: IGuaranteeOperation
}
