import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import {
  ICancellationRejectionReasonsForm,
  ICancellationRejectionReasonsItem,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/cancellation-rejection-reasons`

export const useCancellationRejectionReasonsStoreV1 = defineStore(
  'cancellation-rejection-reasons-store-v1',
  {
    state: () => ({
      cancellation_rejection_reasons_list:
        [] as ICancellationRejectionReasonsItem[],
      cancellation_rejection_reasons_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      cancellation_rejection_reasons_form:
        null as ICancellationRejectionReasonsForm | null,
      cancellation_rejection_reasons_response:
        null as ICancellationRejectionReasonsItem | null,
    }),

    actions: {
      async _getCancellationRejectionReasonsList(
        params: Record<string, string | number | null>
      ) {
        await executeApi()
          .get(`${URL_PATH}`, {
            params: { ...params, paginate: 1, order_by: 'id,desc' },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.cancellation_rejection_reasons_list = items

            this.cancellation_rejection_reasons_pages = {
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
      async _createCancellationRejectionReasons(
        payload: ICancellationRejectionReasonsForm
      ) {
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

      async _getCancellationRejectionReasonsById(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.cancellation_rejection_reasons_response = data
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

      async _updateCancellationRejectionReasons(
        payload: ICancellationRejectionReasonsForm,
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

      async _deleteCancellationRejectionReasons(id: number) {
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

      _setFormData(data: ICancellationRejectionReasonsForm | null) {
        this.cancellation_rejection_reasons_form = data ? { ...data } : null
      },
    },
  }
)
