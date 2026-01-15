export interface IForeignExchangeSalesBuy {
  id?: number
  investment_portfolio_id: number
  investment_description?: string
  operation_type_id: number
  operation_type_description?: string
  paper_type_id: number
  origin_currency_id: number
  destination_currency_id: number
  origin_bank_id: number
  origin_bank_account_id: number
  destination_bank_id: number
  destination_bank_account_id: number
  issuer_counterparty_id: number
  issuer_counterparty_description?: string
  operation_date: string
  origin_amount: number
  official_rate: number
  negotiated_rate: number
  description?: string
  type: 'BUY' | 'SELL'
  profit_loss_sale: number
}

export interface IForeignExchangeSalesBuyItem {
  id?: number
  investment_portfolio_id: number
  operation_type_id: number
  operation_type_description?: string
  title_id?: number
  operation_number?: string
  investment_portfolio_code?: string
  investment_portfolio_description?: string
  paper_type_code?: string
  status: number | string
  paper_type_id: number
  origin_currency_id: number
  destination_currency_id: number
  origin_bank_id: number
  origin_bank_account_id: number
  destination_bank_id: number
  destination_bank_account_id: number
  issuer_counterparty_id: number
  issuer_counterparty_description?: string
  operation_date: string
  origin_amount: number
  official_rate: number
  negotiated_rate: number
  description?: string
  type: 'BUY' | 'SELL'
}

export interface IForeignExchangeSalesView {
  id: number
  operation_date: string
  operation_number: string | null
  investment_portfolio_id: number
  investment_portfolio_code?: string | null
  investment_portfolio_description?: string | null

  operation_type_id: number
  operation_type_code?: string | number | null
  operation_type_description?: string | null

  paper_type_id: number
  paper_type_code?: string | null

  status?: number | string | null

  origin_bank_id: number
  origin_bank_name?: string | null
  destination_bank_id: number
  destination_bank_name?: string | null

  origin_bank_account_id?: number | null
  origin_bank_account_name?: string | null
  destination_bank_account_id?: number | null
  destination_bank_account_name?: string | null

  issuer_counterparty_id?: number | null
  issuer_counterparty_name?: string | null
  issuer_counterparty_description?: string | null

  origin_currency_id?: number | null
  destination_currency_id?: number | null
  origin_currency_code?: string | null
  destination_currency_code?: string | null

  origin_amount: string | number
  official_rate: string | number
  negotiated_rate: string | number

  description?: string | null
  profit_loss?: string | number | null
  type: 'BUY' | 'SELL'
}
