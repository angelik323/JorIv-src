export interface IRangesForDeferredRequest {
  id: number
  account_structure_id: number
  business_trust_id: number
  ranges: IRangeItem[]
}

export interface IRangeItem {
  range_type: string
  nature: string
  receipt_type_id: number
  sub_receipt_type_id: number
  from_account_id: number
  to_account_id: number
}

export interface IRangeDeferredResponse {
  id: number
  account_structure: {
    code: string
    purpose: string
  }
  business_trusts?: { id: number; name: string }[]
  ranges: IRangeDeferredItem[]
}

export interface IRangeDeferredItem {
  id: number
  range_type: string
  nature: string
  receipt_type?: {
    code: number
    name: string
  }
  sub_receipt_type?: {
    code: number
    name: string
  }
  from_account?: object
  to_account?: object
}

export interface IRangeRow {
  id: number | null
  range_type: string | null
  receipt_type: number | null
  sub_receipt_types: number | null
  nature: string | null
  account_from: number | null
  account_from_name: string | null
  account_to: number | null
  account_to_name: string | null
}

export interface IRangeForTable {
  id: number
  range_type: string
  structure: string
  business: string
  receipt_type: string | number
  receipt_sub_type: string | number
}

export interface IRangeShow {
  id: number
  range_type: string | null
  nature: string | null
  receipt_type?: { id: number; name: string }
  sub_receipt_type?: { id: number }
  from_account?: { structure?: { id: number; code: string } }
  to_account?: { structure?: { id: number; code: string } }
}
