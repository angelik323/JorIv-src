import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IInterestRate } from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useInterestRatesStoreV1 = defineStore('interest-rate-v1', {
  state: () => ({
    version: 'v1',
    interest_rate_list: [] as IInterestRate[],
    interest_rate_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    selected_interest_rate: null as IInterestRate | null,
  }),

  actions: {
    async _getListAction(params = '') {
      this._cleanInterestRateData()

      await executeApi()
        .get(
          `${URL_PATH_INVESTMENT_PORTFOLIO}/interest-rate/get?paginate=1${
            params ? '&' + params : ''
          }`
        )

        .then((response) => {
          if (response.data.success) {
            this.interest_rate_list = response.data?.data?.data ?? []
            this.interest_rate_pages = {
              currentPage: response.data?.data?.current_page ?? 1,
              lastPage: response.data?.data?.last_page ?? 1,
            }
          }
          return showAlert(
            response.data.message,
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    _cleanInterestRateData() {
      this.interest_rate_list = []
      this.interest_rate_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },

    async _createInterestRate(payload: IInterestRate) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/interest-rate/new`, payload)
        .then((response) => {
          success = response.data.success
          showAlert(
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

    async _updateInterestRate(id: number, payload: Partial<IInterestRate>) {
      let success = false
      await executeApi()
        .put(
          `${URL_PATH_INVESTMENT_PORTFOLIO}/interest-rate/update/${id}`,
          payload
        )
        .then((response) => {
          success = response.data.success
          showAlert(
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

    async _getInterestRate(id: number): Promise<IInterestRate | null> {
      let interestRate: IInterestRate | null = null

      await executeApi()
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/interest-rate/show/${id}`)
        .then((response) => {
          if (response.data.success) {
            interestRate = response.data.data
          }

          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return interestRate
    },

    async _deleteInterestRate(id: number) {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_INVESTMENT_PORTFOLIO}/interest-rate/destroy/${id}`)
        .then((response) => {
          success = response.data.success
          showAlert(
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

    _selectInterestRate(rate: IInterestRate) {
      this.selected_interest_rate = rate
    },
  },
})
