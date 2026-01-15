export interface IOperationLogsRequest {
  business_trust_id?: number | null
  document_year?: number | null
  date?: string | null
  budget_document_type_id?: number | null
  areas_responsibility_id?: number | null
  city_id?: number | null
  third_party_beneficiary_id?: number | null
  total_value?: string | null
  addition?: boolean | null
  operation_log_id?: number | null
  observations?: string | null
  operation_log_details: IOperationLogList[]
}

export interface IOperationLogList {
  id: number
  year: number
  month: number
  day: number
  areas_responsibility_id: number | null
  code_movements_source_destination_id: number | null
  budget_item_id: number | null
  budget_resource_id: number | null
  value: number | string | null
}
