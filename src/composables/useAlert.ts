import { Notify } from 'quasar'

export const useAlert = () => {
  const showAlert = (
    message: string,
    type = 'default',
    icon?: string,
    timeout: number = 6000
  ) => {
    const actions =
      timeout == 0
        ? [
            {
              handler: () => {
                /* close on click */
              },
              color: 'transparent',
              label: '',
              style:
                'width: 100%; height: 100%; position: absolute; top: 0; left: 0;',
            },
          ]
        : []

    switch (type) {
      case 'success':
        Notify.create({
          icon: !icon ? 'mdi-check-circle-outline' : icon,
          message: message,
          multiLine: true,
          classes: 'alert__message--success fix__index',
          timeout: timeout,
          position: 'top',
          actions,
        })
        break

      case 'error':
        Notify.create({
          icon: !icon ? 'mdi-alert-circle' : icon,
          message: message,
          multiLine: true,
          classes: 'alert__message--error fix__index',
          timeout: timeout,
          position: 'top',
          actions,
        })
        break

      case 'warning':
        Notify.create({
          icon: !icon ? 'mdi-alert-outline' : icon,
          message: message,
          multiLine: true,
          classes: 'alert__message--warning fix__index',
          timeout: timeout,
          position: 'top',
          actions,
        })
        break

      case 'info':
        Notify.create({
          icon: !icon ? 'mdi-information' : icon,
          message: message,
          multiLine: true,
          classes: 'alert__message--info fix__index',
          timeout: timeout,
          position: 'top',
          actions,
        })
        break

      default:
        Notify.create({
          icon: !icon ? 'mdi-timer' : icon,
          message: message,
          multiLine: true,
          color: 'primary',
          timeout: timeout,
          position: 'top',
          actions,
        })
        break
    }
  }
  return {
    showAlert,
  }
}
