// Vue - pinia
import { defineStore } from 'pinia'

import { executeApi } from '@/apis'

// Interfaces
import {
  IMassConsultationImportPayload,
  IMassConsultationImportResponse,
  IFileUploadStatus,
} from '@/interfaces/customs/sarlaft/CautelarListsMassQuery'

// Composables
import { useAlert, useShowError } from '@/composables'
import { useUtils } from '@/composables/useUtils'

// Constants
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_SARLAFT}/prevention-list`

const useMassConsultationPrecautionaryListsStoreV1 = defineStore(
  'mass-consultation-precautionary-lists-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _downloadTemplate() {
        let responseBlob: Blob | null = null

        await executeApi()
          .get(`${URL_PATH}/download-template`, {
            responseType: 'blob',
          })
          .then((response) => {
            responseBlob = response.data
            const fileName = useUtils().getNameBlob(response)

            useUtils().createAndDownloadBlobByArrayBuffer(
              response.data,
              fileName
            )
            showAlert(
              'Plantilla descargada exitosamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return responseBlob
      },

      async _uploadMassFile(
        payload: IMassConsultationImportPayload
      ): Promise<IMassConsultationImportResponse | null> {
        let responseData: IMassConsultationImportResponse | null = null
        const body = { ...payload, list_name: '' }
        await executeApi()
          .post(`${URL_PATH}/consult-listings/mass-file`, body, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
          .then((response) => {
            const { data, message } = response?.data || {}

            responseData = data ?? null

            showAlert(message, 'success', undefined, TIMEOUT_ALERT)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return responseData
      },

      async _checkFileUploadStatus(
        id: string
      ): Promise<IFileUploadStatus | null> {
        let responseData: IFileUploadStatus | null = null

        await executeApi()
          .get(`${URL_PATH}/upload-file/check-file-upload-status/${id}`)
          .then((response) => {
            const { data } = response?.data || {}

            responseData = data ?? null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return responseData
      },

      async _downloadMatches(id: string) {
        let responseBlob: Blob | null = null

        await executeApi()
          .get(`${URL_PATH}/upload-file/${id}/download-matches`, {
            responseType: 'blob',
          })
          .then((response) => {
            responseBlob = response.data
            const fileName = useUtils().getNameBlob(response)

            useUtils().createAndDownloadBlobByArrayBuffer(
              response.data,
              fileName
            )
            showAlert(
              'Archivo de coincidencias descargado exitosamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return responseBlob
      },

      async _downloadErrors(id: string) {
        let responseBlob: Blob | null = null

        await executeApi()
          .get(`${URL_PATH}/download-errors/${id}`, {
            responseType: 'blob',
          })
          .then((response) => {
            responseBlob = response.data
            const fileName = useUtils().getNameBlob(response)

            useUtils().createAndDownloadBlobByArrayBuffer(
              response.data,
              fileName
            )
            showAlert(
              'Archivo de errores descargado exitosamente',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return responseBlob
      },
    },
  }
)

export default useMassConsultationPrecautionaryListsStoreV1
