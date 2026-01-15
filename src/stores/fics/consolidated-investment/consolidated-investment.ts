// Vue - pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import { IConsolidatedInvestmentRequestAssign } from '@/interfaces/customs/fics/ConsolidatedInvestment'
import {
  IFiduciaryCommissionRequest,
  IFiduciaryCommission,
} from '@/interfaces/customs/fics/FiduciaryCommission'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

export const useConsolidatedInvestmentStoreV1 = defineStore(
  'consolidated-investment-store-v1',
  {
    state: () => ({
      version: 'v1',
      consolidator_funds_list: [] as IFiduciaryCommission[],
      consolidator_funds_compartments_list: [] as IFiduciaryCommission[],
      consolidator_funds_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      consolidator_funds_compartments_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: string) {
        this.consolidator_funds_list = []

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH_FICS}/consolidator-funds?${params}`)
          .then((response) => {
            const {
              data: { data: items = [], current_page, last_page },
              message,
              success,
            } = response.data

            if (success) {
              this.consolidator_funds_list = items ?? []
              this.consolidator_funds_pages.currentPage = current_page ?? 1
              this.consolidator_funds_pages.lastPage = last_page ?? 1
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
          })
      },
      async _listActionCompartments(fundId: number, params?: string) {
        this.consolidator_funds_compartments_list = []

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        const url = params
          ? `${URL_PATH_FICS}/consolidator-funds/${fundId}?paginate=1&${params}`
          : `${URL_PATH_FICS}/consolidator-funds/${fundId}?paginate=1`

        await executeApi()
          .get(url)
          .then((response) => {
            const {
              data: { data: items = [], current_page, last_page },
              message,
              success,
            } = response.data

            if (success) {
              this.consolidator_funds_compartments_list = items ?? []
              this.consolidator_funds_compartments_pages.currentPage =
                current_page ?? 1
              this.consolidator_funds_compartments_pages.lastPage =
                last_page ?? 1
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
          })
      },

      async _showAction(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(`${URL_PATH_FICS}/consolidator-funds/${id}`)
          .then((response) => {
            const { data, message, success } = response.data

            if (success) {
              return data as IFiduciaryCommission
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

      async _createAction(payload: IFiduciaryCommissionRequest) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH_FICS}/consolidator-funds`, payload)
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

      async _createActionAssign(payload: IConsolidatedInvestmentRequestAssign) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH_FICS}/consolidating-fund-compartments`, payload)
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
          .delete(`${URL_PATH_FICS}/consolidating-fund-compartments/${id}`)
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
        this.consolidator_funds_list = []
        this.consolidator_funds_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
