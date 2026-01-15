export interface IFiduciaryBusinessCommissionsResponse {
  id: number
  business_code_snapshot: string
  business_name_snapshot: string
  commission_class_catalog_id: number
  commission_type_catalog_id: number
  commission_type: {
    id: number
    description: string
    value: number
  }
  commission_class_catalog: {
    id: number
    name: string
  }
  commission_type_catalog: {
    id: number
    name: string
  }
  periodicity: string
  colllection: string
  iva: boolean
  observation: string
  settlement_parameters: IFiduciaryBusinessCommissionsCalculationForm | null
  third_party_billings_id: number
  third_party_billings: IThirdPartyBillings
  comission_settlement_statuses_id: number
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface IFiduciaryBusinessCommissionsDescriptionsList {
  id: number
  observation: string
  comission_settlement_statuses_id: number
  settlement_parameters_id: number
  comission_settlement_statuses: null
  billing_trusts: null
  settlement_parameters: IFiduciaryBusinessCommissionsCalculationForm | null
  commission_type_catalog: null
  commission_class_catalog: null
  created_at: string
}

export interface ICalculationCommissionsResponse {
  id: number
  balances_amount: string
  balances_percentage: string
  base_amount: string
  calculation_type: string
  iva_amount: string
  iva_percentage: number
  other_amount: string
  other_value_amount: string
  payment_amount: string
  payments_count: string
  returns_amount: string
  returns_percentage: string
  smlmv_amount: string
  smlmv_quantity: string
  total_amount: string
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
}

export interface IFiduciaryBusinessCommissionsList {
  id: number
  business_code_snapshot: string
  business_name_snapshot: string
  business_start_date_snapshot: string
  business_end_date_snapshot: string
  business_status_snapshot: number
  created_by: number
  updated_by: number | null
  created_at: string
  updated_at: string
  colllection?: string
  commission_type?: {
    full_label: string
  }
  billing_trust?: {
    code: string
  }
}

export interface IFiduciaryBusinessCommissionsForm {
  business_code: string | null
  name: string | null
  commission_type_id?: number | null
  commission_type_description?: string | null
  commission_class_catalog_id?: number | null
  commission_class_catalog_name?: string | null
  commission_type_catalog_id: number | null
  commission_type_catalog_name?: string | null
  periodicity: string | null
  colllection: string | null
  iva: boolean | string | null
  observation: string | null

  third_party_billings_id: number | null
  third_party_billings?: IThirdPartyBillings | null
  comission_settlement_statuses_id?: number | null
}

export interface IFiduciaryBusinessCommissionsToEdit {
  commission_type_catalog_id: number | null
  commission_class_catalog_id: number | null
  periodicity: string | null
  colllection: string | null
  iva: boolean | string | null
  observation?: string | null
  third_party_billings_id: number | null
}

export interface IThirdPartyBillings {
  id: number
  third_party_document_type: string
  third_party_document: string
  third_party_name: string
}

export interface IDescriptionsTable {
  id: number
  observation: string
}

export interface IDescriptionsForm {
  observation: string | null
}

export interface IFiduciaryBusinessCommissionsCalculationForm {
  calculation_type: string | null
  smlmv_amount: number | null
  payment_amount: number | null
  returns_percentage: number | null
  balances_percentage: number | null
  other_amount: number | null

  smlmv_quantity: number | null
  payments_count: number | null
  balances_amount: number | null
  returns_amount: number | null
  other_value_amount: number | null

  base_amount: number | null
  iva_percentage: number | null
  iva_amount: number | null
  total_amount: number | null

  commission_class_catalog_id?: number | null
  commission_type_catalog_id?: number | null
}
