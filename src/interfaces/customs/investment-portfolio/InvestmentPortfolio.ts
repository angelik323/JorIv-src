export interface IInvestmentPortfolio {
  id?: number
  name: string
  description?: string
  code: string
  business_code: number
  business_trust_id?: number
  fic_code: string
  fic_id?: number
  currency: number
  currency_id?: number
  cost_center?: string
  cost_center_id: number
  last_valuation_date: string
  bank_id: number[]
  bank_account: number[]
  collection_method: number[]
  method_payment: number[]
  bank_accounts?: IBanks[]
  forms_compliance?: {
    method_payment: {
      id: number
      value: string
    }[]
    method_receives: {
      id: number
      value: string
    }[]
  }
  history?: {
    created_at: string
    creator_data: string
    updated_at: string
    updated_data: string
  }
}

export interface IBanks {
  bank_code: string
  id: number
  bank_accounts: {
    account_number: string
    id: number
  }[]
}

export interface IInvestmentPortfolioItem {
  id: number
  name: string
  description: string
  code: string
  business_code: string
  business: {
    code: string
  }
  fic_code: string
  fic: {
    code: string
  }
  currency: string
  cost_center: string | null
  last_valuation_date: string
  status_id: number
}
