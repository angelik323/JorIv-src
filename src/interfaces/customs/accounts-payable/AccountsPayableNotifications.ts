import { IRolesList } from '@/interfaces/customs/roles'
import { ITrustBusinessItemList } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'
import { IGenericResource } from '../resources'

export interface IAccountsPayableNotificationsListItem {
  id: number
  module: IGenericResource
  process: IGenericResource
  sub_process: IGenericResource | null
  recipients: IRolesList[]
  channels: IGenericResource[]
  message: string
  has_businesses: boolean
  business_trust_ids: ITrustBusinessItemList[]
  business_type_ids: IAccountsPayableNotificationsBusinessTypesIdsBase[]
  business_sub_type_ids: IAccountsPayableNotificationsBusinessTypesIdsBase[]
  status: IAccountsPayableNotificationsStatus
}

export interface IAccountsPayableNotificationsBusinessTypesIdsBase {
  id: number
  name: string
  indice: number
}

export interface IAccountsPayableNotificationsStatus {
  id: number
  name: string
}

export interface IAccountsPayableNotificationForm {
  notification_number?: string | null
  module: string | null
  process: string | null
  sub_process: string | null
  recipients: number[] | null
  channels: string[] | null
  message: string | null
  has_businesses: boolean | null
  business_type_ids: number[] | null
  business_sub_type_ids: number[]
  selected_business_trust: ITrustBusinessItemList[]
  business_trust_ids?: (number | null)[]
}
