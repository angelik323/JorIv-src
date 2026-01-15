// Vue - Vue Router - Pinia - Quasar
import { defineStore } from 'pinia'

// Interfaces
import { ISystemOperationChannel } from '@/interfaces/customs/fics/SystemOperationChannels'
import { IErrors } from '@/interfaces/global'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

export const useSystemOperationChannelsStoreV1 = defineStore(
  'system-operation-channels-store-v1',
  {
    state: () => ({
      system_operation_channels_list: [] as ISystemOperationChannel[],
    }),
    actions: {
      async _getSystemOperationChannelsList() {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        executeApi()
          .get(`${URL_PATH_FICS}/system-operation-channels/channels-list`)
          .then((response) => {
            const { message, success, data } = response.data

            if (success) {
              this.system_operation_channels_list = data ?? []
            }
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error: IErrors) => {
            showCatchError(error)
          })
      },
    },
  }
)
