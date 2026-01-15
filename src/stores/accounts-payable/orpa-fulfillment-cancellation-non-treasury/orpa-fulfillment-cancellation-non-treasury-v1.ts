// Pinia - Api
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

//Interfaces - Constants
import {
  IOrpaCancelPayload,
  IOrpaFulfillPayload,
} from '@/interfaces/customs/accounts-payable/OrpaFulfillmentCancelationNonTreasury'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

//Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/orpa-compliance`

export const useOrpaFulfillmentCancelationNonTreasuryStoreV1 = defineStore(
  'orpa-fulfillment-cancellation-non-treasury-store-v1',
  {
    state: () => ({}),

    actions: {
      async _getOrpaFulfillmentCancelationNonTreasuryList(
        params: Record<string, string | number | null>
      ) {
        return await executeApi()
          .get(`${URL_PATH}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            if (success) {
              return {
                list: items,
                pages: {
                  currentPage: current_page,
                  lastPage: last_page,
                },
              }
            }
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _fulFillOrpaFulfillmentCancelationNonTreasury(
        payload: IOrpaFulfillPayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/fulfill`, payload)
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
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _cancelOrpaFulfillmentCancelationNonTreasury(
        payload: IOrpaCancelPayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/cancel`, payload)
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
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },
    },
  }
)
