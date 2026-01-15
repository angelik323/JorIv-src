export interface IInvestmentPlanParticipationModification {
  id: number
  fund: string
  fiduciary_investment_plan: number
  business_line: string
  new_business_line: string
  date: string
  requester: string
  status: {
    id: number
    status: string
  }
  operation_date: string
}

export interface IInvestmentPlan {
  id: number
  collective_investment_fund: number | string | null
  fiduciary_investment_plan: string
  business_line: number
  plan_status: {
    id: number
    status: string
  }
  plan_description: string
  plan_balance: string
  authorization_status: {
    id: number
    status: string
  }
  new_business_line_id?: number | null
  business_line_code: string
  fund_id?: number | null
}

export interface IInvestmentPlanParticipationModificationFormFilters {
  collective_investment_fund_id?: number | null
  plan_code?: string | null
}
