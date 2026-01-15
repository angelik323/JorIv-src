// Pinia - api
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import { ISecondAuthorizationActionsPayload } from '@/interfaces/customs/accounts-payable/SecondAuthorization'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

//Composables
import { useAlert, useShowError, useUtils } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/orpa-authorization`

export const useSecondAuthorizationStoreV1 = defineStore(
  'second-authorization-store-v1',
  {
    actions: {
      async _getSecondAuthorizationList(
        params: Record<string, string | number | null>,
        showMessage: boolean
      ) {
        return await executeApi()
          .get(`${URL_PATH}`, {
            params: { ...params, paginate: 1, order_by: 'id,desc' },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            if (showMessage) {
              showAlert(
                message,
                success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }

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

      async _downloadPdfPaymentRequest(payment_request_id: number) {
        await executeApi()
          .get(`${URL_PATH}/${payment_request_id}/download-pdf`, {
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

      async _executeAuthorizationAction(
        payload: ISecondAuthorizationActionsPayload,
        action: 'authorize' | 'reject' | 'return'
      ) {
        return await executeApi()
          .post(`${URL_PATH}/actions/${action}`, payload)
          .then((response) => {
            const { data, message, success } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return data
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _getSecondAuthorizationById(id: number) {
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

      async _getSecondAuthorizationInstructionBeneficiaries(
        instruction_id: number
      ) {
        return await executeApi()
          .get(`${URL_PATH}/instructions/${instruction_id}/beneficiaries`)
          .then((response) => {
            const { data, message, success } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            if (success) {
              return {
                list: data,
              }
            }

            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
