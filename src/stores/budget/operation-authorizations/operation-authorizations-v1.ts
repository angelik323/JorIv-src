// Core - Pinia - API
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
// Composables
import { useAlert, useShowError, useUtils } from '@/composables'
// Interfaces & types
import type {
  IOperationAuthorization,
  IOperationAuthorizationApprove,
  IOperationAuthorizationReject,
  IOperationAuthorizationResponse,
  IOperationAuthorizationUpdatePayload,
  IOperationStandardResponseBackend,
  IOperationTransferResponseBackend,
} from '@/interfaces/customs/budget/OperationAuthorizations'

const URL_PATH = `${URL_PATH_BUDGET}/budget-business-authorization`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useOperationAuthorizationsStoreV1 = defineStore(
  'operation-authorizations-store-v1',
  {
  state: () => ({
    version: 'v1',
    operations_list: [] as IOperationAuthorization[],
    operations_pages: {
      currentPage: 1,
      lastPage: 1,
    },
    total_operations: 0,
    total_transfers: 0,
  }),

    actions: {
      _clearData() {
        this.operations_list = []
        this.operations_pages = {
          currentPage: 1,
          lastPage: 1,
        }
        this.total_operations = 0
        this.total_transfers = 0
      },

      async _listAction(params: Record<string, string | number>) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH}/list`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: {
                items = { data: [], current_page: 0, last_page: 0 },
              },
              message,
              success,
            } = response.data

            // Unificar listado según nueva estructura (mezcla operations y transfers)
            this.operations_list = items.data

            this.operations_pages.currentPage = items.current_page
            this.operations_pages.lastPage = items.last_page

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

      async _processAction(
        payload: IOperationAuthorizationApprove | IOperationAuthorizationReject
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/authorize-reject`, payload)
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

      async _downloadExcelAction(query: string) {
        await executeApi()
          .post(`${URL_PATH}/export?${query}`, null, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
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

      async _updateAction(payload: IOperationAuthorizationUpdatePayload) {
        let success = false
        const id = payload.id
        const typeParam = payload.type
        const body = { details: payload.details }

        await executeApi()
          .put(`${URL_PATH}/update/${id}?type=${typeParam}`, body)
          .then((response) => {
            success = !!response?.data?.success
            showAlert(
              response?.data?.message,
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

      async _getOperationByIdAndType(id: string, operation_type: string): Promise<IOperationAuthorizationResponse | null> {
        return await executeApi()
          .get(`${URL_PATH}/show/${id}?type=${operation_type}`)
          .then((resp) => {
            const response = resp.data
            if (!response?.success || !response?.data) {
              showAlert(response?.message, 'error', undefined, TIMEOUT_ALERT)
              return null
            }

            const item = response.data
            const isTransfer =
              operation_type === 'transfer' ||
              Array.isArray(item?.origin) ||
              Array.isArray(item?.destination)

            let result: IOperationAuthorizationResponse

            if (isTransfer) {
              const transferData: IOperationTransferResponseBackend = {
                transfer_id: item.transfer_id ?? item.id ?? 0,
                origin: Array.isArray(item.origin) ? item.origin : [],
                destination: Array.isArray(item.destination) ? item.destination : [],
              }
              result = { transfer: transferData }
            } else {
              const operationData: IOperationStandardResponseBackend = {
                id: item.id ?? 0,
                operation_log_details: Array.isArray(item.operation_log_details)
                  ? item.operation_log_details
                  : [],
              }
              result = { operation: operationData }
            }

            showAlert(response?.message, 'success', undefined, TIMEOUT_ALERT)
            return result
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
    },
  }
)

