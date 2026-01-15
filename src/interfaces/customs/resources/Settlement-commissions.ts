import { IResource } from '@/interfaces/global'
import { IGenericResource } from './Common'

export interface ITypeCommisionsResource extends IResource {
  commission_class_catalog_id: number | null
  commission_type_catalog_id: number | null
  commission_type_catalog?: {
    id: number
    name: string
  }
  commission_class_catalog?: {
    id: number
    name: string
  }
}

export interface IBillingThirdParty extends IGenericResource {
  third_party_document_type: string
  third_party_document: string
  third_party_name: string
  third_party_address: string
  third_party_phone: string
  third_party_email: string
}

export interface IBillingTrustByBusinessCodeResource extends IGenericResource {
  code: string
  periodicity: string
  start_date: string
  end_date: string
}

export interface IMovementCodesAccountingParametersResource
  extends IGenericResource {
  business_movement_name_snapshot: string
  business_movement_id_snapshot: string
  business_movement_code_snapshot: string
}

export interface ICommissionsType extends IGenericResource {
  commission_class_catalog_id: number
  commission_class_catalog: {
    id: number
    name: string
  }
  commission_type_catalog_id: number
  commission_type_catalog: {
    id: number
    name: string
  }
  description: string
}

export interface IBillingTrust {
  id: number
  business_id: number
  business_code_snapshot: string
  business_name_snapshot: string
  snapshotted_at: string
  start_date: string
  end_date: string
  periodicity: string
  other: string | null
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  code: string
}

export interface IAccountingParameter {
  id: number
  business_id: number
  billing_trusts_id: number
  business_movement_code_snapshot: string
  business_movement_name_snapshot: string
  business_movement_id_snapshot: string
  who_pays: string
  accounts: boolean
  generates_iva: boolean
  iva: string
  is_accounting: boolean
  has_iva: boolean
  has_retefuente: boolean
  has_reteica: boolean
  has_reteiva: boolean
  retefuente: string
  reteica: string
  reteiva: string
  billing_trust: IBillingTrust
}

export interface IAccountingParameterOption extends IAccountingParameter {
  label: string
  value: string | number
}

export interface IBusinessTrustsCommissionsWithBusiness
  extends IGenericResource {
  business_code: string
  business_id: number
  business_name: string
  commissions: ICommisionsBusinessTrusts[]
}

export interface ICommisionsBusinessTrusts {
  business_trust_commissions_id: number
  code: string
  name: string
  start_date: string
}

export interface ICalculationBase {
  label: string
  value: string
}
