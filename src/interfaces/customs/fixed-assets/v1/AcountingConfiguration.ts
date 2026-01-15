import { ITrustBusinessGeneralInformation } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

export interface IReceiptType {
  id: number
  code: number | string
  name?: string
  type?: string
}

export interface IAccountingConfigurationItemList {
  id: number | null
  source: string | null
  code: string | null
  receipt_type?: IReceiptType | null
  receipt_subtype?: IReceiptType | null
  configuration_type: IAccountingConfigurationType | null
  configuration_subtype: IAccountingConfigurationType | null
  business_trust: IAccountingConfigurationType | null
  can_be_deleted_by_time: boolean | null
  accounting_parameters?: IAccountingParameters[] | null
}

export interface IAccountingConfigurationFilters {
  'filter[source]': number
  'filter[business_trust_id]': number
  'filter[configuration_type_id]': number
  'filter[configuration_subtype_id]': number
  'filter[novelty_code]': number
  'filter[created_at_from]': number
  'filter[created_at_to]': number
  'filter[receipt_type_id]'?: number
}

export interface IAccountingConfigurationAssetClass {
  id?: number | null
  name?: string | null
  code?: number | string | null
  business_code?: string | null
  asset_class?: string | null
  asset_class_label?: string | null
}

export interface IAccountingConfigurationType
  extends IAccountingConfigurationAssetClass {
  description: string
}

export interface IAccountingConfigurationUser {
  id: number | null
  name: string
  full_name: string
  email: string
}

export interface IAccountingStructure {
  account_structures_description: string | null
  cost_centers_structures_description: string | null
  business_accouting_structure?: {
    id?: number | null
    purpose?: string | null
    type?: string | null
    code?: string | null
  }
  business_cost_center_structure?: [
    {
      id?: number | null
      name?: string | null
      description?: string | null
      status_id?: number | null
    }
  ]
}

export interface ITypeAndSubtype {
  configuration_type_id: string | null
  type_description?: string | null
  configuration_type_code?: number | string | null
  configuration_subtype_id: number | string | null
  configuration_subtype_code?: number | string | null
  subtype_description?: string | null
  configuration_type?: IAccountingConfigurationType | null
  configuration_subtype?: IAccountingConfigurationType | null
}

export interface IAccountingParameters {
  configuration_novelty_type_id: number | string | null
  debit_nature: string | null
  debit_accounts_chart_id: string | number | null
  credit_nature: string | number | null
  credit_accounts_chart_id: string | number | null
  novelty_code?: string | null
  detail_transaction: string | null
  configuration_novelty_type?: IAccountingConfigurationType | null
}

export interface IAccountingConfigurationTrust
  extends ITrustBusinessGeneralInformation {
  id: number | null
  business_code: string | null
}

export interface IAccountingConfigurationForm
  extends IAccountingStructure,
    ITypeAndSubtype {
  id?: number | null
  code?: string | null
  created_at: string | null
  updated_at?: string | null
  created_by_user?: IAccountingConfigurationUser | null
  updated_by_user?: IAccountingConfigurationUser | null
  source: string | null
  business_trust?: IAccountingConfigurationTrust | null
  business_trust_id: number | string | null
  business_trust_code?: string | null
  business_description: string | null
  accounting_parameters: IAccountingParameters[] | null
  receipt_type_id?: number | null
  receipt_subtype_id?: number | null
  receipt_type_description?: string | null
  receipt_subtype_description?: string | null
  receipt_type?: IAccountingConfigurationAssetClass
  receipt_subtype?: IAccountingConfigurationAssetClass
}

export interface IAccountingConfigurationCreate {
  id?: number | null
  source: string | null
  business_trust_id: number | string | null
  configuration_type_id: number | string | null
  configuration_subtype_id?: number | string | null
  receipt_type_id?: number | null
  receipt_subtype_id?: number | null
  accounting_parameters: IAccountingParameters[] | null
}

export interface IAccountingConfigFileValidation {
  name: string
  status_id: number | null
  size?: number | null
  has_errors: boolean
  id: string | null
  batch_id?: string | null
  validated_rows: IAccountingConfigValidatedRow[]
}

export interface IAccountingConfigValidatedRow {
  row_number: number // ID auto-incremental para la tabla de vista previa

  // Campos del Excel
  source: string // 'Activos fijos' | 'Bienes'
  business_trust_id: number // Código numérico del negocio
  business_trust_code?: string // Asociado al negocio
  business_trust_description?: string // Obtenido del código (opcional para mostrar)

  // Estructuras asociadas al negocio
  account_structure_code?: string // Asociado al negocio
  cost_center_structure_code?: string // Opcional, asociado al negocio

  //Comprobante
  receipt_type_id?: number
  receipt_type_code?: string | number
  receipt_type_description?: string

  receipt_subtype_id?: number
  receipt_subtype_code?: string | number
  receipt_subtype_description?: string

  // Tipo y subtipo
  configuration_type_id: number // Código numérico del tipo
  configuration_type_code?: string // Asociado al tipo
  configuration_type_description?: string // Descripción obtenida del código
  configuration_subtype_code?: string // Asociado al subtipo
  configuration_subtype_id: string // Código numérico del subtipo
  configuration_subtype_description?: string // Descripción obtenida del código

  // Novedad
  configuration_novelty_type_id: string // Código numérico de la novedad
  configuration_novelty_type_code?: string // Asociado a la novedad
  configuration_novelty_type_description?: string // Descripción obtenida del código

  // Partida
  debit_nature: string // Naturaleza partida
  debit_accounts_chart_id: number // Cuenta contable partida (código numérico)

  // Contrapartida
  credit_nature: string // Naturaleza contrapartida (opuesta a partida)
  credit_accounts_chart_id: number // Cuenta contable contrapartida (código numérico)

  // Detalle
  detail_transaction: string // Text input 10-20 caracteres
}
