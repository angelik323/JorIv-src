// Core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import { IPaginated, IPaginatedFiltersFormat } from '@/interfaces/customs'
import {
  IBudgetClosureBusinessItem,
  IBudgetClosureCreateClosure,
  IBudgetClosureCreateClosureResponse,
  IBudgetClosureProcessedBusinessDocumentListItem,
  IBudgetClosureProcessedBusinessListItem,
  IBudgetClosureProcessInfo,
  IBudgetClosureProcessListItem,
} from '@/interfaces/customs/budget/BudgetClosure'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { useUtils } from '@/composables/useUtils'

// Constants
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH_BUDGET_CLOSURE = `${URL_PATH_BUDGET}/v2/budget-closure`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { downloadBlob, getNameBlob } = useUtils()

export const useBudgetClosureStoreV1 = defineStore(
  'budget-document-cancellation-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _getProcessList(
        params: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetClosureProcessListItem>> {
        return await executeApi()
          .get(`${URL_PATH_BUDGET_CLOSURE}/job-status`, {
            params: { ...params, paginate: true },
          })
          .then((res) => {
            const { data, message, success } = res.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return {
              list: data.data,
              pages: {
                currentPage: data.current_page,
                lastPage: data.last_page,
              },
            }
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)

            return {
              list: [],
              pages: {
                currentPage: 0,
                lastPage: 0,
              },
            }
          })
      },

      async _getBusinessList(
        params: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetClosureBusinessItem>> {
        return await executeApi()
          .get(`${URL_PATH_BUDGET_CLOSURE}/businesses`, {
            params: { ...params, paginate: true },
          })
          .then((res) => {
            const { data, message, success } = res.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return {
              list: data.data,
              pages: {
                currentPage: data.current_page,
                lastPage: data.last_page,
              },
            }
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)

            return {
              list: [],
              pages: {
                currentPage: 0,
                lastPage: 0,
              },
            }
          })
      },

      async _createBudgetClosure(
        payload: IBudgetClosureCreateClosure
      ): Promise<IBudgetClosureCreateClosureResponse | null> {
        return await executeApi()
          .post(`${URL_PATH_BUDGET_CLOSURE}/process-job`, { ...payload })
          .then((res) => {
            const { success, data, message } = res.data
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return data
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _getProcessDetailsById(
        processId: number
      ): Promise<IBudgetClosureProcessInfo | null> {
        return await executeApi()
          .get(`${URL_PATH_BUDGET_CLOSURE}/job-status/${processId}`)
          .then((res) => {
            const { data, message, success } = res.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return data
          })
          .catch((err) => {
            const message = showCatchError(err)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _getProcessedBusinessList(
        params: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetClosureProcessedBusinessListItem>> {
        return await executeApi()
          .get(`${URL_PATH_BUDGET_CLOSURE}/list`, {
            params: { ...params, paginate: true },
          })
          .then((res) => {
            const { data, message, success } = res.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return {
              list: data.data,
              pages: {
                currentPage: data.current_page,
                lastPage: data.last_page,
              },
            }
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)

            return {
              list: [],
              pages: {
                currentPage: 0,
                lastPage: 0,
              },
            }
          })
      },

      async _getProcessedBusinessDocuments(
        processId: number,
        businessId: number
      ): Promise<IBudgetClosureProcessedBusinessDocumentListItem | null> {
        return await executeApi()
          .get(`${URL_PATH_BUDGET_CLOSURE}/job-status/${processId}`, {
            params: {
              documents: true,
              business_id: businessId,
            },
          })
          .then((res) => {
            const { data, message, success } = res.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return data
          })
          .catch((err) => {
            showAlert(showCatchError(err), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _downloadErrorReport(processId: number): Promise<void> {
        await executeApi()
          .get(`${URL_PATH_BUDGET_CLOSURE}/${processId}/error-report`, {
            responseType: 'blob',
          })
          .then((res) => {
            const blob = new Blob([res.data], {
              type: res.headers['content-type'],
            })

            const fileName = getNameBlob(res)
            downloadBlob(blob, fileName)

            showAlert(
              res.data.message || 'Descarga exitosa',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((err) => {
            showAlert(showCatchError(err), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
