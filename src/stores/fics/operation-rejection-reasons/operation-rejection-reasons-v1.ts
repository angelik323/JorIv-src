// Vue - Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IRejectionReasonChangeStatus,
  IRejectionReasonResponse,
  IRejectionReasonToCreate,
  IRejectionReasonItemList,
  IRejectionReasonToEdit,
} from '@/interfaces/customs/fics/OperationRejectionReasons'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

export const useOperationRejectionReasonsStoreV1 = defineStore(
  'operation-rejection-reasons-store-v1',
  {
    state: () => ({
      version: 'v1',
      rejection_reasons_list: [] as IRejectionReasonItemList[],
      rejection_reasons_response: null as IRejectionReasonResponse | null,
      rejection_reasons_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getRejectionReasonsList(params: Record<string, string | number>) {
        this._clearData()
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/rejection-reasons/get-reasons`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.rejection_reasons_list = items.map(
              (item: IRejectionReasonItemList) => ({
                ...item,
              })
            )
            this.rejection_reasons_pages.currentPage = current_page
            this.rejection_reasons_pages.lastPage = last_page

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

      async _getByIdRejectionReason(reasonId: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/rejection-reasons/get-reasons-by-id/${reasonId}`
          )
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.rejection_reasons_response = { ...responseData }
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

      async _createRejectionReason(data: Partial<IRejectionReasonToCreate>) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH_FICS}/rejection-reasons/create-reason`, data)
          .then((response) => {
            const { message, success } = response.data
            isSuccess = success ?? false

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

        return isSuccess
      },

      async _updateRejectionReason(
        data: Partial<IRejectionReasonToEdit>,
        reasonId: number
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(`${URL_PATH_FICS}/rejection-reasons/${reasonId}`, data)
          .then((response) => {
            const { message, success } = response.data
            isSuccess = success ?? false

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

        return isSuccess
      },

      async _changeStatus(
        data: IRejectionReasonChangeStatus,
        reasonId: number
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(
            `${URL_PATH_FICS}/rejection-reasons/toggle-status/${reasonId}`,
            data
          )
          .then((response) => {
            const { message, success } = response.data
            isSuccess = success ?? false

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

        return isSuccess
      },

      _clearData() {
        this.rejection_reasons_list = []
        this.rejection_reasons_response = null
        this.rejection_reasons_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
