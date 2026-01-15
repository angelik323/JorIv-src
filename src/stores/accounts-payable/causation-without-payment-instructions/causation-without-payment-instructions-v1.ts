// Pinia - api
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - constants
import { ICausationWithoutPaymentInstructionsPayload } from '@/interfaces/customs/accounts-payable/CausationWithoutPaymentInstructions'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

//Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { useUtils } from '@/composables/useUtils'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/causation-without-instructions`

export const useCausationWithoutPaymentInstructionsStoreV1 = defineStore(
  'causation-without-payment-instructions-store-v1',
  {
    actions: {
      async _getCausationWithoutPaymentInstructionsList(
        params: Record<string, string | number | null>
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
          })
      },

      async _confirmCausationWithoutPaymentInstruction(
        payload: ICausationWithoutPaymentInstructionsPayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/confirm`, payload)
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

      async _downloadExcelCausationWithoutPaymentInstructions(
        params: Record<string, string | number | null>
      ) {
        await executeApi()
          .get(`${URL_PATH}/export`, {
            params,
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
    },
  }
)
