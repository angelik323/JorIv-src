export interface IConsolidationTree {
  id: number
  code: string
  name: string
  status_id: number | string
  accounting_structure: IConsolidationTreeAccountingStructure
  childrens: IConsolidationTreeChild[]
  last_consolidation?: string
}

export interface IConsolidationTreeChild {
  id: number
  code: string
  name: string
  status_id: number
  current_period?: boolean | string
  daily_closing: boolean
  last_verification_date?: string | null
  last_verification?: string
  is_consolidator?: boolean
  last_consolidation?: string
}

export interface IConsolidationTreeAccountingStructure {
  id: number
  code: string
  purpose: string
}

export interface IConsolidationTreeStatus {
  id: number
  name: string
}

export interface IRequestCreateConsolidationTree {
  parent_id: number
  child_ids: number[]
}

export interface IRequestUpdateConsolidationTree {
  parent_id: number
  new_childs_ids: number[]
  remove_childs_ids: number[]
}
