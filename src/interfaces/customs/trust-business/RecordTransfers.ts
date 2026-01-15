export interface IRecordTransfers {
  id: number
  transfer_type: string
  business_trust_id: number
  status_id: number
  created_at: string
  updated_at: string
  deleted_at: string
  transferee_id: number
  business_trust: IBusinessTrust
  status: IStatus
  transfer_type_text?: string
}

interface IBusinessTrust {
  id: number
  name: string
  business_code: string
  start_date: string
  end_date: string
  status_id: number
}

interface IStatus {
  id: number
  status: string
  comments?: string
}

export interface IRecordTransfersResponse {
  id?: number
  business_id: number | null
  business_name?: string
  participant_type_id: number | null
  date?: string
  upload_date?: string
  state_id?: number
  name?: string
  state_register?: number
  participant_type?: string
  transfer_type?: string
}

export interface IRecordTransfersComplete {
  id: number
  _uid: number
  third_party_id: number
  percentage_participation: number | string
  type_resource: string
  name: string
  type: string
  abbreviation: string
  document_number: string
  checked?: boolean
}

export interface IRecordTransfersPrincipal
  extends Partial<IRecordTransfersComplete> {
  received_percentage?: number
}

export interface IRecordTransfersTransferors
  extends Partial<IRecordTransfersComplete> {
  transfer_percentage?: number
}

export interface IRecordTransfersAssignees
  extends Partial<IRecordTransfersComplete> {
  received_percentage?: number
}

export interface IResponseImport {
  failed: IFailed
  successful: ISuccessful
}

interface IFailed {
  count: number
  data: IDataFailed[]
}

interface IDataFailed {
  type_resource: string
  document_type: string
  document: number
  percentage_participation: number
  message: string
  validation: string
}

interface ISuccessful {
  count: number
  data: IDataSuccess[]
}

interface IDataSuccess {
  id: number
  status_id: number
  status: IStatus
  document_type_id: number
  document_type: IDocumentType
  document: string
  name: string
  type: string
  percentage_participation: number
  type_resource: string
}

interface IDocumentType {
  id: number
  name: string
  abbreviation: string
}

export interface IRecordTransfersCreate {
  transfer_type: number | string
  transferee_id: number
  transferee_percentage: number
  participants?: IParticipant[]
}

interface IParticipant {
  transfer_percentage: number
  final_percentage: number
  third_party_id: number
}

export interface IResponseRecordTransfers {
  id: number
  transferee_id: number
  transferee_percentage: number
  transfer_type: string
  transfer_type_id: number | string
  status: IStatus
  created_at: string
  business_trust: BusinessTrust
  resources: IResource[]
  participant_transfers: IParticipantTransfer[]
  observations?: string
}

interface BusinessTrust {
  id: number
  name: string
  business_code: string
  start_date: string
  end_date: string
  status: IStatus
}

interface IResource {
  id: number
  third_party_id: number
  percentage_participation: string
  type_resource: string
  third_party: IThirdParty
}

interface IThirdParty {
  id?: number
  document_number: string
  document_type: number
  name: string
  type: string
  abbreviation: string
}

interface IParticipantTransfer {
  id: number
  percentage_participation: string | number
  final_percentage: number
  third_party: IThirdParty
  transfer_type: string | number
  created_at: string
  updated_at: string
}

export interface IResponseDocuments {
  id: number
  name: string
  original_name?: string
  is_validated: boolean
  document_type: string
  path: string
  s3_file_path?: string
  upload_url: string
  created_at?: string
}

export interface IFileTableRecordTransfer {
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
