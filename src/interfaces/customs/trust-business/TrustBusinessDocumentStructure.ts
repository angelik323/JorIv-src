export interface ITrustBusinessDocumentStructureList {
  id: number
  description: string
  characteristic_code: string
  type: string
  is_obligatory: boolean
  alert: boolean
  business_trust_id: number
  business_trust: IBusinessTrust
}

interface IBusinessTrust {
  id: number
  business_code: string
}

export interface ITrustBusinessDocumentStructureForm {
  description: string
  characteristic_code: string
  type: string
  is_obligatory: boolean | null
  alert: boolean | null
  business_trust_name?: string
  business_trust_code?: number
}

export interface IBusinessTrustOnCreateDocumentStructure {
  id: number
  name: string
}
