import {
  IGenericResource,
  IResourceModule,
  IResourceNameId,
  ISelectorStringResource,
} from './Common'

export interface IScheduleResources extends IResourceModule {
  version: string
  users_by_name: IResourceNameId[]
  business: IResourceNameId[]
  role: IResourceNameId[]
  notifications_modules: ISelectorStringResource[]
  notifications_statuses: IGenericResource[]
  users: IGenericResource[]
  users_to_notify: IGenericResource[]
}
