import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

// CONSTANTS
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'

// Interfaces
import {
  IThirdPartyBillingChangeStatus,
  IThirdPartyBillingForm,
  IThirdPartyBillingList,
  IThirdPartyBillingResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH_THIRD_PARTY_BILLING = `${URL_PATH_SETTLEMENT_COMMISSIONS}/thirdparty-billing`

export const useThirdPartyBillingStoreV1 = defineStore(
  'third_party_billing-store-v1',
  {
    state: () => ({
      version: 'v1',
      third_party_billing_list: [] as IThirdPartyBillingList[],
      third_party_billing_response: null as IThirdPartyBillingResponse | null,
      third_party_billing_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getThirdPartyBillingList(params: Record<string, string | number>) {
        this._clearData()

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

            this.third_party_billing_list = items.map(
              (item: IThirdPartyBillingList) => ({
                ...item,
              })
            )
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
        await executeApi()
          .get(`${URL_PATH_THIRD_PARTY_BILLING}/${thirdPartyId}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.third_party_billing_response = { ...responseData }
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

      async _createThirdPartyBilling(data: Partial<IThirdPartyBillingForm>) {
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
        data: Partial<IThirdPartyBillingForm>,
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

      async _changeStatus(
        data: IThirdPartyBillingChangeStatus,
        thirdPartyId: number
      ) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_THIRD_PARTY_BILLING}/toggle-status/${thirdPartyId}`,
            data
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

      _clearData() {
        this.third_party_billing_list = []
        this.third_party_billing_response = null
        this.third_party_billing_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
