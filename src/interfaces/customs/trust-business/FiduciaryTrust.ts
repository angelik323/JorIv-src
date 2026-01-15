export interface IFiduciaryTrust {
  mandate_code?: string
  business_trust?: IBusiness
  business_trust_id: number | null
  currency: string
  id?: number
  investment_fund?: IFund
  fund?: IFund
  investment_fund_id: number | null
  name: string
  real_estate_project?: IRealEstateProject
  real_estate_project_id: number | null
  stage?: IState
  stage_id: number | null
  status?: string
  status_id: number | null
}

interface IBusiness {
  id: number
  name: string
  business_code: string
}
interface IRealEstateProject {
  id: number
  name: string
  project_name: string
}

interface IState {
  id: number
  stage_number: string
}

interface IFund {
  id: number
  fund_code: string
  fund_name: string
  fund_type_id: number
  business_trust: IBusinessTrust
  consolidation_option: IConsolidationOption
  fic_rating: string
  status_id: number
  has_participation_types: boolean
  is_fund_validated: boolean
  last_closing_date: null
}

interface IBusinessTrust {
  id: number
  business_code: string
  name: string
}

interface IConsolidationOption {
  id: number
  code: string
  description: string
}
