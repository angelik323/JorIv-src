// Pinia - Api
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

//Interfaces - Constants
import {
  IPaymentAuthorizersCreateBulkPayload,
  IPaymentAuthorizersForm,
} from '@/interfaces/customs/accounts-payable/PaymentAuthorizers'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

//Composables
import { useAlert, useShowError, useUtils } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/payment-autorizers`

export const usePaymentAuthorizersStoreV1 = defineStore(
  'payment-authorizers-v1-store-v1',
  {
    state: () => ({}),

    actions: {
      async _getPaymentAuthorizersList(
        params: Record<string, string | number | null>
      ) {
        return await executeApi()
          .get(`${URL_PATH}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            if (success) {
              return {
                list: items,
                pages: {
                  currentPage: current_page,
                  lastPage: last_page,
                },
              }
            }
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createPaymentAuthorizers(payload: IPaymentAuthorizersForm) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
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

      async _getPaymentAuthorizersById(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              return data
            }

            showAlert(
              message,
              success ? 'success' : 'error',
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

      async _updatePaymentAuthorizers(
        payload: IPaymentAuthorizersForm,
        id: number
      ) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${id}`, payload)
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

      async _downloadExcelPaymentAuthorizersTemplate() {
        await executeApi()
          .get(`${URL_PATH}/import/template`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _validatePaymentAuthorizersFile(file: File) {
        const formData = new FormData()
        formData.append('file', file)

        return await executeApi()
          .post(`${URL_PATH}/import/analyze`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            const { data } = response.data
            return data
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _downloadExcelFileValidationErrors(batch_id: string) {
        await executeApi()
          .get(`${URL_PATH}/import/errors/${batch_id}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createPaymentAuthorizersBulk(
        payload: IPaymentAuthorizersCreateBulkPayload
      ) {
        return await executeApi()
          .post(`${URL_PATH}/import`, payload)
          .then((response) => {
            const { data } = response.data
            return data
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _deletePaymentAuthorizers(id: number) {
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
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },
    },
  }
)
