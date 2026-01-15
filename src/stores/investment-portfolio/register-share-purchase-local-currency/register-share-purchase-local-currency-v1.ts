import { IRegisterSharePurchaseLocalCurrency } from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUTS } from '@/constants/alerts'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterSharePurchaseLocalCurrencyStoreV1 = defineStore(
  'register-share-purchase-local-currency-v1',
  {
    state: () => ({
      version: 'v1',
      percentageOrFixedValue: null as number | null,
    }),
    actions: {
      async _createAction(payload: IRegisterSharePurchaseLocalCurrency) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-shares-local-currency/new`,
            payload
          )
          .then((response) => {
            success = response.data.success

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUTS.SEC_5
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUTS.SEC_5)
          })

        return success
      },

      _setPercentageOrFixedValue(value: number | null) {
        this.percentageOrFixedValue = value
      },
    },
  }
)
