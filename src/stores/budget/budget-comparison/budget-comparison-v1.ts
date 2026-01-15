// Core - Pinia - API
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
// Composables
import { useAlert, useShowError, useUtils } from '@/composables'
// Interfaces & types
import { IBudgetComparisonList } from '@/interfaces/customs/budget/BudgetComparison'

const URL_PATH = `${URL_PATH_BUDGET}/budget-comparison`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBudgetComparisonStoreV1 = defineStore(
  'budget-comparison-store-v1',
  {
    state: () => ({
      version: 'v1',
      budget_comparison_list: [] as IBudgetComparisonList[],
      budget_comparison_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      _clearData() {
        this.budget_comparison_list = []
        this.budget_comparison_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      async _listAction(params: string) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH}/list?${params}`)
          .then((response) => {
            const { data: data = [], message, success } = response.data
            this.budget_comparison_list = data.map(
              (item: IBudgetComparisonList, index: number) => ({
                ...item,
                _row_number: index + 1,
              })
            )

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

      async _downloadExcelAction(query: string) {
        await executeApi()
          .get(`${URL_PATH}/export-excel?${query}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              response.data.message || 'La descarga comenzará pronto',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadPdfAction(query: string) {
        await executeApi()
          .get(`${URL_PATH}/export-pdf?${query}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              response.data.message || 'La descarga comenzará pronto',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
