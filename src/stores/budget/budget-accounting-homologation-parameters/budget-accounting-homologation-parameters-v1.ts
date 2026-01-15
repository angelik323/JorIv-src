// Core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Interfaces
import { IPaginated } from '@/interfaces/customs/IPages'
import {
  IAccountingBudgetHomologationParameterPayload,
  IAccountingBudgetParameterItem,
  IBudgetAccountingHomologationParameterPayload,
  IBudgetAccountingParameterItem,
} from '@/interfaces/customs/budget/BudgetAccountingHomologationParameters'

// Constants
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const ACCOUNTING_BUDGET_URL_PATH = `${URL_PATH_BUDGET}/accounting-budget-mapping-parameters`
const BUDGET_ACCOUNTING_URL_PATH = `${URL_PATH_BUDGET}/budget-accounting-mapping-parameters`

export const useBudgetAccountingHomologationParametersStoreV1 = defineStore(
  'budget-accounting-homologation-parameters-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),

    actions: {
      async _getAccountingBudgetParameters(
        params: Record<string, string | number>
      ): Promise<IPaginated<IAccountingBudgetParameterItem> | null> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let paginatorResponse: IPaginated<IAccountingBudgetParameterItem> | null =
          null
        await executeApi()
          .get(`${ACCOUNTING_BUDGET_URL_PATH}/list`, {
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
      async _getBudgetAccountingParameters(
        params: Record<string, string | number>
      ): Promise<IPaginated<IBudgetAccountingParameterItem> | null> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let paginatorResponse: IPaginated<IBudgetAccountingParameterItem> | null =
          null
        await executeApi()
          .get(`${BUDGET_ACCOUNTING_URL_PATH}/list`, {
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

      async _createAccountingBudgetAction(
        payload: IAccountingBudgetHomologationParameterPayload
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let success = false
        await executeApi()
          .post(`${ACCOUNTING_BUDGET_URL_PATH}/new`, payload)
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
      async _createBudgetAccountingAction(
        payload: IBudgetAccountingHomologationParameterPayload
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let success = false
        await executeApi()
          .post(`${BUDGET_ACCOUNTING_URL_PATH}/new`, payload)
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
      async _getAccountingBudgetParameterById(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let parameterData = null
        await executeApi()
          .get(`${ACCOUNTING_BUDGET_URL_PATH}/show/${id}`)
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
      async _getBudgetAccountingParameterById(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let parameterData = null
        await executeApi()
          .get(`${BUDGET_ACCOUNTING_URL_PATH}/show/${id}`)
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

      async _updateAccountingBudgetAction(
        id: number,
        payload: IAccountingBudgetHomologationParameterPayload
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let success = false
        await executeApi()
          .put(`${ACCOUNTING_BUDGET_URL_PATH}/update/${id}`, payload)
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
      async _updateBudgetAccountingAction(
        id: number,
        payload: IBudgetAccountingHomologationParameterPayload
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let success = false
        await executeApi()
          .put(`${BUDGET_ACCOUNTING_URL_PATH}/update/${id}`, payload)
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
      async _deleteAccountingBudgetParameter(id: number): Promise<boolean> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let success = false
        await executeApi()
          .delete(`${ACCOUNTING_BUDGET_URL_PATH}/destroy/${id}`)
          .then((response) => {
            success = response.data.success
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
        return success
      },
      async _deleteBudgetAccountingParameter(id: number): Promise<boolean> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        let success = false
        await executeApi()
          .delete(`${BUDGET_ACCOUNTING_URL_PATH}/destroy/${id}`)
          .then((response) => {
            success = response.data.success
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
        return success
      },

      async _downloadAccountingBudgetParameters(
        params: Record<string, string | number> | undefined = undefined
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        await executeApi()
          .get(`${ACCOUNTING_BUDGET_URL_PATH}/export`, {
            responseType: 'blob',
            params: { ...params },
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = `Listado_parametros_homologación_contabilidad_vs_presupuesto_${useUtils().formatDate(
              '',
              'YYYY-MM-DD'
            )}`
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Archivo descargado con éxito',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _downloadBudgetAccountingParameters(
        params: Record<string, string | number> | undefined = undefined
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        await executeApi()
          .get(`${BUDGET_ACCOUNTING_URL_PATH}/export`, {
            responseType: 'blob',
            params: { ...params },
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
              'Archivo descargado con éxito',
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
