import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import {
  IAnnualPaymentAmountsForm,
  IAnnualPaymentAmountsItem,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/annual-payment-amounts`

export const useAnnualPaymentAmountsStoreV1 = defineStore(
  'annual-payment-amounts-store-v1',
  {
    state: () => ({
      annual_payment_amounts_list: [] as IAnnualPaymentAmountsItem[],
      annual_payment_amounts_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _getAnnualPaymentAmountsList(
        params: Record<string, string | number | null>
      ) {
        await executeApi()
          .get(`${URL_PATH}`, {
            params: { ...params, paginate: 1, order_by: 'year,desc' },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.annual_payment_amounts_list = items

            this.annual_payment_amounts_pages = {
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
      },
      async _createAnnualPaymentAmounts(payload: IAnnualPaymentAmountsForm) {
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
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _getAnnualPaymentAmountsById(
        id: number
      ): Promise<IAnnualPaymentAmountsForm | null> {
        let annual_payment_response = null
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              annual_payment_response = data
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
        return annual_payment_response
      },

      async _updateAnnualPaymentAmounts(
        payload: IAnnualPaymentAmountsForm,
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
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _deleteAnnualPaymentAmounts(id: number) {
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
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      _clearData() {
        this.annual_payment_amounts_list = []
        this.annual_payment_amounts_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
