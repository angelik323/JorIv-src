import { INotifyOptions } from '@/interfaces/global/Alert'
import { IAlertNotifyConfig } from '@/interfaces/global/Alert'
import { AlertNotifyType } from '@/interfaces/global/Alert'
import { Notify, QNotifyAction } from 'quasar'

const ALERT_CONFIG: Record<AlertNotifyType, IAlertNotifyConfig> = {
  success: {
    classes: 'custom-alert--success',
    icon: 'mdi-checkbox-marked-circle',
  },
  error: {
    classes: 'custom-alert--error',
    icon: 'mdi-close-circle',
  },
  warning: {
    classes: 'custom-alert--warning',
    icon: 'mdi-alert',
  },
  info: {
    classes: 'custom-alert--info',
    icon: 'mdi-information-outline',
  },
  default: {
    classes: 'custom-alert--default',
    icon: 'mdi-alert',
  },
}

export const useAlertV2 = () => {
  const showAlert = (options: INotifyOptions) => {
    const config = ALERT_CONFIG[options.type ?? 'default']

    const { closeBtn = true, actions } = options

    const customActions: QNotifyAction[] = []

    const closeAction: QNotifyAction = {
      icon: 'mdi-close',
      round: true,
    }

    if (Array.isArray(actions) && actions.length > 0) {
      customActions.push(...actions)
    }

    if (closeBtn) {
      customActions.push(closeAction)
    }

    Notify.create({
      classes: 'custom-alert ' + config.classes,
      message: options.message,
      caption: options.caption,
      icon: options.icon ?? config.icon,
      timeout: options.timeout ?? 6000,
      position: options.position ?? 'top',
      multiLine: options.multiLine ?? false,
      actions: customActions,
    })
  }

  return {
    showAlert,
  }
}
