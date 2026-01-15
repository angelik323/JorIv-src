export interface IAccountingParametersAccountingBlockList {
  id: number
  business_group: {
    id: number
    name: string | null
    indice: number | null
    code: string | null
    sub_types: [
      {
        id: number
        name: string | null
        indice: number | null
        business_type_id: number | null
      }
    ]
  }
  accounting_plan: {
    id: number
    code: string | null
    purpose: string | null
  }
  plan_cost_center: {
    id: number
    code: string | null
    purpose: string | null
  }
  business_group_id: number
  accounting_plan_id: number
  plan_cost_center_id: number
  budget_block_id: number
  can_edit: boolean
}

export interface IAccountingParametersAccountingBlockView {
  id?: number | null
  business_group_id: number | string | null
  accounting_plan_id: number | string | null
  plan_cost_center_id: number | string | null
  budget_block_id: number | string | null
  created_by_form: boolean
}

export interface IAccountingParametersAccountingBlockForm
  extends IAccountingParametersAccountingBlockView {
  consecutive?: number | string | null
}

export interface IAccountingBlockEmits {
  (e: 'close-modal'): void
  (e: 'update-fetch-table'): void
}
