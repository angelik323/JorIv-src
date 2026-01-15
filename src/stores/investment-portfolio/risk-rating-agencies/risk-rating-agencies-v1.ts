import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import { useAlert, useShowError } from '@/composables'

import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IRiskRatingAgencies } from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/risk-rating-agencies`

export const useRiskRatingAgenciesStoreV1 = defineStore(
  'risk-rating-agencies-store-v1',
  {
    state: () => ({
      version: 'v1',
      risk_rating_agencies_list: [] as IRiskRatingAgencies[],
      risk_rating_agencies_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: string) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}/get?${params}`)
          .then((response) => {
            const data = response.data

            if (response.data.success) {
              this.risk_rating_agencies_list = data.data.data ?? []
              this.risk_rating_agencies_pages.currentPage =
                data.current_page ?? 1
              this.risk_rating_agencies_pages.lastPage = data.last_page ?? 1
            }

            return showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _showAction(id: string) {
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

      async _createAction(payload: IRiskRatingAgencies) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/new`, payload)
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

      async _updateAction(id: string, payload: IRiskRatingAgencies) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/update/${id}`, payload)
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

      _clearData() {
        this.risk_rating_agencies_list = []
        this.risk_rating_agencies_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
