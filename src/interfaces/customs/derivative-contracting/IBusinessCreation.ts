export interface IBusinessTrustSelection {
  id?: number
  name?: string
  code?: string
  status?: {
    id: number
    status: string
  }
  staus?: {
    id: number
    status: string
  }
  type?: {
    id: number
    name: string
  }
  sub_type?: {
    id: number
    name: string
  }
  subType?: {
    id: number
    name: string
  }
}

export interface IBusinessCreationForm {
  business_trusts: IBusinessTrustSelection | null
  manage_budget: boolean
  manage_proyects: boolean
  manage_works_structures: boolean
  work_plan_business: IBusinessPlanTable[]
}

export interface IBusinessCreationFormPayload {
  business_trusts_id: number
  manage_budget: boolean
  manage_proyects: boolean
  manage_works_structures: boolean
  work_plan_business: number[]
}

export interface IBusinessPlanTable {
  id: number
  plan: number | null
}

export interface IILoadedRecordPages {
  currentPage: number
  lastPage: number
}
