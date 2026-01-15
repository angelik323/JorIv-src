import { IGenericResource } from './Common'

export interface IParticipantTransferStatusResource extends IGenericResource {
  status: string
}

export interface IEquilibriumPointResource extends IGenericResource {
  status_name?: string
  project_name?: string
  document_code?: string
  document_description?: string
  characteristics_document?: {
    id: number
    business_trust_document_structure: {
      characteristic_code: string
      description: string
    }
  }[]
}

export interface ISaleRealStateResource extends IGenericResource {
  document?: string
  type?: string
  email?: string
  phone?: string
  address?: string
  project_name?: string
  project_type?: string
  observations?: string
  stage_number?: string
  business_type_id?: number | null
  nomenclature?: string
  area?: string
  total_value?: string
  total_paid?: string
  balance_due?: string
  order_number?: string
  date_register?: string
  date_vinculation?: string
  document_type?: IDocuemntType
}

interface IDocuemntType {
  id: number
  name: string
  abbreviation: string
}

export interface IEquilibriumPointResource extends IGenericResource {
  status_name?: string
  project_name?: string
  document_code?: string
  document_description?: string
  characteristics_document?: {
    id: number
    business_trust_document_structure: {
      characteristic_code: string
      description: string
    }
  }[]
}

export interface ITrustBusinessUserResource extends IGenericResource {
  name?: string
  last_name?: string
  document?: string
  email?: string
  status_id?: number | null
}

export interface ITrustBusinessUsers extends Omit<ITrustBusinessUserResource, 'document'> {
  document?: {
    document_type?: string
    abbreviation?: string
    number?: string
  }
}
