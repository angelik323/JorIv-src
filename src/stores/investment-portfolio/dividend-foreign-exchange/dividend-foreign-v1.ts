import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  IDividendLocal,
  IDividendLocalEdit,
  IDividendLocalItem,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/exchange-traded-fund/dividend/foreign`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  dividend_foreign: {} as IDividendLocal,
  dividend_foreign_list: [] as IDividendLocalItem[],
  dividend_foreign_raw: null as IDividendLocalEdit | null,
  dividend_foreign_pages: {
    currentPage: 0,
    lastPage: 0,
  },
})

export const useDividendForeignStoreV1 = defineStore(
  'dividend-foreign-store-v1',
  {
    state: initialState,
    actions: {
      async _getDividendForeignList(params: string) {
        this._cleanDividendForeignData()
        await executeApi()
          .get(`${URL_PATH}/list?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.dividend_foreign_list = response.data?.data?.data ?? []
              this.dividend_foreign_pages = {
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
      async _createDividendForeign(payload: IDividendLocal) {
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

      _cleanDividendForeignData() {
        this.dividend_foreign_list = []
        this.dividend_foreign_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.dividend_foreign = initialState().dividend_foreign
      },
      async _getDividendForeign(id: number) {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/${id}/show`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.dividend_foreign_raw = response.data
                .data as IDividendLocalEdit
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
      async _updateDividendForeign(id: number, payload: IDividendLocal) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/${id}/update`, payload)
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

      async _updateDividendForeignStatus(id: number) {
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
      async _deleteDividendForeign(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/${id}/delete`)
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
