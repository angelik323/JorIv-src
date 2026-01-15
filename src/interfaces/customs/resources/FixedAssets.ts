import { ISelectorResources } from '@/interfaces/customs/Filters'

export interface IFixedAssetResource extends ISelectorResources {
  subtypes: ISelectorResources[]
  asset_class?: string
  transaction_code?: string | number | null
  transaction_value?: string | number | null
  folio_number?: string
  has_depreciation?: boolean | null
  asset_transaction?: {
    transaction_value?: string | number
  }
  generates_accounting?: boolean
  affectation_type?: 'Inicio' | 'Novedad' | 'Retiro'
}

export interface IConfigurationType {
  business_trust_id: number
  business_info: string
  configuration_types: IConfigurationTypeItem[]
  value?: number
  label?: string
}

export interface IConfigurationTypeItem {
  type_id: number
  type_info: string
  subtypes: ISubtypeItem[]
}

export interface ISubtypeItem {
  subtype_id: number
  subtype_info: string
}
export interface ISubtype {
  id: number
  type_id: number
  code: string
  description: string
  life_span: number
  depreciation: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  created_by?: number | null
  updated_by?: number | null
  deleted_by?: number | null
}
export interface IStatusUge extends ISelectorResources {
  id: number
  status: string
}

export interface IBusinessTrustType {
  business_trust_id: number
  type_id: number
  type_info: string
  subtypes: ISubtypeItem[]
  value: number
  label: string
}

export interface IBusinessTrustSubtype {
  business_trust_id: number
  type_id: number
  subtype_id: number
  subtype_info: string
  value: number
  label: string
}

export interface IBusinessAsset {
  id: number
  reference: string
  cash_generating_unit: {
    initial_value: number
  }
  asset_transaction: {
    transaction_value: number
  }
}

export interface IFilterImparment {
  id: number | string | null
  label: number | string | null
  raw: string | null
}
export interface IFixedAssetLocationsResource extends ISelectorResources {
  address: string
}

export interface IResponsibleResource {
  responsible_id: number
  responsible: {
    document: string | null
    legal_person: {
      business_name: string | null
    } | null
  } | null
}

export interface IResponsibleOption {
  id: number
  value: number
  document: string
  business_name: string
  label: string
}
export interface IFixedAssetForSaleResource extends ISelectorResources {
  reference: string
  asset_transaction_id: number
  folio_number: string
  license_plate: string
  business_trust_id: number
  configuration_type_id: number
  configuration_subtype_id: number
  asset_transaction: IAssetTransactionResource
  configuration_type: ISelectorResources
  configuration_subtype: ISelectorResources
}

interface IAssetTransactionResource extends ISelectorResources {
  transaction_type: string
  cost_center_id: number
  business_trust_id: number
  currency_id: string
  asset_tag_code: string
  purchase_order_id: string
  third_party_id: number
  responsible_party_id: number
}
export interface IFixedAssetConfigurationSubtypeResource
  extends ISelectorResources {
  fixed_asset_code: number
  type_description: string
  label: string
}

export interface IConfigurationType {
  business_trust_id: number
  business_info: string
  configuration_types: IConfigurationTypeItem[]
  value?: number
  label?: string
}

export interface IConfigurationTypeItem {
  type_id: number
  type_info: string
  subtypes: ISubtypeItem[]
}

export interface ISubtypeItem {
  subtype_id: number
  subtype_info: string
}
export interface ISubtype {
  id: number
  type_id: number
  code: string
  description: string
  life_span: number
  depreciation: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  created_by?: number | null
  updated_by?: number | null
  deleted_by?: number | null
}
export interface IStatusUge extends ISelectorResources {
  id: number
  status: string
}

export interface IBusinessTrustType {
  business_trust_id: number
  type_id: number
  type_info: string
  subtypes: ISubtypeItem[]
  value: number
  label: string
}

export interface IBusinessTrustSubtype {
  business_trust_id: number
  type_id: number
  subtype_id: number
  subtype_info: string
  value: number
  label: string
}

export interface IBusinessAsset {
  id: number
  reference: string
  cash_generating_unit: {
    initial_value: number
  }
  asset_transaction: {
    transaction_value: number
  }
}

export interface IFilterImparment {
  id: number | string | null
  label: number | string | null
  raw: string | null
}
