// Core - Pinia - API
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
// Composables
import { useAlert, useShowError, useUtils } from '@/composables'
// Interfaces & types
import { IClosureValidation, IClosureValidationForm } from '@/interfaces/customs/budget/ClosureValidations'

const URL_PATH = `${URL_PATH_BUDGET}/budget-closing-validations`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useClosureValidationsStoreV1 = defineStore(
  'closure-validations-store-v1',
  {
    state: () => ({
      version: 'v1',
      closure_validations_list: [] as IClosureValidation[],
      closure_validations_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      selected_closure_validation: null as IClosureValidation | null,
    }),

    actions: {
      _clearData() {
        this.closure_validations_list = []
        this.closure_validations_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      async _listAction(params: string) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH}/list?${params}`)
          .then((response) => {
            const {
              data: { data = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data
            this.closure_validations_list = data.map((item: IClosureValidation) => ({
              ...item,
            }))
            this.closure_validations_pages.currentPage = current_page
            this.closure_validations_pages.lastPage = last_page

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

      async _createAction(payload: IClosureValidationForm) {
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

      async _updateAction(
        payload: Partial<IClosureValidationForm>
      ) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/update/${payload.id}`, payload)
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
          .delete(`${URL_PATH}/destroy/${id}`)
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

      async _getByClosureValidationId(id: string) {
        await executeApi()
          .get(`${URL_PATH}/show/${id}`)
          .then((response) => {
            if (response.data.success) {
              const item = response.data.data
              // Mapear la estructura anidada del backend a la estructura plana del frontend
              this.selected_closure_validation = {
                ...item,
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
    },
  }
)

