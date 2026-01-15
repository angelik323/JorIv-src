// Vue - pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces - Constants
import {
  IReportModel,
  IAccountingReportForm,
  IGeneralLedgerBusinessTable,
} from '@/interfaces/customs/accounting/v2/AccountingReport'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'
import { IPaginated } from '@/interfaces/customs'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

const URL_PATH = `${URL_PATH_ACCOUNTING}/v2/reports`

export const useGeneralLedgerStoreV2 = defineStore('general-ledger-store-v2', {
  state: () => ({
    version: 'v2',
  }),
  actions: {
    async _createAction(payload: IAccountingReportForm) {
      let result: IPaginated<IGeneralLedgerBusinessTable> | null = {
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      }
      let models: IReportModel[] = []
      let success = false

      await executeApi()
        .get(`${URL_PATH}/generate`, { params: payload })
        .then((response) => {
          const { success: responseSuccess, message, data } = response.data

          const report = data?.result

          result = {
            list: report?.data ?? [],
            pages: {
              currentPage: report?.current_page ?? 0,
              lastPage: report?.last_page ?? 0,
            },
          }

          models = data?.models ?? []
          success = response.data.success

          showAlert(
            message,
            responseSuccess ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return { result, models, success }
    },
  },
})
