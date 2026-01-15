import { IResource } from '@/interfaces/global'

export interface ITaxTypesResource extends IResource {
  sign?: string
  scope?: string
  usage?: string
}
