export interface IDetails {
  id?: number
  code?: number
  name?: string
  type?: string
  status?: number | boolean
  status_id?: number | boolean
  details?: ITypeAccountingDetail[]
  observation?: string
}

export interface ITypeAccountingDetail {
  id?: number
  _uid?: number
  name: string
  is_proof_cancellation: boolean
  proof_cancellation: string | number
  proof_charge: boolean
  status_id: number
}

export interface ITypeAccountingAction {
  id?: number
  code?: number
  name: string
  type?: string
  status_id?: number
  sub_receipt_types?: ISubReceiptType[]
  status?: Status
  observation?: string
}

export interface Status {
  id: number
  status: string
  comments: null
}

export interface ISubReceiptType {
  id?: number
  code?: number
  name?: string
  is_cancellation?: boolean
  cancellation_association_id: number | null
  is_upload_receipt?: boolean
  status_id?: number
  receipt_type_id?: number
  cancellation_association?: ICancellationAssociation
  status?: Status
}

export interface ICancellationAssociation {
  id: number
  code: number
  name: string
  is_cancellation: boolean
  cancellation_association_id: number | null
  is_upload_receipt: boolean
  status_id: number
  receipt_type_id: number
}
