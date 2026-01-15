// Pinia - Apis
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ISupportDocumentNumberingBusinessUpdatePayload,
  ISupportDocumentNumberingResolutionCreatePayload,
  ISupportDocumentNumberingResolutionForm,
  ISupportDocumentNumberingUpdatePayload,
} from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { IErrors } from '@/interfaces/global/errorMessage'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  URL_PATH_ACCOUNTS_PAYABLE,
  URL_PATH_THIRD_PARTIES_V1,
  TRUST_BUSINESS_API_URL,
} from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_THIRD_PARTIES = `${URL_PATH_THIRD_PARTIES_V1}/support-document-numbering`

const URL_ACCOUNTS_PAYABLE = `${URL_PATH_ACCOUNTS_PAYABLE}/support-document-numbering`

const URL_BUSINESS_TRUST = `${TRUST_BUSINESS_API_URL}/support-document-numbering`

export const useSupportDocumentNumberingStoreV1 = defineStore(
  'support-document-numbering-store-v1',
  {
    state: () => ({}),

    actions: {
      async _getSupportDocumentNumberingList(
        params: Record<string, string | number | null>
      ) {
        return await executeApi()
          .get(`${URL_THIRD_PARTIES}/third-parties`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            if (success) {
              return {
                list: items,
                pages: {
                  currentPage: current_page,
                  lastPage: last_page,
                },
              }
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

      async _updateSupportDocumentNumberingStatus(id: number) {
        let success = false
        await executeApi()
          .patch(`${URL_THIRD_PARTIES}/third-parties/${id}/toggle-status`)
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

      async _getSupportDocumentNumberingById(id: number) {
        return await executeApi()
          .get(`${URL_THIRD_PARTIES}/third-parties/${id}`)
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

      async _updateSupportDocumentNumbering(
        payload: ISupportDocumentNumberingUpdatePayload,
        id: number
      ) {
        let success = false
        await executeApi()
          .put(`${URL_THIRD_PARTIES}/third-parties/${id}`, payload)
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

      async _getSupportDocumentNumberingResolutionsList(
        params: Record<string, string | number | null>
      ) {
        return await executeApi()
          .get(`${URL_ACCOUNTS_PAYABLE}/resolutions`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            if (success) {
              return {
                list: items,
                pages: {
                  currentPage: current_page,
                  lastPage: last_page,
                },
              }
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

      async _createSupportDocumentNumberingResolution(
        payload: ISupportDocumentNumberingResolutionCreatePayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_ACCOUNTS_PAYABLE}/resolutions`, payload)
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

      async _getSupportDocumentNumberingResolutionById(id: number) {
        return await executeApi()
          .get(`${URL_ACCOUNTS_PAYABLE}/resolutions/${id}`)
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

      async _updateSupportDocumentNumberingResolution(
        payload: ISupportDocumentNumberingResolutionForm,
        id: number
      ) {
        let success = false
        await executeApi()
          .put(`${URL_ACCOUNTS_PAYABLE}/resolutions/${id}`, payload)
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

      async _deleteSupportDocumentNumberingResolution(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_ACCOUNTS_PAYABLE}/resolutions/${id}`)
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

      async _getSupportDocumentNumberingBusinessList(
        params: Record<string, string | number | null>
      ) {
        return await executeApi()
          .get(`${URL_BUSINESS_TRUST}/business-trusts`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            if (success) {
              return {
                list: items,
                pages: {
                  currentPage: current_page,
                  lastPage: last_page,
                },
              }
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

      async _getSupportDocumentNumberingBusinessById(id: number) {
        return await executeApi()
          .get(`${URL_BUSINESS_TRUST}/business-trusts/${id}`)
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

      async _updateSupportDocumentNumberingBusiness(
        payload: ISupportDocumentNumberingBusinessUpdatePayload,
        showSuccessNotification = true
      ) {
        let success = false
        await executeApi()
          .put(`${URL_BUSINESS_TRUST}/business-trusts`, payload)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            if (showSuccessNotification) {
              showAlert(
                message,
                success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
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
