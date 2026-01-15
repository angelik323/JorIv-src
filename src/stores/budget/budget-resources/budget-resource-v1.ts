// Core - Pinia - API
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'
// Composables
import { useAlert, useShowError, useUtils } from '@/composables'
// Interfaces & types
import {
  IBudgetResourceType,
  IResourceBudget,
  IResourceBudgetPayload,
} from '@/interfaces/customs/budget/ResourceBudget'

const URL_PATH = `${URL_PATH_BUDGET}/budget-resources`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBudgetResourceStore = defineStore('budget-resource-store-v1', {
  state: () => ({
    version: 'v1',
    resource_type_list: [] as IBudgetResourceType[],
    resource_type_pages: {
      currentPage: 1,
      lastPage: 1,
    },
    selected_type_resource: null as IBudgetResourceType | null,
    resources_list: [] as IResourceBudget[],
    resources_pages: {
      currentPage: 1,
      lastPage: 1,
    },
  }),

  actions: {
    _clearData() {
      this.resources_list = []
      this.resources_pages = {
        currentPage: 1,
        lastPage: 1,
      }
    },

    async _listAction(params: Record<string, string | number>) {
      this._clearData()
      await executeApi()
        .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
        .then((response) => {
          const {
            data: { data = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.resources_list = data as IResourceBudget[]
          this.resources_pages.currentPage = current_page
          this.resources_pages.lastPage = last_page

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

    async _createAction(payload: IResourceBudgetPayload) {
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

    async _updateAction(payload: IResourceBudgetPayload) {
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
      return await executeApi()
        .get(`${URL_PATH}/${id}`)
        .then((response) => {
          if (!response.data.success || !response.data.data) {
            showAlert(response.data.message, 'error', undefined, TIMEOUT_ALERT)
            return null
          }
          showAlert(response.data.message, 'success', undefined, TIMEOUT_ALERT)
          return response.data.data
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },
  },
})
