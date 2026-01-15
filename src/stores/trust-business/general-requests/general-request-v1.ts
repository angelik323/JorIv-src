import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

import { useAlert, useShowError } from '@/composables'

import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { IGeneralRequests } from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${TRUST_BUSINESS_API_URL}/general-order`

export const useGeneralRequestsStoreV1 = defineStore(
  'general-requests-store-v1',
  {
    state: () => ({
      version: 'v1',
      general_requests_list: [] as IGeneralRequests[],
      general_requests_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _listAction(params: string) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}?${params}`)
          .then((response) => {
            const data = response.data

            if (data.success) {
              this.general_requests_list = data.data.data ?? []
              this.general_requests_pages = {
                currentPage: data.data?.current_page ?? 1,
                lastPage: data.data?.last_page ?? 1,
              }
            }

            return showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _showAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) return response.data.data

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createAction(payload: IGeneralRequests) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _updateAction(payload: IGeneralRequests) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${payload.id}`, payload)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
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

      async _deleteAction(id: number) {
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

      _clearData() {
        this.general_requests_list = []
        this.general_requests_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
