import { IUploadedFile } from '@/interfaces/global/File'

export interface IRegisterConfigurationType {
  id?: number | null
  code?: string | null
  description?: string | null
  life_span?: number | null
  depreciation?: string | null
  asset_class?: string | null
}

export interface IRegisterBusinessTrust {
  id?: number | null
  business_code?: string | null
  name?: string | null
  start_date?: string | null
  end_date?: string | null
  has_extend?: boolean | null
  has_budget?: boolean | null
  status_id?: number | null
  business_type_id?: number | null
  business_subtype_id?: number | null
  business_mod?: string | null
  derivate_contracting?: boolean | null
  register_type?: string | null
  status_name?: string | null
  budget?: string | null
  account?: string | null
  accounts_payable?: string | null
}

export interface IRegisterAssetTransaction {
  id?: number | null
  transaction_type?: string | null
  business_trust_id?: number | null
  third_party_id?: number | null
  responsible_party_id?: number | null
  const_center_id?: number | null
  currency_id?: number | null
  configuration_type_id?: number | null
  configuration_subtype_id?: number | null
  transaction_date?: string | null
  transaction_value?: string | null
  purchase_order_number?: string | null
  asset_category?: string | null
  asset_tag_code?: string | null
  has_valoration?: boolean | null
  has_depreciation?: boolean | null
  has_visit?: boolean | null
  description?: string | null
  accounts_payable_status?: string | null
  created_at?: string | null
  updated_at?: string | null
  approval_status_id?: number | null
}

export interface IRegisterStatus {
  id?: number | null
  name?: string | null
}

export interface IRegisterAccount {
  id?: number | null
  business_trust_id?: number | null
  functional_business_currency?: string | null
}

export interface IRegisterItemList {
  id?: number | null
  record_type?: string | null
  reference: string | null
  configuration_type?: IRegisterConfigurationType | null
  configuration_subtype?: IRegisterConfigurationType | null
  created_at: string | null
  created_by_name?: string | null
  updated_at?: string | null
  updated_by_name?: string | null
  business_trust?: IRegisterBusinessTrust | null
  asset_transaction?: IRegisterAssetTransaction | null
  status?: IRegisterStatus | null
  fixed_asset_status?: string | null
  major_amount_uvt?: boolean | null
  minor_amount_uvt?: boolean | null
  register_status?: string | null
  responsible?: {
    id?: number | null
    commercial_registration?: string | null
    full_name?: string | null
    document?: string | null
  }
}

export interface IRegisterUge {
  id?: number | null
  business_trust_id?: number | null
  configuration_type_id?: number | null
  description?: string | null
  description_type?: string | null
  initial_value?: string | number | null
}

export interface IShowContrinutors {
  id?: number | null
  nit?: string | null
  description?: string | null
  percentage?: number | null
  distribution_type?: string | null
}

export interface IRegisterFilters {
  'filter[business_trust_register_id]': number
  'filter[configuration_type_id]': number
  'filter[configuration_subtype_id]': number
  'filter[record_type]': number
  'filter[register_status]': number
  'filter[start_date]': string
  'filter[end_date]': string
}

export interface IRegisterForm extends IRegisterItemList {
  major_amount_uvt?: boolean | null
  minor_amount_uvt?: boolean | null
  document_ids?: number[] | null
  configuration_type_id?: number | null
  purchase?: string | null
  asset_type?: string | null
  configuration_subtype_id?: number | null
  asset_subtype?: string | null
  business_trust_id?: number | null
  asset_transaction_id?: number | null
  business_trust_description?: string | null
  business_trust_code?: string | null // código sociedad
  chip_code?: string | null // número chip
  cadastral_id?: string | null // número catastral
  folio_number?: string | null // número de folio
  license_plate?: string | null // número de placa
  chassis_number?: string | null // número de chasis
  responsible_id?: number | null // responsable del activo
  responsible_document?: string | null // documento del responsable
  location_id?: number | null // dirección del activo
  status_id?: string | number | null // estado del activo
  guarantee_percentage?: string | number | null // porcentaje de garantia
  purchase_value?: number | null // valor del activo
  pruchase_currency?: string // moneda
  accounting_currency?: string // moneda
  property_tax_date?: string | null // fecha de predial
  cash_generating_unit_id?: number | null // uge
  measurement_model?: string | null // modelo de medición
  asset_contributors?: IAssetContributor[] // Aportantes del bien
  contributors?: IShowContrinutors[]
  asset_documents?: IDocumentsRegister[]
  asset_accounting?: IAccountingInformation
  novelty_history?: INoveltyHistory[]
  depreciation_history?: IDepreciationHistory[]
  address_history?: IAddressHistory[]
  uge?: IRegisterUge
  society?: string | null
  account?: IRegisterAccount
  transaction_value?: string | null
  value?: string | null // valor activo fijo o bien (transferencia/donación)
  countable_value?: string | null // valor contable activo fijo o bien (transferencia/donación)
  location?: IRegisterLocation | null
  transaction?: IRegisterAssetTransaction | null
}

export interface IAssetContributor {
  id?: number | null
  nit: string | null // NIT (10 dígitos, mín 7)
  description: string | null // Descripción (300 max, 10 min)
  guarantee_percentage: number | null // Porcentaje (3 enteros, 2 decimales)
  distribution_type: string | null // Tipo de distribución
}

export interface IDocumentsRegister {
  id?: number | null
  documentable_id?: number | null
  name?: string | null
  model_name?: string | null
  document_type?: string | null
  file_size?: number | null
  document_id?: number | null
  upload_url?: string | null
  file_path?: string
  is_new?: boolean
  size?: number | null
  url?: string | null
  original_name?: string
  is_validated?: boolean
  created_at?: string
  file?: File | IUploadedFile
}

export interface IEntryInfomation {
  record_type?: string | null
  third_party_name?: string | null
  transaction_value?: string | null
  purchase_order_number?: string | null
  asset_type?: string | null
  asset_subtype?: string | null
  transaction_date?: string | null
  license_plate?: string | null
}

export interface IAccountingInformation {
  accounting: {
    transaction_value?: string | null
    license_plate?: string | null
    books_value?: string | null
    depreciation_rate?: string | null
  }
  depreciation?: {
    useful_life_in_years?: number | string | null
    annual_depreciation?: number | string | null
    useful_life_depreciation?: number | string | null
    accumulated_depreciation?: number | string | null
  }
  impairment?: {
    impairment_value?: number | string | null
    impairment_residual_value?: number | string | null
  }
}

export interface INoveltyHistory {
  id?: number | null
  novelty_code?: string | null
  novelty_description?: string | null
  novelty_associated?: string | null
  novelty_type?: string | null
  novelty_date?: string | null
  novelty_value?: string | null
  novelty_status?: string | null
}

export interface IDepreciationHistory {
  id?: number | null
  asset_type?: string | null
  asset_subtype?: string | null
  business_depreciation?: string | null
  period?: string | null
  depreciation_value?: string | null
}

export interface IAddressHistory {
  id?: number | null
  third_party_name?: string | null
  new_third_party_name?: string | null
  created_by?: string | null
  history_value?: string | null
  first_address?: string | null
  address?: string | null
}

export interface IRegisterFileValidation {
  name: string
  status_id: number | null
  size?: number | null
  has_errors: boolean
  id: string | null
  batch_id: string | null
  validated_rows: IRegisterForm[]
}

export interface IRegisterLocation {
  location_type_id: number | null
  location_parent_id: number | null
  country_code: string | null
  department_code: string | null
  city_code: string | null
  address: string | null
  status_id: number | null
}

export interface IRegisterResponse extends IRegisterForm {
  documents: IDocumentsRegister[]
  created_by: {
    id: number | null
    name: string | null
    email: string | null
  } | null
  updated_by: {
    id: number | null
    name: string | null
    email: string | null
  } | null
}

export interface IAmountUvtValue {
  value: string
  minor_amount: number
  major_amount: number
}
