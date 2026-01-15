// Pinia
import { defineStore } from 'pinia'

// APIs
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Interfaces
import {
  ITypeOfDocumentItem,
  ITypeOfDocumentForm,
  ITypeOfDocumentCreatePayload,
} from '@/interfaces/customs/accounts-payable/TypeOfDocuments'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/document-types`

export const useTypeOfDocumentsStoreV1 = defineStore(
  'type-of-documents-store-v1',
  {
    state: () => ({
      type_of_documents_list: [] as ITypeOfDocumentItem[],
      type_of_documents_pages: { currentPage: 1, lastPage: 1 },
      type_of_document_form: null as ITypeOfDocumentForm | null,
      type_of_document_response: null as unknown | null,
    }),

    actions: {
      _setFormData(data: ITypeOfDocumentForm | null) {
        this.type_of_document_form = data ? { ...data } : null
      },

      _clearData() {
        this.type_of_documents_list = []
        this.type_of_documents_pages = { currentPage: 1, lastPage: 1 }
        this.type_of_document_form = null
        this.type_of_document_response = null
      },

      async _getTypeOfDocumentsList(params: Record<string, string | number>) {
        this._clearData()

        const queryParams: Record<string, string | number | boolean> = {
          ...params,
          paginate: true,
        }

        await executeApi()
          .get(URL_PATH, { params: queryParams })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 1, last_page = 1 },
              message,
              success,
            } = response.data as {
              data: { data: unknown[]; current_page: number; last_page: number }
              message?: string
              success?: boolean
            }

            this.type_of_documents_list = items as ITypeOfDocumentItem[]
            this.type_of_documents_pages = {
              currentPage: current_page,
              lastPage: last_page,
            }

            showAlert(
              message ?? 'Listado obtenido exitosamente.',
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e: unknown) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createTypeOfDocument(payload: ITypeOfDocumentCreatePayload) {
        let success = false
        await executeApi()
          .post(URL_PATH, payload)
          .then((response) => {
            const { message, success: ok } = response.data as {
              message?: string
              success?: boolean
            }
            success = !!ok
            showAlert(
              message ??
                (success
                  ? 'Registro creado exitosamente.'
                  : 'No se pudo crear el registro.'),
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e: unknown) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _getTypeOfDocumentById(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data as {
              data: unknown
              message?: string
              success?: boolean
            }

            this.type_of_document_response = data ?? null

            showAlert(
              message ?? 'Registro obtenido exitosamente.',
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e: unknown) => {
            const error = e as IErrors
            const msg = showCatchError(error)
            showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _updateTypeOfDocument(
        payload: ITypeOfDocumentCreatePayload,
        id: number
      ) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${id}`, payload)
          .then((response) => {
            const { message, success: ok } = response.data as {
              message?: string
              success?: boolean
            }
            success = !!ok
            showAlert(
              message ??
                (success
                  ? 'Registro actualizado exitosamente.'
                  : 'No se pudo actualizar el registro.'),
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e: unknown) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _toggleStatusTypeOfDocument(id: number) {
        let success = false
        await executeApi()
          .patch(`${URL_PATH}/${id}/toggle-status`)
          .then((response) => {
            const { message, success: ok } = response.data as {
              message?: string
              success?: boolean
            }
            success = !!ok
            showAlert(
              message ?? (success ? 'OK' : 'Operación no realizada.'),
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e: unknown) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _deleteTypeOfDocument(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH}/${id}`)
          .then((response) => {
            const { message, success: ok } = response.data as {
              message?: string
              success?: boolean
            }
            success = !!ok
            showAlert(
              message ??
                (success
                  ? 'Registro eliminado exitosamente.'
                  : 'No se pudo eliminar el registro.'),
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e: unknown) => {
            const error = e as IErrors
            const msg = showCatchError(error)
            showAlert(msg, 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
    },
  }
)
