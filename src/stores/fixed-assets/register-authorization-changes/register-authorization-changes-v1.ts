// Vue - Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'

// Interfaces
import {
  INoveltyDetail,
  ICreateNoveltyPayload,
  IFileSignedValidatePayload,
  IFileSignedPayload,
  INoveltyDocumentDownloadResponse,
} from '@/interfaces/customs/fixed-assets/v1/Register-Authorization-Changes'
import { IVoucherDetail } from '@/interfaces/customs'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FIXED_ASSETS, URL_PATH_ACCOUNTING } from '@/constants/apis'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()
const URL_PATH = `${URL_PATH_FIXED_ASSETS}/authorized-fixed-assets`

export const useFixedAssetsNoveltiesStoreV1 = defineStore(
  'fixed-assets-novelties-v1',
  {
    state: () => ({
      version: 'v1' as const,
      group_token: undefined as string | undefined,
    }),

    actions: {
      async _listAction(params?: Record<string, string | number | boolean>) {
        return executeApi()
          .get(URL_PATH, {
            params: {
              paginate: true,
              ...params,
            },
          })
          .then((response) => {
            const { success, data, message } = response.data

            if (success) {
              return data
            }

            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      // get
      async _getAction(id: number | string) {
        return executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { success, data, message } = response.data

            if (success) {
              return data as INoveltyDetail
            }

            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      // create
      async _createAction(payload: ICreateNoveltyPayload) {
        return executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            const { success, message } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },

      //file signed
      async _fileSignedAction(payload: IFileSignedPayload) {
        return executeApi()
          .post(`${URL_PATH}/file-signed`, payload)
          .then((response) => {
            const { success, data, message } = response.data

            if (success) {
              return data
            }

            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      //file signed validate
      async _fileSignedValidateAction(payload: IFileSignedValidatePayload) {
        return executeApi()
          .post(`${URL_PATH}/file-signed-validate`, payload)
          .then((response) => {
            const { success, message } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },
      // update
      async _updateAction(id: number | string, payload: ICreateNoveltyPayload) {
        return executeApi()
          .put(`${URL_PATH}/update/${id}`, payload)
          .then((response) => {
            const { success, message } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },
      // authorized
      async _authorizeAction(assetNoveltyId: number | string) {
        return executeApi()
          .post(`${URL_PATH}/${assetNoveltyId}/authorized`)
          .then((response) => {
            const { success, message } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },
      // cancel
      async _cancelAction(assetNoveltyId: number | string) {
        return executeApi()
          .post(`${URL_PATH}/${assetNoveltyId}/cancel`)
          .then((response) => {
            const { success, message } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },
      // get document download url
      async _getNoveltyDocumentDownloadUrl(documentId: number | string) {
        return executeApi()
          .get(`${URL_PATH}/${documentId}/download-url`)
          .then((response) => {
            const { success, data, message } = response.data

            if (success) {
              return data as INoveltyDocumentDownloadResponse
            }

            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      // get voucher (accounting)
      async _getVoucherAction(voucherId: number | string) {
        return executeApi()
          .get(`${URL_PATH_ACCOUNTING}/voucher/${voucherId}/show`)
          .then((response) => {
            const { success, data, message } = response.data

            if (success) {
              return data as IVoucherDetail
            }

            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
    },

    persist: true,
  }
)
