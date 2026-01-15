export interface IIcaActivitiesFilters {
  'filter[city_id]': string
  'filter[third_party_id]': string
  'filter[periodicity]': string
  'filter[economic_activity_id]': string
  'filter[account_structure_id]': string
  'filter[status_id]': string
}

export interface IIcaActivitiesItem {
  id: number
  code: string
  city: {
    id: number
    code: string
    name: string
  }
  ica_relation: {
    id: number
    city_id: number
    periodicity: string
    city: {
      id: number
      code: string
      name: string
    }
  }
  economic_activity: {
    id: number
    code: string
    description: string
  }
  activity_type: string
  fiscal_charge: {
    id: number
    name: string
    code: string
  }
  applies_to_third_party: boolean
  third_party_type: string
  account_structure: {
    id: number
    code: string
    structure: string
    purpose: string
  }
  account_chart: {
    id: number
    name: string
    code: string
    full_hierarchy: string
    parent: string | null
  }
  settlement_concept: {
    id: number
    concept_code: string
    description: string
    class: string
  }
  minimum_base_pesos: string
  minimum_base_uvt: string
  percentage: string
  status: {
    id: number
    name: string
    description: string | null
  }
  actions?: string
}

export interface IIcaActivitiesForm {
  id?: number | null
  city_id: number | null
  city_label?: string | null
  third_party_nit: string | null
  periodicity: string | null
  ica_relation_id: number | null
  economic_activity_id: number | null
  activity_type: string | null
  fiscal_charge_id: number | null
  applies_to_third_party: boolean | null
  third_party_type: string | null
  account_structure_id: number | null
  account_structure_description?: string | null
  account_chart_id: number | null
  minimum_base_pesos: string | number | null
  minimum_base_uvt: string | number | null
  percentage: string | number | null
  settlement_concept_id: number | null
  settlement_concept_description?: string | null
  economic_activity_code?: string | null
  economic_activity_description?: string | null
  fiscal_charge_code?: string | null
  fiscal_charge_description?: string | null
  account_chart_description?: string | null
  account_chart_code?: string | null
  status_id?: number | null
  economic_activity?: {
    id?: number | null
  }
  fiscal_charge?: {
    id?: number | null
  }
  account_structure?: {
    id?: number | null
  }
  account_chart?: {
    id?: number | null
  }
  settlement_concept?: {
    id?: number | null
  }
  ica_relation?: {
    id?: number | null
    city_id?: number | null
  }
  status?: {
    id?: number | null
  }
  actions: string
}

export interface IIcaActivitiesUpdatePayload {
  city_id: number | null
  third_party_nit: string | null
  periodicity: string | null
  ica_relation_id: number
  economic_activity_id: number
  activity_type: string
  fiscal_charge_id: number
  applies_to_third_party: boolean
  third_party_type: string
  account_structure_id: number
  account_chart_id: number
  minimum_base_pesos: string | number
  minimum_base_uvt: string | number
  percentage: string | number
  settlement_concept_id: number
}

export interface IIcaActivitiesCreatePayload {
  city_id: number | null
  third_party_nit: string | null
  periodicity: string | null
  ica_relation_id: number
  economic_activity_id: number
  activity_type: string
  fiscal_charge_id: number
  applies_to_third_party: boolean
  third_party_type: string
  account_structure_id: number
  account_chart_id: number
  minimum_base_pesos: string | number
  minimum_base_uvt: string | number
  percentage: string | number
  settlement_concept_id: number
}

export interface IAvalibleCities {
  id: number
  code: string
  name: string
  value: string | number
  label: string
  third_party: null | {
    id: number
    document: string
    validator_digit: string | null
    legal_person: null | {
      third_party_id: number
      id: number
      business_name: string
    }
    natural_person: null | {
      third_party_id: number
      id: number
      full_name: string
    }
  }
  ica_relation_id: 1
}

export interface IIcaRelationsFilters {
  'filter[city_id]': string
  'filter[third_party_id]': string
  'filter[periodicity]': string
}

export interface IIcaRelationsItem {
  id: number
  periodicity: {
    label: string
    value: string
  }
  city: {
    id: number
    name: string
    code: string
  }
  third_party: {
    id: number
    document: string
    validator_digit: string | null
    legal_person: {
      third_party_id: number
      id: number
      business_name: string
    } | null
    natural_person: {
      third_party_id: number
      id: number
      full_name: string
    } | null
  }
  actions: string
}

export interface IIcaRelationsPayload {
  id?: number | null
  city_id: number | null
  third_party_id: number | null
  periodicity: string | null
}

export interface IIcaRelationsForm {
  id: number | null
  periodicity: string
  city: {
    id: number | null
    name: string
    code: string
  }
  third_party: {
    id: number | null
    document: string
    validator_digit: string | null
    legal_person: {
      third_party_id: number | null
      id: number | null
      business_name: string
    } | null
    natural_person: {
      third_party_id: number | null
      id: number | null
      full_name: string
    } | null
  }
}

export interface IIcaActivitiesFileErrorJson {
  filename: string
  successful_records: number
  failed_records: number
  total_records: number
  status: {
    id: number
    name: string
  }
  validated_rows: [] | IIcaActivitiesFileErrorJsonRow[]
}

export interface IIcaActivitiesFileErrorJsonRow {
  id?: number
  ciudad: string
  actividad_economica: number | string
  descripcion_actividad_economica: string
  tipo_de_actividad: number | string
  cargo_fiscal: number | string
  descripcion_cargo_fiscal: string
  aplica_terceros: boolean
  aplica_terceros_registrados_en_camara_y_comercio: string
  tipo_de_tercero: string | null
  estructura_contable: number | string
  cuenta_contable: number | string
  descripcion_cuenta_contable: string
  concepto_de_liquidacion?: number | string
  base_minima_en_pesos: number | null
  base_minima_en_uvt: number | null
  porcentaje: number | null
  status: string
  actions: string
}

export interface IIcaActivitiesFileTable {
  id?: number
  is_new?: boolean
  name: string
  status_id?: number
  url: string
  failed_records: number
  successful_records: number
  size: number
  created_at?: string
  type?: string
  file?: File
  status: string
  actions: string
}
