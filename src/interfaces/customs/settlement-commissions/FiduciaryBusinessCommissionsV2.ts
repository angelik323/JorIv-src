export enum CalculationType {
  SMLMV = 'salario minimo mensual legal vigente',
  FIXED_VALUE = 'valor fijo',
  BENEFICIARY_PAYMENT = 'pago a beneficiarios',
  PERFORMANCE_PERCENTAGE = '% sobre rendimientos',
  BALANCE_PERCENTAGE = '% sobre saldos',
  MANUAL = 'manual',
  TRANSACTION_VALUE = 'valor por transacción',
  TRANSACTION_PERCENTAGE = '% sobre transacciones',
}
export interface IFiduciaryBusinessCommissionsResponseV2 {
  business_trust_commission: {
    id: number
    business_id: number
    billing_trust_id: number
    third_party_billings_id: number
    commission_type_id: number
    commission_type_catalog_id: number
    commission_class_catalog_id: number
    settlement_parameters_id: number | null
    comission_settlement_statuses_id: number
    business_code_snapshot: string
    business_name_snapshot: string
    business_start_date_snapshot: string
    business_end_date_snapshot: string
    business_status_snapshot: number
    description: string
    observation: string
    collection: string
    periodicity: string | null
    count_transaction: number | null
    snapshotted_at: string
    iva: boolean
    calculation: {
      calculation_type: string
      minimum_wage_amount: string | null
      count_salaries: number | null
      base_commission_amount: string | null
      fixed_value: string | null
      commission_percentage: string | null
      commission_transaction: string | null
      count_transaction: number | null
    }
  }
  relationships: {
    status: {
      id: number
      name: string
    } | null
    billing_trust: {
      id: number
      business_id: number
      code: string
      business_code_snapshot: string
      business_name_snapshot: string
      start_date: string
      end_date: string
      periodicity: string
    }
    accounting_parameters: {
      id: number
      billing_trusts_id: number
      who_pays: string
      accounts: boolean
      generates_iva: boolean
      is_accounting: boolean
      has_iva: boolean
      iva: string
      has_retefuente: boolean
      retefuente: string
      has_reteica: boolean
      reteica: string
      has_reteiva: boolean
      reteiva: string
      business_movement_code_snapshot: string | null
      business_movement_name_snapshot: string
      business_movement_id_snapshot: string
    }
    third_party_billing: {
      id: number
      third_party_id: number
      third_party_name: string
      third_party_document_type: string
      third_party_document: string
      third_party_email: string
      third_party_phone: string
      third_party_address: string
      status: {
        id: number
        name: string
      }
    }
    commission_type: {
      id: number
      code: string
      description: string
      commission_type_catalog_id: number
      commission_class_catalog_id: number
    }
    commission_type_catalog: {
      id: number
      name: string
    }
    commission_class_catalog: {
      id: number
      name: string
    }
    settlement_parameters?: null
    settlement_commissions: Array<{
      id: number
      business_trust_commissions_id: number
      base_amount: string
      iva_percentage: number
      iva_amount: string
      total_amount: string
      comission_settlement_statuses_id: number
      created_by: number
      updated_by: number | null
      created_at: string
      updated_at: string
      period_start: string
      period_end: string
      settled_at: string | null
      period_code: number
      retefuente_percentage: number
      retefuente_amount: number
      reteica_percentage: number
      reteica_amount: number
      reteiva_percentage: number
      reteiva_amount: number
      comission_settlement_statuses: {
        id: number
        name: string
        created_by: number | null
        created_at: string
        updated_at: string
      }
    }>
  }
  audit: {
    created_by: number
    updated_by: number
    created_at: string
    updated_at: string
  }
}

export interface IFiduciaryBusinessCommissionsListV2 {
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
  commission_class_catalog?: {
    name: string
  }
  billing_trusts?: {
    id: number
    code: string
  }
}

export interface IFiduciaryBusinessCommissionsFormV2 {
  business_id: number | null
  commission_type_id: number | null | string
  billing_trust_id: number | null
  billing_trust_label?: string | null
  third_party_billings_id: number | string | null
  accounting_parameters_id: number | null
  business_code?: number | string | null
  colllection: string | null
  observation: string | null
  description: string | null

  calculation_type: string | null
  minimum_wage_amount: number | null
  count_salaries: number | null
  base_commission_amount: number | null
  fixed_value: number | null
  commission_percentage: number | null
  commission_transaction: number | null | string
  business_trust_id: number | null | string
  business_trust?: string | null
  start_date: string | null
  commission_class_catalog_name?: string | null
  commission_type_catalog_name?: string | null

  periodicity?: string | null
  code_movement?: string | null
  start_date_period?: string | null
  end_date_period?: string | null
  generated_source?: string | boolean | null
  source_percentage?: number | null
  generated_ica?: string | boolean | null
  ica_percentage?: number | null
  generate_iva?: string | boolean | null
  iva?: number | null
  generated_network_iva?: string | boolean | null
  network_iva_percentage?: number | null
  count_transaction?: number | null
}

export interface IFiduciaryBusinessCommissionsToEditV2 {
  commission_type_catalog_id: number | null
  commission_class_catalog_id: number | null
  periodicity: string | null
  colllection: string | null
  iva: boolean | string | null
  observation?: string | null
  third_party_billings_id: number | null
}

export interface IFiduciaryBusinessCommissionsFileItem {
  id: number
  name: string
  total: number
  status: 'LOADING' | 'SUCCESS' | 'ERROR'
}

export interface IFiduciaryBusinessCommissionsFileResponse {
  success: boolean,
  message: string,
  data: {
    status: string
    error_file_url: string
    error_file_id: number
    error_filename: string,
  }
}

export interface IFiduciaryBusinessCommissionsFileResponseError {
  message: string
  success: boolean
  response: {
    data: IFiduciaryBusinessCommissionsFileResponse
  }
}
