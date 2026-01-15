import { defineStore } from 'pinia'

// Interfaces - Constants
import {
  ICreateCancellationBalancePayload,
  IUpdateCancellationBalancePayload,
  IListBudgetDocuments,
} from '@/interfaces/customs/budget/CancellationBalances'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Composables - Utils
import { useAlert, useShowError } from '@/composables'

// Apis
import { executeApi } from '@/apis'

// Alerts
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBudgetCancellationBalancesStoreV1 = defineStore(
  'budget-cancellation-balances-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Cancelación de saldos',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Presupuesto',
          },
          {
            label: 'Cancelación de saldos',
            route: 'BudgetCancellationBalancesList',
          },
        ],
      },
      data_list_documents_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getListAction(filters: string) {
        let list_budget_documents = [] as IListBudgetDocuments[]
        await executeApi()
          .get(
            `${URL_PATH_BUDGET}/balance-cancelations/list?paginate=1${filters}`
          )
          .then((response) => {
            if (response.data.success) {
              list_budget_documents = response.data?.data?.data ?? []
              this.data_list_documents_pages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }
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
        return list_budget_documents
      },
      async _createCancellationBalances(
        data: ICreateCancellationBalancePayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_BUDGET}/balance-cancelations/new`, data)
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
      async _updateCancellationBalances(
        cancellationId: number,
        data: IUpdateCancellationBalancePayload
      ) {
        let success = false
        await executeApi()
          .patch(
            `${URL_PATH_BUDGET}/balance-cancelations/${cancellationId}/cancellation-value`,
            data
          )
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
      async _updateBulkCancel(data: { balance_cancelation_ids: number[] }) {
        let success = false
        await executeApi()
          .put(`${URL_PATH_BUDGET}/balance-cancelations/bulk-cancel`, data)
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
  }
)
