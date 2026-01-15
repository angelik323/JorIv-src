import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ISupportingDocumentItemList,
  ISupportingDocumentForm,
  ISupportingDocumentResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_BILLING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { downloadZipFile } from '@/utils'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useSupportingDocumentsStoreV1 = defineStore(
  'supporting-documents-store-v1',
  {
    state: () => ({
      version: 'v1',
      supporting_documents_list: [] as ISupportingDocumentItemList[],
      supporting_documents_response: null as ISupportingDocumentResponse | null,
      supporting_documents_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getSupportingDocumentsList(
        params: Record<string, string | number>
      ) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_BILLING}/generation-support-document`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.supporting_documents_list = items
            this.supporting_documents_pages.currentPage = current_page
            this.supporting_documents_pages.lastPage = last_page

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

      async _getByIdSupportingDocuments(id: number) {
        await executeApi()
          .get(`${URL_PATH_BILLING}/generation-support-document/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.supporting_documents_response = { ...responseData }
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

      async _createSupportingDocuments(data: Partial<ISupportingDocumentForm>) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_BILLING}/generation-support-document`, data)
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

      async _getDownloadDocuments(id: number) {
        await executeApi()
          .get(
            `${URL_PATH_BILLING}/generation-support-document/${id}/download-zip`,
            { responseType: 'blob' }
          )
          .then((response) => {
            downloadZipFile(response.data, `supporting-document-${id}.zip`)
            showAlert(
              'Archivos descargado exitosamente',
              response.data ? 'success' : 'error',
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

      _clearData() {
        this.supporting_documents_list = []
        this.supporting_documents_response = null
        this.supporting_documents_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
