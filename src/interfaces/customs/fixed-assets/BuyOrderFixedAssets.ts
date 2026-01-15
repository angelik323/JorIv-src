// filters list
export interface IBuyOrderFixedAssetsFilters {
  'filter[purchase_order_number]': string
  'filter[business_trust]': string
  'filter[third_party]': string
  'filter[authorization_status_id]': string
  'filter[start_date]': string
  'filter[end_date]': string
}

// List
export interface IBuyOrderFixedAssetsList {
  id: number
  authorization_status_id: number
  total_value: string
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
  created_by_user: IBuyOrderFixedAssetsUser
  updated_by_user: IBuyOrderFixedAssetsUser
  items: IBuyOrderFixedAssetsItem[]
}

// User
export interface IBuyOrderFixedAssetsUser {
  id: number
  full_name: string
}

// Item
export interface IBuyOrderFixedAssetsItem {
  id: number
  business_trust_id: number
  business_trust: IBuyOrderFixedAssetsBusinessTrust
  third_party_id: number
  third_party: IBuyOrderFixedAssetsThirdParty
  quantity: number
  value: string
  detail: string
  configuration_type_id: number
  configuration_type: IBuyOrderFixedAssetsConfigurationType
  configuration_subtype_id: number
  configuration_subtype: IBuyOrderFixedAssetsConfigurationSubtype
}

// Business Trust
export interface IBuyOrderFixedAssetsBusinessTrust {
  id: number
  business_code: string
  name: string
  start_date: string
  end_date: string
  has_extend: boolean
  has_budget: boolean
  status_id: number
  business_type_id: number
  business_subtype_id: number
  business_mod: string
  derivate_contracting: boolean
  status_name: string
  status: IBuyOrderFixedAssetsStatus
  document_type: unknown[]
  budget: unknown | null
  account: unknown | null
  accounts_payable: unknown | null
}

// Status
export interface IBuyOrderFixedAssetsStatus {
  id: number
  status: string
}

// Third Party
export interface IBuyOrderFixedAssetsThirdParty {
  id: number
  document: string
}

// Configuration Type
export interface IBuyOrderFixedAssetsConfigurationType {
  id: number
  code: string
  type: string
  description: string
  asset_class: string
  created_at: string
  created_by: number | null
  updated_at: string | null
  updated_by: number | null
}

// Configuration Subtype
export interface IBuyOrderFixedAssetsConfigurationSubtype {
  id: number
  code: string
  description: string
  life_span: number
  depreciation: string
}

// Response
export interface IBuyOrderFixedAssetsListResponse {
  success: boolean
  data: IBuyOrderFixedAssetsList[]
  message: string
}

export interface IBuyOrderFixedAssetsResponse {
  success: boolean
  data: IBuyOrderFixedAssetsList
  message: string
}

// Request Item
export interface IBuyOrderFixedAssetsItemRequest {
  quantity: number
  configuration_type_id: number
  configuration_subtype_id: number
  value: number
  detail: string
  business_trust_id: number
  third_party_id: number
}

// Request Create
export interface IBuyOrderFixedAssetsCreateRequest {
  items: IBuyOrderFixedAssetsItemRequest[]
}

// Request Update
export interface IBuyOrderFixedAssetsUpdateRequest {
  id: number
  items: IBuyOrderFixedAssetsItemRequest[]
}

// simple data
export interface IBuyOrderFixedAssetsSimpleData {
  id: number
  authorization_status_id: number
  total_value: string
  created_at: string
  updated_at: string
  created_by: number
  updated_by: number
  created_by_user: IBuyOrderFixedAssetsUser
  updated_by_user: IBuyOrderFixedAssetsUser
}

// Response delete/autorize
export interface IBuyOrderFixedAssetsSimpleResponse {
  success: boolean
  data: IBuyOrderFixedAssetsSimpleData
  message: string
}

// Form Item
export interface IBuyOrderFixedAssetsItemForm {
  _uid: number
  business_trust_id: number | null
  business_trust_label?: string
  third_party_id: number | null
  third_party_label?: string
  quantity: number | null
  configuration_type_id: number | null
  configuration_type_label?: string
  configuration_subtype_id: number | null
  configuration_subtype_label?: string
  value: number | null
  detail: string | null
}

// Principal Form
export interface IBuyOrderFixedAssetsForm {
  items: IBuyOrderFixedAssetsItemForm[]
}
