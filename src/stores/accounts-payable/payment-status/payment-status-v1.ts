// Core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constantes
import { IErrors } from '@/interfaces/global'
import {
  IPaymentStatusItem,
  IPaymentStatusDetailItem,
} from '@/interfaces/customs/accounts-payable/PaymentStatus'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// Prepare Composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePaymentStatusStoreV1 = defineStore('payment-status-store-v1', {
  state: () => ({}),

  actions: {
    async _getPaymentStatusList(params: Record<string, string | number>) {
      const responseData = {
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
        data: [] as IPaymentStatusItem[],
      }

      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-status`, {
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

    async _getPaymentStatusById(id: number) {
      let responseData: IPaymentStatusDetailItem = {
        id: null,
        request_number: '',
        status_id: null,
        status: '',
        status_history: [],
      }

      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-status/${id}`)
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
  },
})
