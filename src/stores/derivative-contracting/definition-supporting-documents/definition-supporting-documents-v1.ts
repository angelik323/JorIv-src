import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import {
  IDefinitionSupportingDocumentsForm,
  IDefinitionSupportingDocumentsList,
  IDefinitionSupportingDocumentsResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'

const URL_PATH_DEFINITION_DOCUMENTS = `${URL_PATH_DERIVATIVE_CONTRACTING}/definition-documentation`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useDefinitionSupportingDocumentsStoreV1 = defineStore(
  'definition-supporting-documents-store-v1',
  {
    state: () => ({
      version: 'v1',
      definition_documents_list: [] as IDefinitionSupportingDocumentsList[],
      definition_documents_response:
        null as IDefinitionSupportingDocumentsResponse | null,
      definition_documents_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getDefinitionDocumentsList(
        params: Record<string, string | number>
      ) {
        this._clearData()

        await executeApi()
          .get(URL_PATH_DEFINITION_DOCUMENTS, {
            params: { ...params, paginate: true },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.definition_documents_list = items
            this.definition_documents_pages.currentPage = current_page
            this.definition_documents_pages.lastPage = last_page

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
      },

      async _getByIdDefinitionDocuments(id: number) {
        await executeApi()
          .get(`${URL_PATH_DEFINITION_DOCUMENTS}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.definition_documents_response = { ...responseData }
            }

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
      },

      async _createDefinitionDocuments(
        data: Partial<IDefinitionSupportingDocumentsForm>
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_DEFINITION_DOCUMENTS}`, data)
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

      async _updateDefinitionDocuments(
        data: Partial<IDefinitionSupportingDocumentsForm>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH_DEFINITION_DOCUMENTS}/${id}`, data)
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

      async _deleteDefinitionDocuments(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH_DEFINITION_DOCUMENTS}/${id}`)
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

      async _changeStatus(id: number) {
        let success = false

        await executeApi()
          .patch(`${URL_PATH_DEFINITION_DOCUMENTS}/${id}`)
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
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      _clearData() {
        this.definition_documents_list = []
        this.definition_documents_response = null
        this.definition_documents_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
