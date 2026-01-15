export interface IVisitRecordsItemList {
  id?: number | string
  business_trust?: string | null
  asset_type?: string | null
  asset_subtype?: string | null
  created_at?: string | null
  created_by_name?: string | null
}

export interface IVisitRecordsFilters {
  'filter[business_trust_id]': number
  'filter[configuration_types_id]': number
  'filter[configuration_subtypes_id]': number
  'filter[start_date]': string
  'filter[end_date]': string
  'filter[physical_condition]': string
  'filter[asset_rating]': string
}

export interface IVisitRecordDetail {
  id?: number | null
  visit_record_id?: number | null
  visit_date: string | null
  responsible_id: number | null
  responsible?: string | null
  visitor_id: number | null
  visitor?: string | null
  visit_reason: string | null
  physical_condition: string | null
  asset_rating: string | null
  recommendations: string | null
  created_at?: string
  created_by?: number
  created_by_name?: string
  updated_at?: string | null
  updated_by?: number | null
  updated_by_name?: string | null
}

export interface IVisitRecordList {
  id: number
  business_trust_id: number
  business_trust: string
  asset_type_id: number
  asset_type: string
  asset_subtype_id: number
  asset_subtype: string
  details: IVisitRecordDetail[]
  created_at: string
  created_by: number
  created_by_name: string
  updated_at: string
  updated_by: number
  updated_by_name: string
}

export interface IVisitRecordForm extends IVisitRecordsItemList {
  business_trust_id?: number | null
  asset_type_id?: number | null
  configuration_types_id?: number | null
  configuration_subtypes_id?: number | null
  asset_subtype_id?: number | null
  details?: IVisitRecordDetail[]
  updated_at?: string | null
  updated_by_name?: string
}
