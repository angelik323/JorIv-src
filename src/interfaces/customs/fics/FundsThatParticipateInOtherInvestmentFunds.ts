export interface IFundsThatParticipateInOtherInvestmentFundsList {
  id: number
  code: string
  collective_investment_fund_id: number
  status: string
  collective_investment_fund: {
    fund_code: string
    fund_name: string
  }
}

export interface IFundsThatParticipateInOtherInvestmentFundInfo {
  business_trust: {
    business_code: string
    name: string
  }
  id: number
  name: string
}

export interface IFundsThatParticipateInOtherInvestmentMovementsPayload {
  'filter[fiduciary_investment_plan_id]': number
  'filter[from_date]': string | null
  'filter[to_date]': string | null
  sort?: string
}

interface IFund {
  id: number
  code: string
  fund_name: string
  fund_code: string
}

interface IPlan {
  id: number
  code: string
  plan_balance: number
}

interface IOperationType {
  id: number
  description: string
}

export interface IFundsThatParticipateInOtherInvestmentMovementsList {
  id: number
  code: string
  fund: IFund
  plan: IPlan
  operationType: IOperationType
  balance: number
  value: string
  created_at: string
  operation_date: string
}
