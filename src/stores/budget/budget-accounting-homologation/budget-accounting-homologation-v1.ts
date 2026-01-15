// Core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Interfaces
import { IPaginated } from '@/interfaces/customs/IPages'
import {
  IBudgetAccountingHomologationItem,
  IBudgetAccountingHomologationPayload,
  IBudgetHomologationProcessData,
  IHomologationPendingDocumentsItem,
} from '@/interfaces/customs/budget/BudgetAccountingHomologation'

// Constants
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const BUDGET_ACCOUNTING_URL_PATH = `${URL_PATH_BUDGET}/accounting-budget-homologations`

export const useBudgetAccountingHomologationStoreV1 = defineStore(
  'budget-accounting-homologation-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),

    actions: {
      async _getBudgetAccountingHomologations(
        params: Record<string, string | number>
      ): Promise<IPaginated<IBudgetAccountingHomologationItem> | null> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let paginatorResponse: IPaginated<IBudgetAccountingHomologationItem> | null =
          null
        await executeApi()
          .get(`${BUDGET_ACCOUNTING_URL_PATH}/homologated`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            if (response.data.success) {
              const {
                data: { data = [], current_page = 0, last_page = 0 },
              } = response.data

              paginatorResponse = {
                list: data,
                pages: {
                  currentPage: current_page || 1,
                  lastPage: last_page || 1,
                },
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
        return paginatorResponse
      },
      async _getPendingOperations(
        params: Record<string, string | number>
      ): Promise<IPaginated<IHomologationPendingDocumentsItem> | null> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let paginatorResponse: IPaginated<IHomologationPendingDocumentsItem> | null =
          null
        await executeApi()
          .get(`${BUDGET_ACCOUNTING_URL_PATH}/not-homologated`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            if (response.data.success) {
              const {
                data: { data = [], current_page = 0, last_page = 0 },
              } = response.data

              paginatorResponse = {
                list: data,
                pages: {
                  currentPage: current_page || 1,
                  lastPage: last_page || 1,
                },
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
        return paginatorResponse
      },
      async _runHomologationProcess(
        payload: IBudgetAccountingHomologationPayload[]
      ): Promise<IBudgetHomologationProcessData[] | null> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let processData: IBudgetHomologationProcessData[] | null = null
        await executeApi()
          .post(`${BUDGET_ACCOUNTING_URL_PATH}/new`, payload)
          .then((response) => {
            processData = response.data.data
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
        return processData
      },

      async _getBudgetAccountingParameterById(
        id: number,
        is_from_operation_log: number
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let parameterData = null
        await executeApi()
          .get(
            `${BUDGET_ACCOUNTING_URL_PATH}/homologated/show?id=${id}&isFromOperationLog=${is_from_operation_log}`
          )
          .then((response) => {
            if (response.data.success) {
              parameterData = response.data.data
            }

            showAlert(
              response.data.message,
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return parameterData
      },

      async _downloadBudgetAccountingHomologationErrors(
        payload: IBudgetHomologationProcessData[]
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        await executeApi()
          .post(`${BUDGET_ACCOUNTING_URL_PATH}/download-error-logs`, payload, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = `Listado_parametros_homologación_presupuesto_vs_contabilidad_${useUtils().formatDate(
              '',
              'YYYY-MM-DD'
            )}`
            useUtils().downloadBlobXlxx(blob, fileName)

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
    },
  }
)
