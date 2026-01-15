// Core - Pinia - API
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'
// Composables
import { useAlert, useShowError, useUtils } from '@/composables'
// Interfaces & types
import { IBudgetResourceType } from '@/interfaces/customs/budget/ResourceBudget'

const URL_PATH = `${URL_PATH_BUDGET}/budget-resource-type-resource`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBudgetResourceTypeStore = defineStore(
  'budget-resource-type-store-v1',
  {
    state: () => ({
      version: 'v1',
      resource_type_list: [] as IBudgetResourceType[],
      resource_type_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      selected_type_resource: null as IBudgetResourceType | null,
      resources_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      _clearData() {
        this.resource_type_list = []
        this.resource_type_pages = {
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

            this.resource_type_list = data.map((item: IBudgetResourceType) => ({
              ...item,
            }))
            this.resource_type_pages.currentPage = current_page
            this.resource_type_pages.lastPage = last_page

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

      async _createAction(payload: IBudgetResourceType) {
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

      async _updateAction(payload: Partial<IBudgetResourceType>) {
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

      async _deleteAction(id: string) {
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

      async _downloadExcelAction(params: Record<string, string | number>) {
        await executeApi()
          .post(`${URL_PATH}/export`, null, {
            responseType: 'blob',
            params: params,
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
              this.selected_type_resource = response.data.data
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

      _setSelectTypeResource(item: IBudgetResourceType) {
        this.selected_type_resource = item
      },
    },
  }
)
