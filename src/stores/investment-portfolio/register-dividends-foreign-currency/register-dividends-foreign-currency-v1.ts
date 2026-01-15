import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import { IEmitterDividend } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/foreign-currency-shar`

export const useRegisterDividendsForeignCurrencyStoreV1 = defineStore(
  'register-dividends-foreign-currency-store-v1',
  {
    state: () => ({
      version: 'v1',
      register_dividends_foreign_currency_list: [] as IEmitterDividend[],
      register_dividends_foreign_currency_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: string) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}/list?${params}`)
          .then((response) => {
            const data = response.data

            if (response.data.success) {
              this.register_dividends_foreign_currency_list =
                data.data.data ?? []
              this.register_dividends_foreign_currency_pages.currentPage =
                data.current_page ?? 1
              this.register_dividends_foreign_currency_pages.lastPage =
                data.last_page ?? 1
            }

            return showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _showAction(id: string) {
        return await executeApi()
          .get(`${URL_PATH}/show/${id}`)
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

      async _createAction(payload: IEmitterDividend) {
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

      async _updateAction(id: string, payload: IEmitterDividend) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/update/${id}`, payload)
          .then((response) => {
            success = response.data.success

            return showAlert(
              response.data.message,
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

      async _deleteAction(id: number) {
        await executeApi()
          .delete(`${URL_PATH}/destroy/${id}`)
          .then((response) => {
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

      async _shareAction(payload: {}) {
        return await executeApi()
          .post(`${URL_PATH}/share`, payload)
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

      _clearData() {
        this.register_dividends_foreign_currency_list = []
        this.register_dividends_foreign_currency_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
