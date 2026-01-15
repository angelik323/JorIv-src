import { IGenericResource } from './Common'

export interface ITestNormativeResource extends Partial<IGenericResource> {
  test: number
  test2: string
}

export interface IEquivalencyParametersFormatsResource
  extends Partial<IGenericResource> {
  id: number
  name: string
}

export interface IEquivalencyParametersConceptsResource
  extends Partial<IGenericResource> {
  id: number
  name: string
}

export interface ICertificateTypesResource extends Partial<IGenericResource> {
  test: number
  test2: string
}
