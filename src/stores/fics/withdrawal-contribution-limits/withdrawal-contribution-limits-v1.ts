// Vue - Vue Router - Pinia - Quasar
import { defineStore } from 'pinia'

// Interfaces
import {
  IWithdrawalContributionLimit,
  IWithdrawalContributionLimitRequest,
} from '@/interfaces/customs/fics/WithdrawalContributionLimits'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

const URL_PATH = `${URL_PATH_FICS}/withdrawal-contribution-limits`

export const useWithdrawalContributionLimitsStoreV1 = defineStore(
  'withdrawal-contribution-limits-store-v1',
  {
    state: () => ({
      version: 'v1',
      withdrawal_list: [] as IWithdrawalContributionLimit[],
      withdrawal_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/get-index`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.withdrawal_list = items.map(
              (item: IWithdrawalContributionLimit) => ({
                ...item,
              })
            )
            this.withdrawal_pages.currentPage = current_page
            this.withdrawal_pages.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _showAction(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(`${URL_PATH}/show-record/${id}`)
          .then((response) => {
            const { data, message, success } = response.data

            if (success) {
              return data
            }

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createAction(payload: IWithdrawalContributionLimitRequest) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH}/create-record`, payload)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return isSuccess
      },

      async _updateAction(payload: IWithdrawalContributionLimitRequest) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(`${URL_PATH}/update-record/${payload.id}`, payload)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return isSuccess
      },

      async _deleteAction(id: number) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .delete(`${URL_PATH}/delete-record/${id}`)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = success
            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return isSuccess
      },

      _clearData() {
        this.withdrawal_list = []
        this.withdrawal_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
