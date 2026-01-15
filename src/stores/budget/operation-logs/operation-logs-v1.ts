import { defineStore } from 'pinia'

// Interfaces
import { IOperationLogsRequest } from '@/interfaces/customs/budget/OperationLogs'

// Composables - Utils
import { useAlert, useShowError } from '@/composables'

// Apis
import { URL_PATH_BUDGET } from '@/constants/apis'
import { executeApi } from '@/apis'

// Alerts
const { showCatchError } = useShowError()
const { showAlert } = useAlert()
const TIMEOUT_ALERT = 3000

export const useBudgetOperationLogsStoreV1 = defineStore(
  'budget-operation-logs-store-v1',
  {
    state: () => ({}),
    actions: {
      async _createAction(data: IOperationLogsRequest) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_BUDGET}/operation-logs`, data)
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
