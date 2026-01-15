import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT, TIMEOUTS } from '@/constants/alerts'
import {
  IRegisterFixedIncomeLocalCurrencyPayload,
  IIrrFlowRequest,
  IIrrFlowResponse,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterFixedIncomeLocalCurrencyStoreV1 = defineStore(
  'register-fixed-income-local-currency-store-v1',
  {
    state: () => ({ version: 'v1' as const }),
    actions: {
      async _createAction(payload: IRegisterFixedIncomeLocalCurrencyPayload) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-fixed-income-local-currency/new`,
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
              TIMEOUTS.SEC_5
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUTS.SEC_5)
          })

        return success
      },

      async _getIrrPurchaseFlow(
        payload: IIrrFlowRequest
      ): Promise<IIrrFlowResponse | null> {
        let data: IIrrFlowResponse | null = null

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-fixed-income-local-currency/irr-flow`,
            payload
          )
          .then((response) => {
            const ok = Boolean(response?.data?.success)
            if (!ok) {
              showAlert(
                response?.data?.message ??
                  'No fue posible calcular la TIR de compra',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
              return
            }
            data = response.data.data as IIrrFlowResponse
            if (data && Array.isArray(data.cashflows)) {
              data.cashflows = data.cashflows.filter(
                (cf) => cf.type !== 'investment'
              )
            }
            showAlert(
              response?.data?.message ?? 'TIR calculada',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return data
      },
    },
  }
)
