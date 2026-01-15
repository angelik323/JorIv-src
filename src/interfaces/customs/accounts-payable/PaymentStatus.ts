export interface IPaymentStatusFilters {
  'filter[business_id]': string
  'filter[date_from]': string
  'filter[date_to]': string
  'filter[status_id]': string
  'filter[request_from]': string
  'filter[request_to]': string
}

export interface IPaymentStatusItem {
  id: number | null
  request_number: string | null
  orpa_number: number | null
  supplier_id: number | null
  supplier: {
    id: number | null
    document: string | null
    validator_digit: string | null
    document_type_id: number | null
    support_document_numbering_issuer_status_id: number | null
    support_document_numbering_issuer_delegate_id: number | null
    legal_person: {
      third_party_id: number | null
      id: number | null
      business_name: string | null
    } | null
    natural_person: {
      third_party_id: number | null
      id: number | null
      name: string | null
      middle_name: string | null
      last_name: string | null
      second_last_name: string | null
      full_name: string | null
    } | null
    document_type: {
      id: number | null
      name: string | null
      abbreviation: string | null
      model: string | null
      status_id: number | null
    }
  }
  reception_date: string | null
  total_value: string | null
  status_id: number | null
  status: string | null
  created_at: string | null
  updated_at: string | null
}

export interface IPaymentStatusDetailItem {
  id: number | null
  request_number: string | null
  status_id: number | null
  status: string | null
  status_history: IPaymentStatusDetailHistoryItem[]
}

export interface IPaymentStatusDetailHistoryItem {
  id: number
  date: string
  hour: string
  user_id: number
  user: string
  status_id: number
  status: string
}
