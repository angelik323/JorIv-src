export interface IFiduciaryCommission {
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

export interface IFiduciaryCommissionRequest {
  id?: number
  code?: string
  type?: number
  liquidation_base: string
  description: string
  rate_type: string
  fixed_rate_percentage?: string
  variable_rates?: IVariableCommission[]
}

export interface IVariableCommission {
  id?: number
  initial_balance: number
  final_balance: number
  rate_percentage: string
}
