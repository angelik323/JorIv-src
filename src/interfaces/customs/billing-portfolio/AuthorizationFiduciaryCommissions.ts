import { ActionType } from '@/interfaces/global'

export interface IAuthorizationFiduciaryCommission {
  id: number
  business_id: number
  business_code_snapshot: string
  business_name_snapshot: string
  business_start_date_snapshot: string
  business_end_date_snapshot: string
  business_status_snapshot: string
  snapshotted_at: string
  business_trust_commissions_id: number
  settlement_commissions_id: number
  commission_type_id: number
  commission_type_catalog: string
  commission_class_catalog: string
  periodicity: string
  iva: boolean
  observation: string | null
  comission_settlement_statuses_id: number
  base_amount: string
  iva_percentage: number | null
  iva_amount: string | null
  total_amount: string
  settlement_date: string
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  authorization_date: string | null
  collection: 'Vencido' | 'Anticipado' | null
  third_party_billings_id: number | null
  status: {
    id: number
    name: string
    created_by: number | null
    created_at: string
    updated_at: string
  }
  cancellation_date?: string
  cancellation_reason?: string
}

export type IAuthorizationFiduciaryCommissionForm = Pick<
  IAuthorizationFiduciaryCommission,
  | 'business_id'
  | 'business_code_snapshot'
  | 'business_name_snapshot'
  | 'commission_class_catalog'
  | 'commission_type_catalog'
  | 'periodicity'
  | 'collection'
  | 'status'
  | 'settlement_date'
  | 'base_amount'
  | 'iva_amount'
  | 'total_amount'
  | 'cancellation_date'
  | 'cancellation_reason'
  | 'observation'
>

export interface IAuthorizationFiduciaryCommissionsFilters {
  'filter[commission_class_catalog]': string
  'filter[commission_type_catalog]': string
  'filter[periodicity]': string
  'filter[comission_settlement_statuses_id]': number
  'filter[collection]': string
  'filter[search]': string
}

export interface IAuthorizationFiduciaryCommissionsFormProps {
  action: ActionType
  data?: IAuthorizationFiduciaryCommission | null
}
