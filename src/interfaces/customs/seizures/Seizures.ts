export interface DocumentTypeItem {
  id?: number
  name?: string
  [key: string]: string | number | boolean | null | undefined
}

export interface Budget {
  [key: string]: string | number | boolean | null | undefined
}

export interface ThirdPartyStatus {
  id?: number
  status?: string
}

export interface ThirdPartyEditObject {
  id: number
  document: string
  third_party_category?: string
  commercial_registration?: string | null
  status?: {
    id?: number
    status?: string
  } | null
  natural_person?: {
    full_name?: string | null
  } | null
  legal_person?: {
    business_name?: string | null
  } | null

  label: string
  value: number
  name: string
}

export interface BusinessTrustEditObject {
  id: number
  business_code?: string
  name: string
  status?: {
    id: number
    status: string
  }

  label: string
  value: number
}

export interface ISeizureAttachment {
  id: number
  name: string
  original_name: string
  s3_url_path: string
}

export interface ISeizuresDetail {
  id?: number | null
  order_number: string
  court_id: number | null
  court_name?: string
  value_seizure: number | null
  claimant_id: number | null
  type_defendant_id: number | null
  type_defendant?: {
    id: number
    name: string
  } | null
  has_assigned_business: boolean | null
  business_trusts_id: number | null

  order_date: string
  awareness_date: string
  active_seizure_total: number | null
  management_area_id: number | null
  process_type_id: number | null
  process_type?: {
    id: number
    name: string
  } | null

  value_paid: number | null
  city_id: number | null

  assets: ISeizuresAssetItem[]
  seizure_date: string

  claimant_name?: string
  claimant?: ThirdPartyObject[] | null
  defendant?: BusinessTrust | null

  city?: {
    cities: CityObject[]
  } | null
  business_trust?: BusinessTrust | null

  process_number: string
  embargo_date: string

  plaintiff_id: string
  plaintiff_name: string
  defendant_id: string
  defendant_name: string

  embargo_value: number
  origin: 'Core' | 'Orion'
  status?: {
    id: number
    status: string
  }
  management_area: string
  attachment_id?: number | null
  attachment?: ISeizureAttachment | null
  observations?: string
  management_history?: ISeizureManagementHistory[]
  procedures?: ISeizureProcedure[]
}

export interface ISeizuresCreateIndividualPayload {
  process_number: string
  embargo_date: string
  plaintiff_id: string
  defendant_id: string
  embargo_value: number
  management_area: string
  observations?: string
}

export interface ISeizuresCreateMassivePayload {
  items: ISeizuresCreateIndividualPayload[]
}

export interface ISeizuresUpdatePayload {
  process_number?: string
  embargo_date?: string
  plaintiff_id?: string
  defendant_id?: string
  embargo_value?: number
  management_area?: string
  status?: string
  observations?: string
}

export interface ISeizuresAssetItem {
  id?: number
  seizure_assets_products_type_id: number | null
  description: string
  asset_value: number
  asset_type_id: number
  assetable_type: string
  assetable_id: number
  seizure_date?: string
  bank_name?: string
  product_type?: number
  folio?: string
  type_of_asset?: string | number
  active_fixed_id?: object | null
  product_id?: number
}
export type SeizureDocument = File | ISeizureAttachment | null

export interface ISeizuresCreateForm {
  process_number: string
  order_number: string
  court_id: number | null
  claimant_id: number | null
  claimant_object?: ThirdPartyObject | null
  type_defendant_id: number | null
  defendant_id: number | null
  defendant_object?: DefendantFormObject | null
  business_trusts_id: number | null
  business_trusts_object?: BusinessTrust | null
  order_date: string
  awareness_date: string
  seizure_date: string
  value_seizure: number | null
  active_seizure_total: number | null
  city_id: number | null
  city_object?: CityObject | null
  management_area_id: number | null
  process_type_id: number | null
  observations: string
  value_paid: number
  assets: ISeizedAssetsList[]
  status_id?: number | null
  status_name?: string | null
  has_assigned_business: boolean | null
  document?: SeizureDocument
}

export interface ISeizuresList {
  id: number
  process_number: string
  order_number: string
  seizure_date: string
  claimant_id: number
  claimant: Person
  defendant_id: number
  defendant: Person
  value_seizure: number
  status: Status | null
  origin: string
}

interface Person {
  id: number
  document: string
  natural_person: INaturalPerson | null
  legal_person: ILegalPerson | null
}

interface INaturalPerson {
  id: number
  name: string
  middle_name: string
  last_name: string
  second_last_name: string
  birth_date: string | null
  issue_date: string | null
  third_party_id: number | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  occupation_id: number | null
  sending_correspondence: string | null
  birth_country_id: number | null
  document_issuance_country_id: number | null
  applicant_type: string | null
  location_country_id: number | null
  full_name: string | null
}

export interface ILegalPerson {
  id: number
  third_party_id: number
  business_name: string
  trade_name: string | null
  country_id: number
  applicant_type: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  acronym: string | null
  entity_type_id: number | null
  constitution_date: string | null
  nature: string
  entity_type: string | null
  has_board_of_directors_or_advisory_board: boolean | null
  classification_company: string | null
  sending_correspondence: string | null
  department_id: number | null
  city_id: number | null
  third_party: ThirdParty
}

interface ThirdParty {
  id: number
  created_by: number
  document_type_id: number
  status_id: number
  third_party_category: string
  document: string
  commercial_registration: string | null
  validator_digit: string
  created_at: string
  updated_at: string
  observations: string | null
  updated_by: number
  is_customer: boolean
  third_party_type: string
  birth_date: string | null
  issue_date: string | null
  fiscal_responsibility: string
  vat_responsibility: string
  identity_type_id: number | null
  business_trust_id: number | null
  support_document_numbering_issuer_delegate_id: number | null
  support_document_numbering_issuer_status_id: number
  is_fideicomiso: boolean
}

export interface Status {
  id: number
  status: string
}

export interface DefendantFormObject {
  id: number
  value: number
  label: string
  name: string
  document?: string
  business_code?: string
}

export interface ISeizureRequest {
  process_number: string
  order_number: string
  court_id: number | null
  claimant_id: number | null
  type_defendant_id: number | null
  defendant_id: number | null
  business_trusts_id: number | null
  order_date: string
  awareness_date: string
  seizure_date: string
  value_seizure: number | null
  active_seizure_total: number | null
  city_id: number | null
  management_area_id: string | number | null
  process_type_id: number | null
  value_paid: number | null
  observations: string
  assets: Asset[]
  claimant_object?: ThirdPartyObject | null
  defendant_object?: ThirdPartyObject | null
  business_trusts_object?: BusinessTrust | null
  city_object?: CityObject | null
  document?: SeizureDocument
}

export interface BusinessTrust {
  id: number
  business_code?: string
  name?: string
  start_date?: string
  end_date?: string
  has_extend?: boolean
  has_budget?: boolean
  status_id?: number
  business_type_id?: number
  business_subtype_id?: number
  business_mod?: string
  derivate_contracting?: boolean
  status?: {
    id: number
    status: string
  }
  document_type?: DocumentTypeItem[]
  budget?: Budget | null
  account?: {
    id: number
    business_trust_id: number
    functional_business_currency: string
    identification_tax: string
    accounting_structure_id: number
  }
  accounts_payable?: Budget | null
  label?: string
  value?: number
  code?: string
}

export interface CityObject {
  value: number
  label: string
  code: string
  name: string
}

export interface ThirdPartyObject {
  id: number
  document: string
  third_party_category: string
  commercial_registration: string | null
  status: ThirdPartyStatus | null
  addresses?: {
    id: number
    third_party_id: number
    address_type: string
    address: string
    postal_code: string | null
    is_main: boolean
    created_at: string
    updated_at: string
    country_id: number
    department_id: number | null
    city_id: number | null
  }
  legal_person?: ILegalPerson | null
  natural_person?: INaturalPerson | null
  value: number
  label: string
  document_type: string | null
  name: string
}

export interface Asset {
  seizure_assets_products_type_id: number | null
  description: string
  asset_value: number
  asset_type_id: number
  assetable_type: string
  assetable_id: number
}

export interface ISeizedAssetsList {
  id: number
  backend_id?: number
  asset_type: number
  description: string
  value: number | string
  seizure_assets_products_type_id: number | null
  asset_value: number
  asset_class: string
  assetable_type: string
  assetable_id: number
  percentage?: number | null
}

export interface IBackendSeizureAsset {
  id: number
  description: string
  asset_value: number
  asset_class: string

  product_type?: {
    id: number
    name: string
  } | null

  assetable?: {
    type: string
    id: number
    data?: unknown
  } | null
}

export interface IMassiveUploadFile {
  id: number
  file: File
  file_name: string
  total_records: number
  status: 'LOADING' | 'SUCCESS' | 'ERROR'
}

export interface IMassiveSeizureDetail {
  id: number
  process_number: string
  claimant: string
  defendant: string
  value_seizure: number
  validation_status: 'SUCCESS' | 'ERROR'
}

export interface ISeizureMassiveCreatePayload {
  rows: Record<string, unknown>[]
}

export interface ISeizureManagementHistory {
  id: number
  type: string
  description: string
  date: string
  created_by: string
}

export interface IBankContact {
  name: string
  role: string
  phone: string
  email: string
  bank: string
}

export interface ISeizureActivatePayload {
  observation: string
  official_number?: string | null
  official_date?: string | null
  support_document?: File | null
}

export interface IMassiveValidationError {
  row: number
  errors: IMassiveValidationFieldError[]
  errorsData?: {
    numero_proceso?: string
    numero_oficio?: string
    demandante?: string
    demandado?: string
    valor_embargo?: string | number
  }
}

export interface IMassiveValidationFieldError {
  field: string
  message: string
  suggestion?: string
}

export interface IMassiveValidationResponse {
  valid: boolean
  rows?: IMassiveValidatedRow[]
  errors?: IMassiveValidationError[]
}

export interface IMassiveValidatedRow {
  numero_proceso: string
  numero_oficio: string
  juzgado: number
  tipo_demandado: number
  demandante: string
  demandado: string
  negocio: string
  fecha_conocimiento: string
  fecha_embargo: string
  fecha_oficio: string
  valor_embargo: string
  ciudad_embargo: number
  area_gestion: number
  tipo_proceso: number
  codigo_bien_embargado?: string
  cuenta_bancaria?: string
  plan_inversion?: string
  derecho_fiduciario?: string
  observaciones?: string
}

export interface ISeizureManagementForm {
  observation: string
  official_number: string | null
  official_date: string | null
  support_document: File | null
  payment_order_number: string | null
  payment_order_id: number | null
  payment_date: string | null
  payment_value: number | null
  payment_beneficiary: string | null
  payment_status: string | null
  seizure_release_type_id: number | null
  expiration_date: string | null
}

export interface ISeizureProcedure {
  id: number
  seizure_id: number
  seizure_procedure_type_id?: number
  official_number: string
  official_date: string
  expiration_date?: string | null
  payment_amount?: number | null
  observation?: string | null
  created_at?: string
  updated_at?: string
  procedures_type?: {
    description: string
  }
  created_by?: {
    id: number
    document?: string
    name?: string
    last_name?: string
    profile_type?: string
    email?: string
  } | null
}

export interface PaymentOrderOptionExtra {
  payment_date?: string | null
  payment_value?: number | null
  payment_beneficiary?: string | null
  payment_status?: string | null
}
