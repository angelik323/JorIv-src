import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT, TIMEOUTS } from '@/constants/alerts'
import {
  IRegisterFixedIncomeForeignCurrencyPayload,
  IIrrFlowResponse,
  IIrrFlowForeignRequest,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterFixedIncomeForeignCurrencyStoreV1 = defineStore(
  'register-fixed-income-foreign-currency-store-v1',
  {
    state: () => ({
      version: 'v1' as const,
      irrFlowData: null as IIrrFlowResponse | null,
      irr_flow_response: null as IIrrFlowResponse | null,
      currencyDescription: null as string | null,
      numberDays: 0 as number,
      operationType: null as string | null,
      currencyValue: null as number | null,
    }),
    actions: {
      async _createAction(payload: IRegisterFixedIncomeForeignCurrencyPayload) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-fixed-income-foreign-currency/new`,
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

      async _getIrrFlow(payload: IIrrFlowForeignRequest) {
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/buy-fixed-income-foreign-currency/irr-flow`,
            payload
          )
          .then((response) => {
            if (response?.data?.success) {
              const data = response.data?.data as IIrrFlowResponse
              if (data && Array.isArray(data.cashflows)) {
                data.cashflows = data.cashflows.filter(
                  (cf) => cf.type !== 'investment'
                )
              }
              this._setIrrFlowResponse(data)
            } else {
              showAlert(
                response?.data?.message ??
                  'No fue posible obtener la información del flujo IRR',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _setIrrFlowResponse(payload: IIrrFlowResponse | null) {
        this.irr_flow_response = payload
      },

      _setCurrencyDescription(description: string) {
        this.currencyDescription = description
      },

      _setNumberDays(numberDays: number) {
        this.numberDays = numberDays
      },

      _setOperationType(operationType: string) {
        this.operationType = operationType
      },

      _setCurrencyValue(value: number | null) {
        this.currencyValue = value
      },
    },
  }
)
