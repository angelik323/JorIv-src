export interface IAttachedDocumentStatus {
  id: number
  name: string
}

export interface IAttachedDocumentsList {
  id?: number
  code: string
  name: string
  status: IAttachedDocumentStatus
  stage: string
}

export interface IAttachedDocumentForm {
  code: string
  name: string
  stage: string
}
