import { IGenericResource } from './Common'

export interface IAuditUserSubmodulesResource extends IGenericResource {
  id: number
  description: string
  name: string
  action: string
}
