import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IBillingPeriodList,
  IBillingPeriodResponse,
  IBillingPeriodInformationForm,
} from '@/interfaces/customs/settlement-commissions/BillingPeriodV2'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PERIODS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/billing-trusts`

export const useBillingPeriodStoreV2 = defineStore('billing-period-store-v2', {
  state: () => ({
    version: 'v2',
    headerPropsDefault: {
      title: 'Periodos de liquidación de comisiones',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Liquidación de comisiones',
        },
        {
          label: 'Periodos de liquidación de comisiones',
          route: 'BillingPeriodList',
        },
      ],
    },
    billing_period_list: [] as IBillingPeriodList[],
    billing_period_response: null as IBillingPeriodResponse | null,
    billing_period_pages: {
      currentPage: 0,
      lastPage: 0,
    },
  }),

  actions: {
    async _getBillingPeriodList(params: Record<string, string | number>) {
      this._clearData()

      await executeApi()
        .get(`${URL_PERIODS}`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.billing_period_list = items
          this.billing_period_pages.currentPage = current_page
          this.billing_period_pages.lastPage = last_page

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

    async _getByIdBillingPeriod(id: number) {
      await executeApi()
        .get(`${URL_PERIODS}/${id}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.billing_period_response = { ...responseData }
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

    async _createBillingPeriod(data: Partial<IBillingPeriodInformationForm>) {
      let success = false

      await executeApi()
        .post(`${URL_PERIODS}`, data)
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

    async _updateBillingPeriod(
      data: Partial<IBillingPeriodInformationForm>,
      id: number
    ) {
      let success = false

      await executeApi()
        .put(`${URL_PERIODS}/${id}`, data)
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

    async _deleteBillingPeriod(id: number) {
      let success = false

      await executeApi()
        .delete(`${URL_PERIODS}/${id}`)
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
      this.billing_period_list = []
      this.billing_period_response = null
      this.billing_period_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})
