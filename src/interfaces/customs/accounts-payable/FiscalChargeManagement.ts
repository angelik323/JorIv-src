export interface IFiscalChargeManagementItem {
  id: number
  name: string
  code: string
  tax_type: {
    id: number
    abbreviation: string
    description: string
  }
  tax_nature: {
    id: number
    name: string
  }
  revenue_beneficiary_entity: {
    id: number
    name: string
  }
  status: {
    id: number
    status: string
  }
}

export interface IFiscalChargeManagementForm {
  code: string | null
  name: string | null
  tax_type_id: number | null
  tax_nature_id: number | null
  revenue_beneficiary_entity_id: number | null
  status_id?: number
}
