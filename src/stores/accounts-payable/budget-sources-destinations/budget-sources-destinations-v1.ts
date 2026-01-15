import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import {
  IBudgetSourceDestination,
  IBudgetFlowRequest,
} from '@/interfaces/customs/accounts-payable/BudgetSourcesDestinations'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/sources-destinations`

export const useBudgetSourcesDestinationsStoreV1 = defineStore(
  'budget-sources-destinations-v1',
  {
    state: () => ({
      version: 'v1',
      budget_sources_destinations_list: [] as IBudgetSourceDestination[],
      budget_sources_destinations_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.budget_sources_destinations_list = items.map(
              (item: IBudgetSourceDestination) => ({
                ...item,
              })
            )
            this.budget_sources_destinations_pages.currentPage = current_page
            this.budget_sources_destinations_pages.lastPage = last_page

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

      async _createAction(payload: IBudgetFlowRequest) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
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

      async _deleteAction(id: number) {
        await executeApi()
          .delete(`${URL_PATH}/${id}`)
          .then((response) => {
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

      _clearData() {
        this.budget_sources_destinations_list = []
        this.budget_sources_destinations_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
