// core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import { IErrors } from '@/interfaces/global'
import {
  IPaymentInstructionsForm,
  IPaymentInstructionsItem,
  IPaymentInstructionsPayload,
} from '@/interfaces/customs/accounts-payable/PaymentInstructions'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// prepare composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePaymentInstructionsStoreV1 = defineStore(
  'payment-instructions-store-v1',
  {
    state: () => ({
      total_value: 0 as number | string,
      iva_value: 0 as number | string,
      business_id: 0 as number,
      supplier_id: 0 as number,
      basic_data_id: 0 as number,
      authorized_payment: false as boolean,
    }),

    actions: {
      async _getPaymentInstructionsList(
        params: Record<string, string | number>
      ) {
        const responseData = {
          pages: {
            currentPage: 1,
            lastPage: 1,
          },
          data: [] as IPaymentInstructionsItem[],
        }

        await executeApi()
          .get(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-instructions`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            responseData.data = items
            responseData.pages = {
              currentPage: current_page,
              lastPage: last_page,
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

        return responseData
      },

      async _getPaymentInstructionsById(id: number) {
        let responseData: IPaymentInstructionsForm | null = null
        await executeApi()
          .get(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-instructions/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              responseData = data
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
        return responseData
      },

      async _updatePaymentInstructions(
        payload: IPaymentInstructionsPayload,
        id: number
      ) {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_ACCOUNTS_PAYABLE}/payment-instructions/${id}`,
            payload
          )
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
    },
  }
)
