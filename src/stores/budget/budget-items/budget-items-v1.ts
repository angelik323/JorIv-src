// Core - Pinia - API
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'
// Composables
import { useAlert, useShowError, useUtils } from '@/composables'
// Interfaces & types
import { IBudgetItemsForm, IBudgetItemRow } from '@/interfaces/customs'

const URL_PATH = `${URL_PATH_BUDGET}/budget-items`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBudgetItemsStoreV1 = defineStore('budget-items-store-v1', {
  state: () => ({
    version: 'v1',
    budget_items_list: [] as IBudgetItemRow[],
    budget_items_pages: {
      currentPage: 1,
      lastPage: 1,
    },
    selected_budget_item: null as IBudgetItemsForm | null,
  }),

  actions: {
    _clearData() {
      this.budget_items_list = []
      this.budget_items_pages = {
        currentPage: 1,
        lastPage: 1,
      }
    },

    async _listAction(params: Record<string, string | number>) {
      this._clearData()
      await executeApi()
        .get(`${URL_PATH}`, { params: { ...params } })
        .then((response) => {
          const {
            data: { data = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.budget_items_list = data.map((item: IBudgetItemRow) => ({
            ...item,
          }))
          this.budget_items_pages.currentPage = current_page
          this.budget_items_pages.lastPage = last_page

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

    async _createAction(payload: IBudgetItemsForm) {
      let success = false
      await executeApi()
        .post(`${URL_PATH}`, payload)
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

    async _updateAction(payload: Partial<IBudgetItemsForm>) {
      let success = false
      await executeApi()
        .put(`${URL_PATH}/${payload.id}`, payload)
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

    async _deleteAction(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .delete(`${URL_PATH}/${id}`)
        .then((response) => {
          success = response.data.success
          showAlert(
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

    async _downloadExcelAction(query: string) {
      await executeApi()
        .post(`${URL_PATH}/export?${query}`, null, {
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

    async _showAction(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}`)
        .then((response) => {
          if (response.data.success) {
            const {
              budget_structure,
              resource_structure,
              accounting_structure,
              ...rest
            } = response.data.data
            this.selected_budget_item = {
              ...rest,
              budget_structure_id: budget_structure?.id,
              resource_structure_id: resource_structure?.id,
              accounting_structure_id: accounting_structure?.id,
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

    _setSelectBudgetItem(item: IBudgetItemsForm) {
      this.selected_budget_item = item
    },
  },
})
