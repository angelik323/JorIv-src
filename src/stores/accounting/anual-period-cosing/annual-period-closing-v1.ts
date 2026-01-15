import { defineStore } from 'pinia'
import { IAnnualPeriodClosingModel } from '@/interfaces/customs'
import { useAlert, useShowError } from '@/composables'

import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { formatParamsCustom } from '@/utils'

const URL_PATH = `${URL_PATH_ACCOUNTING}/business-trust/`
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAnnualPeriodClosingv1 = defineStore('account-structures-v1', {
  state: () => ({
    version: 'v1',
    period_closing_list: [] as IAnnualPeriodClosingModel[],

    validation_vouchers_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    selected_account_structure: null as null | IAnnualPeriodClosingModel,
  }),
  actions: {
    _cleanData() {
      this.period_closing_list = []
      this.validation_vouchers_pages.currentPage = 0
      this.validation_vouchers_pages.lastPage = 0
    },
    async _getListAction(params: string) {
      await executeApi()
        .get(`${URL_PATH}period-closure?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.period_closing_list = response.data?.data.data ?? []
            this.validation_vouchers_pages.currentPage =
              response.data?.data.current_page ?? 0
            this.validation_vouchers_pages.lastPage =
              response.data?.data.last_page ?? 0
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
    async _executeAnnualClosure(params: IAnnualPeriodClosingModel) {
      let success = false
      let data: [] = []

      const queryString = formatParamsCustom(params)

      await executeApi()
        .get(
          `${URL_PATH}annual-closure/eligible-business-trusts?${queryString}`
        )
        .then((response) => {
          success = response.data.success
          data = response?.data.data ?? []
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

      return { success, data }
    },

    async _createAnnualClosing(payload: IAnnualPeriodClosingModel) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}execute-annual-closure`, payload)
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
  },
})
