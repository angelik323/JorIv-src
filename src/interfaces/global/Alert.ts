import { QNotifyCreateOptions } from 'quasar'

export type AlertNotifyType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'default'

export interface IAlertNotifyConfig {
  classes: string
  icon: string
}

export interface INotifyOptions extends QNotifyCreateOptions {
  message: string
  type?: AlertNotifyType
  closeBtn?: boolean
}
