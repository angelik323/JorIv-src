interface IAccountingStructure {
  id: number
  code: string
  purpose: string
}

export interface IConsolidatedBusiness {
  business_code: string
  business_name: string
  current_period: string
  last_closing_daily: string
  generates_daily: boolean
  is_consolidator: string | boolean
  status: string | null
  accounting_period?: string
}

export interface IAccountingConsolidationBase {
  id: string | number | null
  business_code?: string | null
  business_name?: string
  current_period?: string
  status?: string
}

export interface IAccountingConsolidationDetail
  extends IAccountingConsolidationBase {
  name?: string
  business_trust_id: number
  last_consolidation_date: string | null
  last_consolidation?: string | null
  consolidation_type: string
  accounting_period: string
  execution_date: string
  is_consolidator: boolean | string | null
  generates_daily_closure: boolean
  code_identificator_bussines?: string[] | string | null
  accounting_structure?: IAccountingStructure
  last_verified: string | null
  consolidated_businesses: IConsolidatedBusiness[]
}

export interface IAccountingConsolidationList
  extends IAccountingConsolidationBase {
  business_code: string
  business_name: string
  nowPeriod: string
  lastVerified: string
  closeDaily: boolean
  consolidation: string | boolean
}

export interface IAccountingConsolidation extends IAccountingConsolidationBase {
  parent?: string
  bussiness_code?: string
  generates_daily_closure?: boolean
  is_consolidator?: boolean
  name: string
  description: string
  period: string
  ultimateConsolidationDate: Date
  createdAt: Date
  updatedAt: Date
  lastConsolidationDate?: Date
  consolidated_children?: IConsolidatedBusiness[]
}
