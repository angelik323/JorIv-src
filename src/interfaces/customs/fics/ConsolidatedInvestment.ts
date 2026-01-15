import { IVariableCommission } from './FiduciaryCommission'

export interface IConsolidatedInvestment {
  id: number
  code: string
  type: number
  type_description: number
  liquidation_base: string
  liquidation_base_abv: string
  rate_type: string
  rate_type_abv: string
  fixed_rate_percentage: string
  description: string
  variable_rates?: IVariableCommission[]
}

export interface IConsolidatedInvestmentRequest {
  id?: number
  code?: string
  type?: number
  liquidation_base: string
  description: string
  rate_type: string
  fixed_rate_percentage?: string
  variable_rates?: IVariableCommission[]
}

export interface IConsolidatedInvestmentRequestAssign {
  consolidator_fund_id?: number
  collective_investment_fund_id?: number
}
