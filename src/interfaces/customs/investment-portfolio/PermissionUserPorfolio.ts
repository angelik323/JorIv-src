export interface IPermissionUserPorfolioForm {
  id?: number | null
  user_code?: {
    code?: string
    id?: number | null
  }
  user_id?: string | null
  user_name?: string
  portfolio_code?: {
    code?: string
    id?: number | null
  }
  portfolio_description?: string
  created_at?: string
  creator_data?: string
  updated_data?: string
  updated_at?: string
  document?: string
  investment_portfolio_code?: string
  investment_portfolio_id?: number | null
  investment_name?: string
}
export interface IPermissionUserPorfolioCreate {
  user_id?: number | null
  user_name?: string
  investment_portfolio_id?: number | null
  portfolio_description?: string
}

export interface IPermissionUserPortfolioItemList {
  id: number
  investment_portfolio_code: string
  investment_portfolio_name: string
  document: string
  user_name: string
}
