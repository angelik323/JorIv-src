import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

// CONSTANTS
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import {
  IThirdPartyBillingResponseV2,
  IThirdPartyBillingFormV2,
  IThirdPartyBillingListV2,
} from '@/interfaces/customs/settlement-commissions/ThirdPartyBillingV2'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH_THIRD_PARTY_BILLING = `${URL_PATH_SETTLEMENT_COMMISSIONS}/thirdparty-billing`

export const useThirdPartyBillingStoreV2 = defineStore(
  'third_party_billing-store-v2',
  {
    state: () => ({
      version: 'v2',
      third_party_billing_list: [] as IThirdPartyBillingListV2[],
      third_party_billing_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getThirdPartyBillingList(params: Record<string, string | number>) {
        await executeApi()
          .get(`${URL_PATH_THIRD_PARTY_BILLING}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.third_party_billing_list = items
            this.third_party_billing_pages.currentPage = current_page
            this.third_party_billing_pages.lastPage = last_page

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

      async _getByIdThirdPartyBilling(thirdPartyId: number) {
        let dataResponse: IThirdPartyBillingResponseV2 | null = null
        await executeApi()
          .get(`${URL_PATH_THIRD_PARTY_BILLING}/${thirdPartyId}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              dataResponse = { ...responseData }
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
        return dataResponse
      },

      async _createThirdPartyBilling(data: Partial<IThirdPartyBillingFormV2>) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_THIRD_PARTY_BILLING}`, data)
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

      async _updateThirdPartyBilling(
        data: Partial<IThirdPartyBillingFormV2>,
        thirdPartyId: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH_THIRD_PARTY_BILLING}/${thirdPartyId}`, data)
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

      async _changeStatusThirdPartyBilling(id: number) {
        let success = false

        await executeApi()
          .patch(`${URL_PATH_THIRD_PARTY_BILLING}/${id}/toggle-status`)
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
        this.third_party_billing_list = []
        this.third_party_billing_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
