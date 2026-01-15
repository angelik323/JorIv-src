import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import { useAlert, useShowError, useUtils } from '@/composables'

import { IBulkUploadHistory, IBulkUploadPayload } from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/treasury-bulk-uploads`
const URL_PATH_HISTORY = `${URL_PATH_TREASURIES}/treasury-bulk-uploads-history`

export const useBulkUploadStoreV1 = defineStore('bulk-upload-store-v1', {
  state: () => ({
    version: 'v1',
    bulk_upload_list: [] as IBulkUploadHistory[],
    bulk_record_list: [] as IBulkUploadHistory[],
    bulk_upload_history_list: [] as IBulkUploadHistory[],
    bulk_record_pages: {
      currentPage: 1,
      lastPage: 1,
    },
    bulk_upload_history_pages: {
      currentPage: 1,
      lastPage: 1,
    },
  }),
  actions: {
    async _listRecordAction(
      id: number,
      params: Record<string, string | number>
    ) {
      this._clearDataRecord()

      await executeApi()
        .get(`${URL_PATH}/${id}/records`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.bulk_record_list = items.map((item: IBulkUploadHistory) => ({
            ...item,
          }))
          this.bulk_record_pages.currentPage = current_page
          this.bulk_record_pages.lastPage = last_page

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

    async _showAction(bulkUploadId: number, recordId: number) {
      return await executeApi()
        .get(`${URL_PATH}/${bulkUploadId}/records/${recordId}`)
        .then((response) => {
          if (response.data.success) return response.data.data

          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
          return null
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    async _createAction(payload: IBulkUploadPayload) {
      this._clearDataBulkUpload()

      const formData = new FormData()

      for (const key in payload) {
        if (key !== 'file') {
          const value = payload[key as keyof typeof payload]
          if (value !== null && value !== undefined) {
            if (typeof value === 'object') {
              formData.append(key, JSON.stringify(value))
            } else {
              formData.append(key, String(value))
            }
          }
        }
      }

      if (payload.file instanceof File) {
        formData.append('file', payload.file, payload.file.name)
      }

      await executeApi()
        .post(`${URL_PATH}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          const data = response.data

          if (response.data.success) {
            const result = data.data
            this.bulk_upload_list = Array.isArray(result) ? result : [result]
          }

          return showAlert(
            data.message,
            data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _deleteAction(id: number) {
      let success = false

      await executeApi()
        .delete(`${URL_PATH}/${id}`)
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

    async _getCsvStructureAction(operation_type: string) {
      await executeApi()
        .get(`${URL_PATH}/csv-structure?operation_type=${operation_type}`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'] || 'text/csv;charset=utf-8',
          })
          const fileName = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, fileName)

          return showAlert(
            'Archivo CSV descargado correctamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getErrorsLogAction(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}/errors-log`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type:
              response.headers['content-type'] || 'text/plain;charset=utf-8',
          })

          const fileName =
            useUtils().getNameBlob(response) || `errores_${id}.txt`

          useUtils().downloadBlobXlxx(blob, fileName)

          return showAlert(
            'Archivo TXT descargado correctamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _listHistoryAction(params: Record<string, string | number | null>) {
      this._clearDataHistory()

      await executeApi()
        .get(`${URL_PATH_HISTORY}`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.bulk_upload_history_list = items.map(
            (item: IBulkUploadHistory) => ({
              ...item,
            })
          )
          this.bulk_upload_history_pages.currentPage = current_page
          this.bulk_upload_history_pages.lastPage = last_page

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

    async _deleteHistoryAction(id: number) {
      let success = false

      await executeApi()
        .delete(`${URL_PATH_HISTORY}/${id}`)
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

    async _getValidateErrorsAction(id: number) {
      await executeApi()
        .post(`${URL_PATH_HISTORY}/${id}/validate-errors`)
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

    async _getErrorsLogHistoryAction(id: number) {
      await executeApi()
        .get(`${URL_PATH_HISTORY}/${id}/errors-log`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type:
              response.headers['content-type'] || 'text/plain;charset=utf-8',
          })

          const fileName =
            useUtils().getNameBlob(response) || `errores_${id}.txt`

          useUtils().downloadBlobXlxx(blob, fileName)

          return showAlert(
            'Archivo TXT descargado correctamente',
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch(async (e) => {
          const error = e as IErrors
          const data = error.response?.data

          const message =
            data instanceof Blob
              ? JSON.parse(await data.text())?.message ??
                'Error desconocido al generar el log de errores'
              : showCatchError(error)

          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    _clearDataBulkUpload() {
      this.bulk_upload_list = []
    },

    _clearDataRecord() {
      this.bulk_record_list = []
      this.bulk_record_pages = {
        currentPage: 1,
        lastPage: 1,
      }
    },

    _clearDataHistory() {
      this.bulk_upload_history_list = []
      this.bulk_upload_history_pages = {
        currentPage: 1,
        lastPage: 1,
      }
    },
  },
})
