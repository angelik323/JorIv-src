import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IRegisterFixedIncomeLocalCurrencySalePayload,
  IIrrSaleForTitleRequest,
  IIrrSaleForTitleResponse,
  ITitleLists,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterFixedIncomeLocalCurrencySaleStoreV1 = defineStore(
  'register-fixed-income-local-currency-sale-store-v1',
  {
    state: () => ({ version: 'v1' as const }),
    actions: {
      async _createAction(
        payload: IRegisterFixedIncomeLocalCurrencySalePayload
      ) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-local-currency/new`,
            payload
          )
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
      async _getIrrSaleValue(
        request: IIrrSaleForTitleRequest
      ): Promise<number | null> {
        return await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-irr-sale/sale-irr`,
            request
          )
          .then((response) => {
            const data: IIrrSaleForTitleResponse = response.data.data
            return data.irr_sale_value
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _getTitlesList(
        issuerId: number,
        purchasable: 'local_fixed' | 'foreign_fixed'
      ): Promise<ITitleLists[] | null> {
        return executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/title-handler/titles-list`, {
            params: {
              'filter[issuers_counterparty_id]': issuerId,
              'filter[purchasable]': purchasable,
            },
          })
          .then((response) => {
            if (response.data.success) {
              return response.data.data as ITitleLists[]
            }
            showAlert(response.data.message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
    },
  }
)
