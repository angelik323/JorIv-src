// types
export type TransactionType = 'buy' | 'sell'
export type AssetCategoryType = 'Activo Fijo' | 'Bien' | null

// list interface

export interface IBuySaleConfigurationType {
  id: number
  code: string | number
  description: string
  life_span?: number | null
}

export interface IBuySaleConfigurationSubtype {
  id: number
  type_id?: number
  code: string
  description: string
  life_span?: number
  depreciation?: string
}

export interface IBuySaleBusinessTrustStatus {
  id: number
  status: string
}

export interface IBuySaleBusinessTrustBudget {
  id: number
  business_trust_id: number
  validity: number
}

export interface IBuySaleBusinessTrustAccount {
  id: number
  business_trust_id: number
  functional_business_currency: string
  identification_tax: string
  accounting_structure_id: number | null
}

export interface IBuySaleBusinessTrustAccountsPayable {
  id: number
  business_trust_id: number
  account_structure_id: number
}

export interface IBuySaleBusinessTrust {
  id: number
  business_code: string
  name: string
  start_date: string
  end_date: string | null
  has_extend: boolean
  has_budget: boolean
  status_id: number
  business_type_id: number
  business_subtype_id: number
  business_mod: string | null
  derivate_contracting: boolean
  register_type?: string | null
  status_name: string
  status: IBuySaleBusinessTrustStatus
  document_type: unknown[]
  budget: IBuySaleBusinessTrustBudget | null
  account: IBuySaleBusinessTrustAccount | null
  accounts_payable: IBuySaleBusinessTrustAccountsPayable | null
}

// asset transaction interface
export interface IBuySaleAssetTransaction {
  id: number
  transaction_type: string
  business_trust_id: number
  third_party_id: number
  responsible_party_id: number | null
  cost_center_id: number
  currency_id: number
  configuration_type_id: number
  configuration_subtype_id: number
  transaction_date: string
  transaction_value: string
  asset_category: string
  asset_tag_code: string | null
  has_valoration: boolean
  has_depreciation: boolean
  has_visit: boolean
  purchase_order_id: string | null
  description: string | null
  accounts_payable_status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  approval_status_id: number
}

export interface IBuySaleResponsible {
  id: number
  document: string
}

export interface IBuySaleStatus {
  id: number
  name: string
}

export interface IBuySaleUge {
  id: number
  business_trust_id: number
  configuration_type_id: number
  description: string
  description_type: string
  cash_flow_generation_date: string
  initial_value: string
  status_id: number
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface IBuySaleUser {
  id: number
  name: string
  email: string
}

export interface IBuySaleThirdParty {
  id: number
  document: string
  name: string
}

export interface IBuySaleApprovalStatus {
  id: number
  status: string
}

export interface IBuySaleCurrency {
  id: number
  code: string
  description: string
}

export interface IBuySaleFixedAssetsList {
  id: number
  transaction_type: string
  transaction_code: string | null
  transaction_date: string
  transaction_value: string
  asset_category: string
  business_trust_id: number
  business_trust: IBuySaleBusinessTrust
  third_party_id: number
  third_party: IBuySaleThirdParty | null
  responsible_party_id: number | null
  responsible_party: unknown | null
  currency_id: number
  currency: IBuySaleCurrency[]
  cost_center_id: number
  configuration_type_id: number
  configuration_type: IBuySaleConfigurationType
  configuration_subtype_id: number
  configuration_subtype: IBuySaleConfigurationSubtype
  approval_status_id: number
  approval_status: IBuySaleApprovalStatus
  accounting_status: string | null
  has_valoration: boolean
  has_depreciation: boolean
  has_visit: boolean
  created_at: string
  updated_at: string
  approval_responsible_id: number | null
  approved_at: string | null
}

// response interface

export interface IBuySaleFixedAssetsListResponse {
  success: boolean
  data: IBuySaleFixedAssetsList[]
  message: string
}

// form interface

// base form interface
export interface IBuySaleFixedAssetsFormBase {
  id_fixed_asset_property?: number | null
  transaction_type: string | null
  business_trust_id: number | null
  configuration_type_id: number | null
  configuration_subtype_id: number | null
  asset_category: string | null
  purchase_order_id: string | null
  has_valoration: boolean
  transaction_date: string | null
  transaction_value: number | null
  third_party_id: number | null
  currency_id: number | null
  cost_center_id: number | null
}

// buy form interface
export interface IBuyFixedAssetsForm extends IBuySaleFixedAssetsFormBase {}

// Formulario para venta
export interface ISaleFixedAssetsForm extends IBuySaleFixedAssetsFormBase {}

// request interface
export interface IBuySaleFixedAssetsCreateRequest {
  transaction_type: string
  business_trust_id: number
  configuration_type_id: number
  configuration_subtype_id: number
  asset_category: string
  purchase_order_id: string | null
  has_valoration: boolean
  transaction_date: string
  transaction_value: number
  third_party_id: number
  currency_id: number
  cost_center_id: number
}

// buy request interface
export interface IBuyFixedAssetsCreateRequest extends IBuySaleFixedAssetsCreateRequest {
  purchase_order_id: string
}

// sale request interface
export interface ISaleFixedAssetsCreateRequest extends IBuySaleFixedAssetsCreateRequest {}

// update request interface
export interface IBuySaleFixedAssetsUpdateRequest extends IBuySaleFixedAssetsCreateRequest {}

// response interface

// transaction response interface

export interface IBuySaleTransactionUser {
  id: number
  full_name: string
  name: string
  email: string
}

export interface IBuySaleTransactionData {
  id: number
  id_fixed_asset_property?: number | null
  purchase_order_id: string | null
  asset_tag_code: string | null
  description: string | null
  transaction_type: string
  transaction_code: string | null
  transaction_date: string
  transaction_value: string
  asset_category: string
  business_trust_id: number
  business_trust: IBuySaleBusinessTrust
  third_party_id: number
  third_party: IBuySaleThirdParty | null
  responsible_party_id: number | null
  responsible_party: IBuySaleThirdParty | null
  currency_id: number
  currency: IBuySaleCurrency[]
  cost_center_id: number | null
  configuration_type_id: number
  configuration_type: IBuySaleConfigurationType
  configuration_subtype_id: number
  configuration_subtype: IBuySaleConfigurationSubtype
  approval_status_id: number
  approval_status: IBuySaleApprovalStatus | null
  accounting_status: string | null
  has_valoration: boolean | null
  has_depreciation: boolean | null
  has_visit: boolean | null
  created_at: string
  created_by: string | null
  created_by_user: IBuySaleTransactionUser | null
  updated_at: string
  updated_by: string | null
  updated_by_user: IBuySaleTransactionUser | null
  approval_responsible_id: number | null
  approved_at: string | null
  approved_by: string | null
  approved_by_user: IBuySaleTransactionUser | null
  approval_responsible: IBuySaleTransactionUser | null
  documents?: IBuySaleTransactionDocument[]
}

export interface IBuySaleFixedAssetsResponse {
  success: boolean
  data: IBuySaleTransactionData
  message: string
}

export interface IBuySaleFixedAssetsSimpleResponse {
  success: boolean
  data: {
    id: number
  }
  message: string
}

// documents interface

export interface IFixedAssetDocumentRequest {
  name: string
  model_name: 'FIXED_ASSET'
  document_type: string
  file_size: number
}

export interface IFixedAssetDocumentModelConfig {
  min_documents: number
  max_documents: number
  max_file_size: number
  max_file_size_formatted: string
  allowed_types: string[]
}

export interface IFixedAssetDocumentPresignedResponse {
  document_id: number
  upload_url: string
  file_path: string
  expires_in: string
  model_config: IFixedAssetDocumentModelConfig
}

export interface IFixedAssetPresignedUrlResponse {
  success: boolean
  data: IFixedAssetDocumentPresignedResponse[]
  message: string
}

export interface IFixedAssetDocumentFile {
  id: string
  name: string
  file: File
  document_type: string
  file_size: number
}

export interface IFixedAssetUploadedDocument {
  id: string
  document_id: number
  name: string
  file_path: string
  upload_url: string
  uploaded: boolean
}

export interface IBuySaleTransactionDocument {
  id: number
  documentable_type: string
  documentable_id: number
  file_path: string
  hash_name: string
  original_name: string
  document_type: string
  file_size: number
  is_validated: boolean
  validation_status_id: number | null
  validation_notes: string | null
  created_by_id: number | null
  updated_by_id: number | null
  uploaded_by_id: number | null
  validated_by_id: number | null
  validated_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
export interface IFixedAssetDocumentRow {
  id: string | number
  name: string
  isNew: boolean
  uploaded?: boolean
  raw: IFixedAssetDocumentFile | IFixedAssetUploadedDocument
  actions?: string
}

export interface IDocumentsBuySale {
  id?: number | null
  name?: string | null
  document_type?: string | null
  file_size?: number | null
  size?: number | null
  url?: string | null
  file?: File
}

// import interface
export interface IBuySaleValidatedRow {
  id: number
  row_number?: number

  transaction_type?: string
  asset_category?: string
  transaction_date: string | null
  transaction_value: number | null
  description?: string | null
  asset_tag_code?: string | null

  has_valoration: boolean
  has_depreciation: boolean
  has_visit: boolean

  business_trust_id: number | null
  business_trust_code?: string
  business_trust_description?: string

  third_party_id: number | null
  third_party_document?: string
  third_party_name?: string

  responsible_party_id?: number | null
  responsible_party_document?: string
  responsible_party_name?: string

  currency_id: number | null
  currency_code?: string

  cost_center_id: number | null
  cost_center_code?: string
  cost_center_description?: string

  configuration_type_id: number | null
  configuration_type_code?: string
  configuration_type_description?: string

  configuration_subtype_id: number | null
  configuration_subtype_code?: string
  configuration_subtype_description?: string

  document_ids?: number[]
  uploaded_documents?: IUploadedDocumentMeta[]
}

export interface IUploadedDocumentMeta {
  id: number
  name: string
}

export interface IBuySaleBulkCreateRecord {
  id: number
  document_ids: number[]
}

export interface IBuySaleBulkCreateRequest {
  records: IBuySaleBulkCreateRecord[]
  purchase_order_id?: number | string
}

export interface IBuySaleFileValidation {
  name: string
  status_id: number | null
  size?: number
  has_errors: boolean
  id: string | null
  batch_id: string
  validated_rows: IBuySaleValidatedRow[]
}

export interface IBuySaleFileTableRecord {
  id?: number
  is_new?: boolean
  name: string
  status_id?: number
  url: string
  size?: number
  created_at?: string
  type?: string
  file?: File
}
