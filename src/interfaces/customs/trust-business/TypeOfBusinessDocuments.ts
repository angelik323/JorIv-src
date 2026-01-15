export interface ITypeOfBusinessDocumentList {
  id: number
  document_description: string
  document_code: string
  apply_for: string
  current_business_requirements: boolean
  business_trust_id: number
  business_trust: IBusinessTrust
}

interface IBusinessTrust {
  id: number
  business_code: string
}

export interface ITypeOfBusinessDocumentForm {
  document_description: string
  document_code: string
  apply_for: string
  current_business_requirements: boolean | null
}

export interface IBusinessTrustOnCreate {
  id: number
  name: string
}
