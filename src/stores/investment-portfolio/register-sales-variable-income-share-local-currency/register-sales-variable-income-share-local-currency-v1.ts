import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IRegisterShareSaleLocalCurrencyPayload } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterShareSaleLocalCurrencyStoreV1 = defineStore(
  'register-share-sale-local-currency-store-v1',
  {
    state: () => ({
      version: 'v1' as const,
      hasCommission: false as boolean,
    }),
    actions: {
      async _createAction(payload: IRegisterShareSaleLocalCurrencyPayload) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/variable-income-shares-currency-local/new`,
            payload
          )
          .then((response) => {
            success = Boolean(response?.data?.success)
            showAlert(
              response?.data?.message ??
                (success
                  ? 'Operación creada'
                  : 'No se pudo crear la operación'),
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

      _setHasCommission(value: boolean) {
        this.hasCommission = value
      },
    },
  }
)
