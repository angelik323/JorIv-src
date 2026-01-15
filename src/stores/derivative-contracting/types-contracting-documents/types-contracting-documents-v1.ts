// Vue - Pinia - Router - Quasar
import { defineStore } from 'pinia'

// Composables
import { useAlert, useShowError } from '@/composables'

// Interfaces
import { IErrors } from '@/interfaces/global'
import {
  ITypesContractingDocumentsList,
  ITypesContractingDocumentsRequest,
} from '@/interfaces/customs'

// Constantes
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'

// APIs
import { executeApi } from '@/apis'

const URL_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/type-contracts`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTypesContractingDocumentsStoreV1 = defineStore(
  'types-contracting-documents-store-v1',
  {
    state: () => ({
      types_contracting_documents_list: [] as ITypesContractingDocumentsList[],
      types_contracting_documents_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
    }),

    actions: {
      async _getListAction(params: string) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            const {
              data: {
                data: items = [],
                current_page = 0,
                last_page = 0,
                total = 0,
                per_page = 0,
              },
            } = response.data

            this.types_contracting_documents_list = items
            this.types_contracting_documents_pages = {
              currentPage: current_page,
              lastPage: last_page,
              total_items: total,
              per_page: per_page,
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getByIdAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              return responseData
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })

        return null
      },

      async _createAction(data: ITypesContractingDocumentsRequest) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}`, data)
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

      async _updateAction(data: ITypesContractingDocumentsRequest, id: number) {
        let success = false

        await executeApi()
          .patch(`${URL_PATH}/${id}`, data)
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

      async _updateStatusAction(id: number, status: number) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/change-status/${id}/?status_id=${status}`)
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

      async _deleteAction(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/${id}`)
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

      _clearData() {
        this.types_contracting_documents_list = []
        this.types_contracting_documents_pages = {
          currentPage: 0,
          lastPage: 0,
          total_items: 0,
          per_page: 0,
        }
      },
    },
  }
)
