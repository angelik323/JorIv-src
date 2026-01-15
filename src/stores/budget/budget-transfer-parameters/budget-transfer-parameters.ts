import { useAlert, useShowError, useUtils } from '@/composables'
import {
  IBudgetTransferAPIResponse,
  IBudgetTransferListItem,
} from '@/interfaces/customs/budget/BudgetTransferParameter'
import { IErrors } from '@/interfaces/global/errorMessage'
import { defineStore } from 'pinia'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { executeApi } from '@/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_BUDGET}/business-transfer-parameters`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBudgetTransferStoreV1 = defineStore(
  'budget-transfer-store-v1',
  {
    state: () => ({
      version: 'v1',
      budget_transfer_list: [] as IBudgetTransferListItem[],
      budget_transfer_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      budget_transfer: null as IBudgetTransferAPIResponse | null,
    }),

    actions: {
      _cleanData() {
        this.budget_transfer_list = []
        this.budget_transfer_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.budget_transfer = null
      },

      async _getBudgetTransferList(params: string) {
        const query = params ? `&${params}` : ''
        this._cleanData()
        await executeApi()
          .get(`${URL_PATH}/list?paginate=1${query}`)
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.budget_transfer_list = items
            this.budget_transfer_pages.currentPage = current_page
            this.budget_transfer_pages.lastPage = last_page

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

      async _createBudgetTransfer(payload: unknown) {
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

      async _getBudgetTransferById(id: number) {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/show/${id}`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.budget_transfer = response.data.data
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

      async _updateBudgetTransfer(id: number, payload: unknown) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/update/${id}`, payload)
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

      async _deleteBudgetTransfer(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH}/destroy/${id}`)
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

      async _downloadBudgetTransferList(query: string) {
        const url = query ? `${URL_PATH}/export?${query}` : `${URL_PATH}/export`
        await executeApi()
          .get(url, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
    persist: true,
  }
)
