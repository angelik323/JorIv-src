import { IFiduciaryInvestmentPlanResource } from '@/interfaces/customs'

export interface IGenericInvestmentPlans {
  id: number
  fiduciary_investment_plan: string
  collective_investmen_fund: string
  description_investment_plan: string
  participation_type: string
  treasurie_pay_form: string
  plan_balance: number
}

export interface IGenericInvestmentPlansCreate {
  fiduciary_investment_plan_id: number
  collective_investment_fund_id: string
  treasurie_pay_form_id: string
}

// ------ Legalization ------
export interface IGenericInvestmentPlansLegalizeCollectiveInvestmentFund {
  id: number
  code: string
  name: string
  end_date: string | null
}

export interface IGenericInvestmentPlansLegalizeFiduciaryInvestmentPlan {
  id: number
  code: string
  balance: number
}

export interface IGenericInvestmentPlansLegalizeResponse {
  id: number
  collective_investment_fund: IGenericInvestmentPlansLegalizeCollectiveInvestmentFund
  fiduciary_investment_plan: IGenericInvestmentPlansLegalizeFiduciaryInvestmentPlan
  registration_date: string
  treasurie_pay_form: number
}

export interface IGenericInvestmentPlansLegalizeDestination {
  collective_investment_fund_id: number
  fiduciary_investment_plan_id: number
  value: number
  transfer_returns: number
}

export type IGenericInvestmentPlansLegalizeDestinationItemList =
  IGenericInvestmentPlansLegalizeDestination & {
    id: number
    business: string
    capital_value: number
    fiduciary_investment_plan_options: IFiduciaryInvestmentPlanResource[]
  }

export interface IGenericInvestmentPlansLegalizeFormData {
  operation_investment_plan_id: number
  total_value: number
  total_transfer_returns: number
  destinations: IGenericInvestmentPlansLegalizeDestination[]
}

export interface IGenericInvestmentPlansLegalizeContribution {
  id: number
  transfer_number: string
  operation_number: number
  value: number
  returns: number
  balance: number
  retention: number
  contribution_date: string
  destination_plans: {
    id: number
    code: string
  }[]
}

export type IGenericInvestmentPlansLegalizeLegalization =
  IGenericInvestmentPlansLegalizeContribution & {
    legalization_id: number
  }

export interface IGenericInvestmentPlansLegalizationExportDetails {
  id: number
  transfer_number: string
  origin_fund: string
  generic_investment_plan: number
  value: number
  capital: string
  returns: string
  transfer_date: string
  destination_fund: string
  destination_investment_plan: string
}
