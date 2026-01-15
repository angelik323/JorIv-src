import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  IMonetaryMarketOperation,
  IMonetaryMarketOperationListItem,
  IMoneyMarketTransactionRecord,
  IRegisterMonetaryMarketPayload,
  IRepoBackendResponse,
  ISimultaneousBackendResponse,
  ITitleExtraInfo,
  ITtvBackendResponse,
  IUpdateMoneyMarketPayload,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useMonetaryMarketOperationsStoreV1 = defineStore(
  'monetary-market-operations-v1',
  {
    state: () => ({
      version: 'v1',
      operations_list: [] as IMonetaryMarketOperationListItem[],
      operations_pages: {
        currentPage: 0,
        lastPage: 0,
        total: 0,
      },
      selected_operation: null as IMonetaryMarketOperation | null,
      titles_extra_info: [] as ITitleExtraInfo[],
    }),

    actions: {
      async _getListAction(query: string) {
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/money-market-transaction-record/list?${query}`
          )
          .then((response) => {
            const ok = Boolean(response?.data?.success)
            if (!ok) {
              showAlert(
                response?.data?.message ?? 'Error cargando operaciones',
                'error'
              )
              return
            }

            this.operations_list = response.data.data ?? []
            this.operations_pages = {
              currentPage: response.data.current_page ?? 1,
              lastPage: response.data.last_page ?? 1,
              total: response.data.total ?? 0,
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error')
          })
      },

      _cleanOperationsData() {
        this.operations_list = []
        this.operations_pages = {
          currentPage: 0,
          lastPage: 0,
          total: 0,
        }
      },
      async _getTtvOperation(
        operationNumber: number
      ): Promise<ITtvBackendResponse | null> {
        let result: ITtvBackendResponse | null = null

        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/ttvs-operation/show/${operationNumber}`
          )
          .then((response) => {
            if (response.data.success) {
              result = response.data as ITtvBackendResponse
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

        return result
      },

      async _getRepoOperation(
        operationNumber: number
      ): Promise<IRepoBackendResponse | null> {
        let result: IRepoBackendResponse | null = null
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/repos-operation/show/${operationNumber}`
          )

          .then((response) => {
            if (response.data.success) {
              result = response.data as IRepoBackendResponse
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
        return result
      },

      async _getSimultaneousOperation(
        operationNumber: number
      ): Promise<ISimultaneousBackendResponse | null> {
        let result: ISimultaneousBackendResponse | null = null
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/simultaneous-operation/show/${operationNumber}`
          )

          .then((response) => {
            if (response.data.success) {
              result = response.data as ISimultaneousBackendResponse
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
        return result
      },

      _selectOperation(operation: IMonetaryMarketOperation) {
        this.selected_operation = operation
      },

      async _createTtvOperation(
        payload: IRegisterMonetaryMarketPayload
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/ttvs-operation/new`, payload)
          .then((response) => {
            success = response.data.success
            showAlert(
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

      async _createRepoOperation(
        payload: IRegisterMonetaryMarketPayload
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/repos-operation/new`, payload)
          .then((response) => {
            success = response.data.success
            showAlert(
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

      async _createSimultaneousOperation(
        payload: IRegisterMonetaryMarketPayload
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/simultaneous-operation/new`,
            payload
          )
          .then((response) => {
            success = response.data.success
            showAlert(
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

      async _updateAction(
        id: number,
        payload: IUpdateMoneyMarketPayload
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/money-market-transaction-record/update/${id}`,
            payload
          )
          .then((response) => {
            success = response.data.success
            showAlert(
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

      async _getTitlesByIssuer(
        issuerId: number
      ): Promise<ITitleExtraInfo[] | null> {
        let result: ITitleExtraInfo[] | null = null
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/title-handler/titles-list?issuer_id=${issuerId}`
          )
          .then((response) => {
            if (response.data.success) {
              result = response.data.data
            }
          })
          .catch(() => {
            result = null
          })
        return result
      },
      async _getMoneyMarketOperation(
        id: number
      ): Promise<IMoneyMarketTransactionRecord | null> {
        let result: IMoneyMarketTransactionRecord | null = null

        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/money-market-transaction-record/show/${id}`
          )
          .then((response) => {
            if (response.data.success && response.data.data) {
              const data = response.data.data
              result = { ...data }
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

        return result
      },
    },
  }
)
