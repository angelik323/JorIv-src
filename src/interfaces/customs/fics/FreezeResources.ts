export interface IFreezeResources {
  id?: number
  date?: string
  titular_identification?: string
  titular_name?: string
  investment_plan_balance?: number
  type?: string
  format?: string
  value?: number
  actions?: string
}

export interface IFreezeResourcesCreate {
  orderer_identification?: number | string
  orderer_description?: string
  observations?: string
  operation_type?: string
  operations?: IFreezeOperationsResourcesCreate[]
}
export interface IFreezeOperationsResourcesCreate {
  fiduciary_investment_plan_id?: number | string
  freeze_type?: string
  freeze_value?: number | null
  unfreeze_value?: number | null
  orderer_identification?: string
  orderer_description?: string
  observations?: string
}
export interface IFreezeResourcesCreateList {
  id: number
  investmentFundCode: string
  destinationInvestmentPlan: string
  investmentPlanDescription: string
  investmentPlanBalance: number
  freezeType: string
  freezeValue: number | null
  unfreezeValue?: number | null
  unfreeze_balance?: number | null
}

export interface IFreezeResourceModel {
  id?: number
  operation_type?: string
  collective_investment_fund_id?: number
  fund?: {
    id?: number
    fund_code?: string
    fund_name?: string
  }
  fiduciary_investment_plan_id?: number
  plan?: {
    id?: number
    code?: string
    plan_code?: string
    plan_balance?: string
    plan_status?: {
      id?: number
      status?: string
      comments?: string | null
    }
  }
  plan_status?: {
    id?: number
    status?: string
    comments?: string | null
  }
  investment_plan_balance?: string
  freeze_type?: string
  freeze_value?: string | number
  operation_number?: number
  orderer_identification?: string
  orderer_description?: string
  observations?: string
  holder?: {
    id?: number | null
    document?: string
    name?: string
    type?: string
  }
  unfreeze_value?: string | number
}
