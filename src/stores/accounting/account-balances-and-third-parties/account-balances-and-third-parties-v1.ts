import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

import { useUtils, useAlert, useShowError } from '@/composables'

import { IAccountBalanceAndThirdParties } from '@/interfaces/customs'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTING}/balances`

export const useAccountBalancesAndThirdPartiesStoreV1 = defineStore(
  'account-balances-and-third-parties-store-v1',
  {
    state: () => ({
      version: 'v1',
      account_balances_list: [] as IAccountBalanceAndThirdParties[],
      account_balances_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}/get-balances`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.account_balances_list = items.map(
              (item: IAccountBalanceAndThirdParties) => ({
                ...item,
              })
            )
            this.account_balances_pages.currentPage = current_page
            this.account_balances_pages.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getBalanceAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/get-account-structure/${id}`)
          .then((response) => {
            if (response.data.success) {
              return response.data.data
            }

            showAlert(
              response.data.message || 'Error al obtener el balance',
              'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _exportExcelAction(params: string) {
        await executeApi()
          .get(`${URL_PATH}/export?${params}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Archivo generado correctamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.account_balances_list = []
        this.account_balances_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
