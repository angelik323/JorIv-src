import { IClientLegalPersonDirectResponse } from '@/interfaces/customs/clients/ClientDirectLegalPerson'

import {
  IClientLegalPersonIndirectRequest,
  IClientLegalPersonIndirectResponse,
} from '@/interfaces/customs/clients/ClientIndirectLegalPerson'
import { IClientNaturalPersonIndirectRequest } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'

export interface IClient {
  id: number
  name: string | undefined
  person_type: string | number | undefined
  document_number: string | number | undefined
  state: boolean | string
}

export enum ClientType {
  DIRECT = 'directo',
  INDIRECT = 'indirecto',
  BOTH = 'ambos',
}

export enum PersonType {
  NATURAL = 'natural',
  LEGAL = 'jurídica',
  TRUST = 'fideicomiso',
}

export enum ClientPersonType {
  NATURAL_DIRECT = 'natural_directo',
  NATURAL_INDIRECT = 'natural_indirecto',
  LEGAL_DIRECT = 'juridica_directo',
  LEGAL_INDIRECT = 'juridica_indirecto',
  TRUST = 'fideicomiso',
}

export enum ClientApiRouteType {
  CUSTOMERS = 'customers',
  INDIRECT_CUSTOMERS = 'indirect-customers',
}

export enum PersonApiRouteType {
  NATURAL_PERSON = 'natural-persons',
  LEGAL_PERSON = 'legal-persons',
  TRUST_PERSON = 'fideicomiso-persons',
}

export type ClientRequestType =
  | IClientLegalPersonIndirectRequest
  | IClientNaturalPersonIndirectRequest

export type ClientResponseType =
  | IClientLegalPersonDirectResponse
  | IClientLegalPersonIndirectResponse
