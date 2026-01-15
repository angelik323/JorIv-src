import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import { useAlert, useShowError } from '@/composables'

import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IEtfLocalBuyOperation } from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/local-purchase-exchange-traded-fund`

export const useLocalPurchaseExchangeTradedFundStoreV1 = defineStore(
  'local-purchase-exchange-traded-fund-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _showAction(id: string) {
        return await executeApi()
          .get(`${URL_PATH}/${id}/show`)
          .then((response) => {
            if (response.data.success) return response.data.data

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createAction(payload: IEtfLocalBuyOperation) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/new`, payload)
          .then((response) => {
            success = response.data.success

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
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
