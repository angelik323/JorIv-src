export interface IBillingAndPortfolioClousureInformationForm {
  id: number
  period: string | null
  closing_date: string
  observations: string | null
  validate_requirements_checked: boolean | null
  revalidate_requirements_checked?: boolean | null
  validations: string | null
  confirmed_validated: boolean | null
  status?: {
    id: string
    name: string
  }
  requirements_validated?: boolean | null
}

export interface IBillingAndPortfolioClousureList {
  id: number
  period: string
  closing_date: string
  observations: string
  validate_requirements_checked: boolean
  validations: string
  requirements_validated: boolean
  confirmed_validated: boolean
  status_id?: number
  created_at?: string
  updated_at?: string
  created_by?: string | null
  updated_by?: string | null
  status?: {
    id: number
    name: string
    created_by: string | null
    created_at: string
    updated_at: string
  }
}
