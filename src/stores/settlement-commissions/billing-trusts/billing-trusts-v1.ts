import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IAccountingParametersForm,
  IAccountingParametersResponse,
  IBillingTrustForm,
  IBillingTrustList,
  IBillingTrustResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH_BILLING_TRUSTS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/billing-trusts`

export const useBillingTrustsStoreV1 = defineStore('billing-trusts-store-v1', {
  state: () => ({
    version: 'v1',
    billing_trusts_list: [] as IBillingTrustList[],
    billing_trusts_response: null as IBillingTrustResponse | null,
    accounting_parameters_response:
      null as IAccountingParametersResponse | null,
    billing_trusts_pages: {
      currentPage: 0,
      lastPage: 0,
    },
  }),

  actions: {
    async _getBillingTrustsList(params: Record<string, string | number>) {
      this._clearData()

      await executeApi()
        .get(URL_PATH_BILLING_TRUSTS, {
          params: { ...params, paginate: true },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.billing_trusts_list = items.map((item: IBillingTrustList) => ({
            ...item,
          }))
          this.billing_trusts_pages.currentPage = current_page
          this.billing_trusts_pages.lastPage = last_page

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

    async _getByIdBillingTrusts(billingId: number) {
      await executeApi()
        .get(`${URL_PATH_BILLING_TRUSTS}/${billingId}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.billing_trusts_response = { ...responseData }
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

    async _getByIdAccountingParameters(billingId: number) {
      await executeApi()
        .get(`${URL_PATH_BILLING_TRUSTS}/${billingId}/accounting-parameters`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.accounting_parameters_response = { ...responseData }
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

    async _createAccountingParameters(
      id: number,
      data: Partial<IAccountingParametersForm>
    ) {
      let success = false

      await executeApi()
        .post(`${URL_PATH_BILLING_TRUSTS}/${id}/accounting-parameters`, data)
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

    async _createBillingTrusts(data: Partial<IBillingTrustForm>) {
      let success = false

      await executeApi()
        .post(`${URL_PATH_BILLING_TRUSTS}`, data)
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

    async _updateBillingTrusts(
      data: Partial<IBillingTrustForm>,
      billingId: number
    ) {
      let success = false

      await executeApi()
        .put(`${URL_PATH_BILLING_TRUSTS}/${billingId}`, data)
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

    async _updateAccountingParameters(
      data: Partial<IAccountingParametersForm>,
      billingId: number
    ) {
      let success = false

      await executeApi()
        .put(
          `${URL_PATH_BILLING_TRUSTS}/${billingId}/accounting-parameters`,
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
      this.billing_trusts_list = []
      this.billing_trusts_response = null
      this.billing_trusts_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})
