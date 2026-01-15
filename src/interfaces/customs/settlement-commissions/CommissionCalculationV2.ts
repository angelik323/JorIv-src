import Big from 'big.js'
import { IFiduciaryBusinessCommissionsFormV2 } from './FiduciaryBusinessCommissionsV2'

export type NumberStringBig = number | string | Big

export type NullableStringNumber = string | number | null

export interface ICommissionCalculationListV2 {
  id: number
  period: string
  base_calculation?: NullableStringNumber
  base_value?: NullableStringNumber
  commission_percentage?: number | null
  commission_value: number | string
  total_value: number
  commission_transaction?: NullableStringNumber
  count_salaries?: number | null
  period_start: string
  period_end: string
  business_trust_commissions: {
    business_code_snapshot: string
    business_name_snapshot: string
    billing_trust: {
      periodicity: string
    }
    type_commission: {
      code: string
      description: string
    }
    periodicity: string
    business_start_date_snapshot: string
  }
}

export interface ICommissionCalculationFormV2
  extends IFiduciaryBusinessCommissionsFormV2 {
  business_trust_commission_id: NullableStringNumber
  commission_class_catalog_id?: number | null
  commission_type_catalog_id?: number | null

  business_trust_commission?: string | null
  third_party_billings?: string | null
  commissions?: ICommissionCalculationCommissionListV2[]
  billing_trust?: string | null

  lines?: ICommissionCalculationManualBaseAmountV2[]
}

export interface ICommissionCalculationManualBaseAmountV2 {
  id: number
  base_amount: NullableStringNumber
}

export interface ICommissionCalculationCommissionListV2 {
  id: number
  period?: string
  calculation_base: NullableStringNumber
  commission_percentage: number | null
  commission_value: NumberStringBig
  iva_percentage: number
  iva_amount: NumberStringBig
  retefuente_percentage: number
  retefuente_amount: NumberStringBig
  reteica_percentage: number
  reteica_amount: NumberStringBig
  reteiva_percentage: number
  reteiva_amount: NumberStringBig
  total_amount: NumberStringBig
  transaction_commission: NullableStringNumber
  count_transaction: number | null
  count_salaries?: number | null

  period_start: string
  period_end: string
  base_amount: string | number
}

export interface ICommissionCalculationResponseV2 {
  business_trust_commission: {
    id: number
    business_id: number
    billing_trust_id: number | null
    third_party_billings_id: number | null
    commission_type_id: number
    commission_type_catalog_id: number
    commission_class_catalog_id: number
    settlement_parameters_id: number
    comission_settlement_statuses_id: number
    business_code_snapshot: string
    business_name_snapshot: string
    business_start_date_snapshot: string
    business_end_date_snapshot: string
    business_status_snapshot: number
    description: string | null
    observation: string | null
    collection: string
    periodicity: string
    count_transaction: number | null
    snapshotted_at: string
    iva: boolean
    calculation: {
      calculation_type: string | null
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
    billing_trust: {
      id: number
      business_id: number
      code: string
      business_code_snapshot: string
      business_name_snapshot: string
      start_date: string
      end_date: string
      periodicity: string
    } | null
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
      business_movement_code_snapshot: string
      business_movement_name_snapshot: string
      business_movement_id_snapshot: string
    } | null
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
    } | null
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
    settlement_commissions: Array<{
      id: number
      business_trust_commissions_id: number
      base_amount: string
      iva_percentage: number
      iva_amount: string
      total_amount: string
      comission_settlement_statuses_id: number
      created_by: number | null
      updated_by: number | null
      created_at: string
      updated_at: string
      period_start: string | null
      period_end: string | null
      settled_at: string | null
      period_code: number | null
      retefuente_percentage: number
      retefuente_amount: number
      reteica_percentage: number
      reteica_amount: number
      reteiva_percentage: number
      reteiva_amount: number
      commission_percentage: number | null
      transaction_commission: number | null
      count_transaction: number | null
      comission_settlement_statuses: {
        id: number
        name: string
        created_by: number | null
        created_at: string
        updated_at: string
      } | null
    }>
  }
  audit: {
    created_by: number
    updated_by: number
    created_at: string
    updated_at: string
  }
}

export enum PERIODICITY {
  SINGLE = 'Único pago',
  DAILY = 'Diario',
  BIWEEKLY = 'Quincenal',
  MONTHLY = 'Mensual',
  BIMONTHLY = 'Bimestral',
  QUARTERLY = 'Trimestral',
  SEMIANNUAL = 'Semestral',
  ANNUAL = 'Anual',
}

export const EXCLUDED_CLASS_IDS = [1, 3]
export const EXCLUDED_CALCULATION_TYPES = ['manual', 'valor por transacción']
