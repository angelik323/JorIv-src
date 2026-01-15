import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

import { useAlert, useShowError } from '@/composables'

import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { IFiduciaryTrust } from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${TRUST_BUSINESS_API_URL}/fiduciary-mandate`

export const useFiduciaryTrustStoreV1 = defineStore(
  'fiduciary-trust-store-v1',
  {
    state: () => ({
      version: 'v1',
      fiduciary_trust_list: [] as IFiduciaryTrust[],
      fiduciary_trust_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _listAction(params: string) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}/index?${params}`)
          .then((response) => {
            const data = response.data.data

            this.fiduciary_trust_list = data?.data ?? []
            this.fiduciary_trust_pages = {
              currentPage: data?.current_page ?? 1,
              lastPage: data?.last_page ?? 1,
            }

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
      },

      async _showAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/show/${id}`)
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

      async _createAction(payload: IFiduciaryTrust) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/create`, payload)
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

      async _updateAction(payload: IFiduciaryTrust) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/update/${payload.id}`, payload)
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

      async _deleteAction(id: string) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/delete/${id}`)
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
        this.fiduciary_trust_list = []
        this.fiduciary_trust_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
