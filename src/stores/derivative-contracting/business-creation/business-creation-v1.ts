// Vue - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import { IErrors } from '@/interfaces/global/'
import { IBusinessCreationFormPayload } from '@/interfaces/customs/derivative-contracting/IBusinessCreation'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// Constants
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBusinessCreationStoreV1 = defineStore(
  'business-creation-derivative-contracting-v1',
  {
    state: () => ({}),

    actions: {
      async _createAction(data: IBusinessCreationFormPayload) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_DERIVATIVE_CONTRACTING}/config-business`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },
    },
  }
)
