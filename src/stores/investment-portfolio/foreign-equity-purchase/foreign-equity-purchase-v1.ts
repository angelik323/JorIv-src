import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import { useAlert, useShowError } from '@/composables'

import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IForeignEquityPurchases } from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useForeignEquityPurchaseStoreV1 = defineStore(
  'foreign-equity-purchase-v1',
  {
    state: () => ({
      version: 'v1',
      percentageOrFixedValue: null as number | null,
      currencyId: null as number | null,
      hasCommission: false,
      numberDays: null as number | null,
    }),
    actions: {
      async _createAction(payload: IForeignEquityPurchases) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-shares-foreign-currency/new`,
            payload
          )
          .then((response) => {
            success = response.data.success

            showAlert(
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

      _setPercentageOrFixedValue(value: number | null) {
        this.percentageOrFixedValue = value
      },

      _setCurrencyId(value: number | null) {
        this.currencyId = value
      },

      _setHasCommission(value: boolean) {
        this.hasCommission = value
      },

      _setNumberDays(value: number | null) {
        this.numberDays = value
      },
    },
  }
)
