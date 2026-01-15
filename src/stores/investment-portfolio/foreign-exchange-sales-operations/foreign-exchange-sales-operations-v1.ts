import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  IForeignExchangeSalesBuy,
  IForeignExchangeSalesBuyItem,
  IForeignExchangeSalesView,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/foreign-currency-transactions`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  foreign_exchange_sales: {} as IForeignExchangeSalesBuy,
  foreign_exchange_sales_list: [] as IForeignExchangeSalesBuyItem[],
  foreign_exchange_sales_detail: null as IForeignExchangeSalesView | null,
  foreign_exchange_sales_pages: {
    currentPage: 0,
    lastPage: 0,
  },
})

export const useForeignExchangeSalesStoreV1 = defineStore(
  'foreign-exchange-sales-store-v1',
  {
    state: initialState,
    actions: {
      async _getForeignExchangeSalesBuyList(params: string) {
        this._cleanForeignExchangeSalesBuysData()
        await executeApi()
          .get(`${URL_PATH}/list?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.foreign_exchange_sales_list = response.data?.data?.data ?? []
              this.foreign_exchange_sales_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

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
      },
      async _createForeignExchangeSalesBuy(payload: IForeignExchangeSalesBuy) {
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

      _cleanForeignExchangeSalesBuysData() {
        this.foreign_exchange_sales_detail = null
        this.foreign_exchange_sales_list = []
        this.foreign_exchange_sales_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.foreign_exchange_sales = initialState().foreign_exchange_sales
      },
      async _getForeignExchangeSalesBuy(id: number) {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.foreign_exchange_sales_detail = response.data
                .data as IForeignExchangeSalesView
            }
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

      async _updateForeignExchangeSalesBuy(
        id: number,
        payload: IForeignExchangeSalesBuy
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/${id}`, payload)
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

      async _updateForeignExchangeSalesBuyStatus(id: number) {
        let success = false

        await executeApi()
          .patch(`${URL_PATH}/${id}/toggle-status`)
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
