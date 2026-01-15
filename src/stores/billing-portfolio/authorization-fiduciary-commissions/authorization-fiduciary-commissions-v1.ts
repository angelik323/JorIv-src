import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IErrors } from '@/interfaces/global'
import { IAuthorizationFiduciaryCommission } from '@/interfaces/customs'

import { URL_PATH_BILLING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

export const useAuthorizationFiduciaryCommissionsStoreV1 = defineStore(
  'authorization-fiduciary-commissions-store-v1',
  {
    state: () => ({
      version: 'v1',
      general_commissions_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      general_commissions_list: [] as IAuthorizationFiduciaryCommission[],

      authorization_commissions_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      authorization_commissions_list: [] as IAuthorizationFiduciaryCommission[],

      commission: null as IAuthorizationFiduciaryCommission | null,
    }),

    actions: {
      async _getGeneralCommissionsList(params: string) {
        this._clearGeneralCommissionsList()

        await executeApi()
          .get(
            `${URL_PATH_BILLING}/settlement-commissions?paginate=true${params}`
          )
          .then((response) => {
            this.general_commissions_list = response.data?.data?.data ?? []
            this.general_commissions_pages.currentPage =
              response.data?.data?.current_page
            this.general_commissions_pages.lastPage =
              response.data?.data?.last_page

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearGeneralCommissionsList() {
        this.general_commissions_list = []
        this.general_commissions_pages = { currentPage: 0, lastPage: 0 }
      },

      async _setAuthorizationCommissionsList(params: {
        selectedCommissions: IAuthorizationFiduciaryCommission[]
      }) {
        this.authorization_commissions_list = params.selectedCommissions
        this.authorization_commissions_pages.currentPage = 1
        this.authorization_commissions_pages.lastPage = 1
      },

      _clearAuthorizationCommissionsList() {
        this.authorization_commissions_list = []
        this.authorization_commissions_pages = { currentPage: 0, lastPage: 0 }
      },

      _clearCommission() {
        this.commission = null
      },

      _clearData() {
        this._clearGeneralCommissionsList()
        this._clearAuthorizationCommissionsList()
        this._clearCommission()
      },

      async _authorizeCommissions(params: { ids: number[] }) {
        await executeApi()
          .post(`${URL_PATH_BILLING}/settlement-commissions/authorize`, params)
          .then((response) => {
            const success = response.data?.success ?? false

            showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getCommissionById(id: number) {
        await executeApi()
          .get(`${URL_PATH_BILLING}/settlement-commissions/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            this.commission = data || null

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _cancelCommissions(params: {
        ids: number[]
        cancellation_reason: string
      }) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_BILLING}/settlement-commissions/cancel`, params)
          .then((response) => {
            success = response.data?.success ?? false

            showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
    },
  }
)
