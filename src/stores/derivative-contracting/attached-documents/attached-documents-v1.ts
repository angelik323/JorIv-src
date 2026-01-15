import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT } from '@/constants/apis'
import { defineStore } from 'pinia'
import { useAlert, useShowError } from '@/composables'
import {
  IAttachedDocumentsList,
  IAttachedDocumentForm,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAttachedDocumentsStoreV1 = defineStore(
  'attached-documents-store-v1',
  {
    state: () => ({
      version: 'v1',
      attached_documents_list: [] as IAttachedDocumentsList[],
      attached_documents_response: null as IAttachedDocumentForm | null,
      attached_documents_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      /**
       * Obtener lista de documentos anexos
       * @param params - Parámetros de filtrado (ej: 'page=1&search=test')
       */
      async _getAttachedDocuments(params: Record<string, string | number>) {
        this.attached_documents_list = []
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.attached_documents_list = items.map(
              (item: IAttachedDocumentsList) => ({
                ...item,
              })
            )
            this.attached_documents_pages.currentPage = current_page
            this.attached_documents_pages.lastPage = last_page

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

      /**
       * Obtener un documento anexo por ID
       * @param id - ID del documento anexo
       */
      async _getAttachedDocumentById(id: number) {
        await executeApi()
          .get(`${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.attached_documents_response = response.data.data
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      /**
       * Crear un nuevo documento anexo
       * @param payload - Datos del documento anexo (code, name_attached_document, stage)
       * @returns boolean - true si fue exitoso
       */
      async _createAttachedDocument(payload: IAttachedDocumentForm) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}`, payload)
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

      /**
       * Actualizar un documento anexo
       * @param id - ID del documento anexo
       * @param payload - Datos actualizados
       * @returns boolean - true si fue exitoso
       */
      async _updateAttachedDocument(
        id: number,
        payload: IAttachedDocumentForm
      ) {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/${id}`,
            payload
          )
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

      /**
       * Cambiar estado de un documento anexo
       * @param id - ID del documento anexo
       * @param status_id - Nuevo estado
       */
      async _changeStatus(id: number, status: string) {
        await executeApi()
          .patch(
            `${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/${id}/${status}`
          )
          .then((response) => {
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

      /**
       * Eliminar un documento anexo
       * @param id - ID del documento anexo
       */
      async _deleteAttachedDocument(id: number) {
        await executeApi()
          .delete(`${URL_PATH_DERIVATIVE_CONTRACTING_ATTACHED_DOCUMENT}/${id}`)
          .then((response) => {
            //this._getAttachedDocuments('')
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

      /**
       * Establecer datos del formulario de información
       * @param data - Datos del formulario o null para limpiar
       */
      _setDataInformationForm(data: IAttachedDocumentForm | null) {
        this.attached_documents_response = data ? { ...data } : null
      },

      _clearData() {
        this.attached_documents_list = []
        this.attached_documents_pages.currentPage = 0
        this.attached_documents_pages.lastPage = 0
      },
    },
  }
)
