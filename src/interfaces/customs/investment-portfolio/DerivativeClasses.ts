export interface IDerivativeClassesListItem {
  code: string
  id: number
  date: string
  operation: string
  derived_code: string
  derivative_type: string
  description: string
  underlying_type: string
  currency: string
  status: string
  derivative_underlying: string
}

export interface IDerivativeClassesForm {
  id?: number | null
  code: string
  derivative_type_id: string | number
  derivative_type?: string
  description: string
  derivative_underlying_id: string | number
  derivative_underlying?: string
  currency_id: string | number
  currency?: string
  operation_type: string
  end_early: boolean
  paper_type_id: number
  paper_type?: string
  currency_payment_id: string | number
  currency_payment?: string
  badge_x_id: string | number
  badge_x?: string
  badge_y_id: string | number
  badge_y?: string
  rate_point_id: number | string
  rate_point?: string
  rate_x_id: number | string
  rate_x?: string
  rate_y_id: number | string
  rate_y?: string
  status_id: string | number
}

export interface IDerivativeClassesToCreate {
  code: string
  derivative_type_id: string | number
  derivative_type?: string
  description: string
  derivative_underlying_id: string | number
  derivative_underlying?: string
  currency_id: string | number
  currency?: string
  operation_type: string
  end_early: boolean
  paper_type_id: number
  paper_type?: string
  currency_payment_id: string | number
  currency_payment?: string
  badge_x_id: string | number
  badge_x?: string
  badge_y_id: string | number
  badge_y?: string
  rate_point_id: number | string
  rate_point?: string
  rate_x_id: number | string
  rate_x?: string
  rate_y_id: number | string
  rate_y?: string
  status_id: string | number
}

export interface IDerivativeClassesResponse {
  id: number
  code: string
  derivative_type_id: string | number
  derivative_type?: string
  description: string
  derivative_underlying_id: string | number
  derivative_underlying?: string
  currency_id: string | number
  currency?: string
  operation_type: string
  end_early: boolean
  paper_type_id: number
  paper_type?: string
  currency_payment_id: string | number
  currency_payment?: string
  badge_x_id: string | number
  badge_x?: string
  badge_y_id: string | number
  badge_y?: string
  rate_point_id: number | string
  rate_point?: string
  rate_x_id: number | string
  rate_x?: string
  rate_y_id: number | string
  rate_y?: string
  status_id: string | number
}
