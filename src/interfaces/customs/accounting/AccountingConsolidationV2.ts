export interface IAccountingConsolidationForm {
  current_period?: string
  date_to_consolidate?: string
  from_consolidation_business_code?: string
  to_consolidation_business_code?: string
  accounting_structure_id?: number | null
  selected_businesses_id?: number[]
  daily_closing?: boolean
}

//Tables interfaces reference
export interface IAccountingListItem {
  id: number | string
  process_code: string
  date_last_consolidation: string
  account_structure: {
    id: number | string
    code: string
    description: string
  }
  from_business: {
    code: string
    description: string
  }
  to_business: {
    code: string
    description: string
  }
  current_period: string
  close_period: string
  status: {
    id: number
    status: string
  }
}
export interface IAccountingBusinessConsolidatingItem {
  id?: number | string
  consolidation_business_code?: string
  accounting_structure?: string
  number_business_of_consolidated?: number
  date_last_consolidation?: string
  consecutive?: number | string
  status?: {
    id: number
    status: string
  }
  business?: {
    id: number
    code: string
    name: string
    period_closing: string
    quantity_children_business: number
    concat: string
    account?: {
      id: number
      code: string
      description: string
    }
    consolidation?: {
      id: number
      last_date_consolidate: string
      update_date: string
      status: {
        id: number
        status: string
      }
      details_novelties: string
    }
    last_consolidation?: {
      status: {
        id: number
        status: string
      }
    }
  }
  account_structure_relation?: {
    id?: string | number
    account_structure: {
      concat: string
    }
    last_consolidation_date: string
  }
  last_consolidation?: {
    status: {
      status: string
    }
  }
  consolidation_header?: {
    id?: number | string
    consolidation?: {
      id: number | string
    }
  }
}

export interface IAccountingConsolidationListProcess {
  business: {
    id: number
    code: string
    name: string
    period_closing: string
    quantity_children_business: number
    concat: string
  }
  account_structure_relation: {
    id: number
    last_consolidation: {
      id: number
      status: string
    }
    account_structure: {
      id: number
      code: string
      description: string
      concat: string
    }
    last_consolidation_date: string
  }
  last_consolidation: {
    id: number
    status: {
      id: number
      status: string
    }
  }
}

export interface IAccountingConsolidationBusinessData {
  last_update_date: string
  close_type: string
  concat: string
  current_period: string
  close_period: string
  period_closing: string
  accounting_structure: string
  business_consolidated: string
  consecutive?: number | string
  last_consolidation_date: string
  consolidation_business_code: string
  id?: number
  list_parent_consolidator_business?: Array<{
    business: {
      id: number
      code: string
      name: string
      period_closing: string
      quantity_children_business: number
      concat: string
    }
    account_structure_relation: {
      id: number
      last_consolidation_date: string | null
      account_structure: {
        id: number
        code: string
        description: string
        concat: string
      }
    }
    last_consolidation: {
      status: {
        id: number
        status: string
      }
      id: number
    }
  }>
  list_child_consolidated_business?: Array<{
    consolidation_header: {
      id: number
      consolidation: {
        id: number
        last_date_consolidate: string | null
        update_date: string | null
      }
    }
    id: number
    code: string
    name: string
    period_closing: string
    quantity_children_business: number
    concat: string
    business_children: []
  }>
  consolidation_header?: {
    id?: number | string
    consolidation: {
      id: number | string
      last_date_consolidate: string | null
      update_date: string | null
    }
  }
}

export interface IAccountingConsolidationBasicData {
  data_basic?: IAccountingConsolidationViewData
  data_form?: IAccountingConsolidationForm
  data_detail?: IAccountingConsolidationDetailData
}

export interface IAccountingConsolidationAccountingItem {
  id?: number | string
  consolidation_business_code: string
  consecutive?: string | number
  last_consolidation_date: string
  business_consolidated: string
  accounting_structure: string
  close_period?: string
  close_type: string
  current_period: string
  last_update_date: string
  concat?: string
  period_closing?: string
  period_closing_date?: string
  consolidation_header?: {
    current_period?: string
    close_period?: string
    consolidation?: {
      last_date_consolidate: string
      update_date: string
    }
  }
}

export interface IAccountingConsolidationViewData {
  id: number
  process_code: string
  date_last_consolidation: string
  current_period: string
  account_structure: {
    id: number
    code: string
    description: string
  }
  from_business: {
    id: number
    code: string
    description: string
  }
  to_business: {
    id: number
    code: string
    description: string
  }
  status: {
    id: number
    status: string
  }
  parent_business_consolidations: Array<{
    business: {
      id: number
      code: string
      name: string
      period_closing: string
      quantity_children_business: number
      concat: string
      account: {
        id: number
        code: string
        description: string
      }
      consolidation: {
        id: number
        last_date_consolidate: string
        update_date: string
        status: {
          id: number
          status: string
        }
        details_novelties: string
      }
    }
  }>
}

export interface IAccountingConsolidationFilterList {
  current_period?: string
  accounting_structure_id?: number | null
  date_to_consolidate?: string
  from_consolidation_business_code?: string
  to_consolidation_business_code?: string
  daily_closing?: boolean | string | null
}

export interface IAccountingConsolidationDetailData {
  id: number
  consolidation_header: {
    id: number
    process_code: string
    status: {
      id: number
      status: string
    }
    account_structure: {
      id: number
      code: string
      description: string
    }
  }
  business_trust: IAccountingConsolidationDetailBusinessItem
  executions: Array<IAccountingConsolidationDataListDetail>
}

export interface IAccountingConsolidationDataListDetail {
  id: number
  business: string | null
  novelty: string
  process_date: string
}

export interface IAccountingConsolidationDetailBusinessItem {
  id?: number
  code?: string
  name?: string
  period_closing?: string
  quantity_children_business?: number
  concat?: string
  status?: {
    id: number
    status: string
  }
}

export interface IAccountingConsolidationFiltersView {
  current_period: string
  accounting_structure_id: number | string
  date_to_consolidate: string | number
  from_consolidation_business_code: string | number
  to_consolidation_business_code: string | number
}

export interface IAccountingConsolidationViewRow {
  id?: number
  consolidation_business_code?: string
  accounting_structure?: string
  number_business_of_consolidated?: number
  status?: {
    id: number
    status?: string
  }
  concat?: string
  quantity_children_business?: number
  news?: string
  last_update_date?: string
}

export interface IAccountingConsolidationChildrenViewItem {
  id: number
  code?: number | string
  name?: string
  period_closing?: string
  quantity_children_business?: number | string
  concat?: string
  closing_type?: string
  last_date_consolidation?: string
}
