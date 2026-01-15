// Pinia - Axios
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import { IPaginated, IPaginatedFiltersFormat } from '@/interfaces/customs'
import {
  IBudgetBalanceListItem,
  IBudgetDocumentDetailsListItem,
  IBudgetDocumentsListItem,
  IBudgetDocumentsAssociatedListItem,
  IBudgetDocumentsAccountingVoucherListItem,
  IBudgetDocumentsPaymentOrderListItem,
} from '@/interfaces/customs/budget/BudgetDocuments'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const { getNameBlob, downloadBlobXlxx } = useUtils()

const URL_PATH_BUDGET_DOCUMENTS = `${URL_PATH_BUDGET}/budget-documents-management`

export const useBudgetDocumentsStoreV1 = defineStore(
  'budget-documents-store-v1',
  {
    state: () => ({
      version: 'v1',
      filtersFormat: { page: 1, rows: 20 } as IPaginatedFiltersFormat,
    }),
    actions: {
      _setFiltersFormat(filters: IPaginatedFiltersFormat) {
        this.filtersFormat = filters
      },
      _clearFiltersFormat() {
        this.filtersFormat = { page: 1, rows: 20 }
      },
      async _getDocumentsList(
        filters: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetDocumentsListItem>> {
        return await executeApi()
          .get(`${URL_PATH_BUDGET_DOCUMENTS}/list`, {
            params: { ...filters, paginate: true },
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

      async _getDocumentById(
        operationLogId: number
      ): Promise<IBudgetDocumentsListItem | null> {
        return await executeApi()
          .get(`${URL_PATH_BUDGET_DOCUMENTS}/show/${operationLogId}`)
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
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)

            return null
          })
      },

      async _getDocumentDetailsById(
        filters: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetDocumentDetailsListItem>> {
        const { operationLogId, ...params } = filters
        return await executeApi()
          .get(`${URL_PATH_BUDGET_DOCUMENTS}/show-detail/${operationLogId}`, {
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

      async _getDocumentBalancesById(
        filters: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetBalanceListItem>> {
        const { operationLogId, ...params } = filters

        return await executeApi()
          .get(
            `${URL_PATH_BUDGET_DOCUMENTS}/show-balance-budget-item/${operationLogId}`,
            {
              params: { ...params, paginate: true },
            }
          )
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

      async _downloadDocumentDetails(
        operationLogId: number,
        filters: IPaginatedFiltersFormat
      ): Promise<void> {
        return await executeApi()
          .post(
            `${URL_PATH_BUDGET_DOCUMENTS}/budget-document-details-export/${operationLogId}`,
            undefined,
            { responseType: 'blob', params: filters }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = getNameBlob(response)
            downloadBlobXlxx(blob, fileName)
          })
          .catch(async (err) => {
            let parsedErr = err
            if (
              err.response &&
              err.response.data instanceof Blob &&
              err.response.data.type === 'application/json'
            ) {
              parsedErr = JSON.parse(await err.response.data.text())
            }

            const error = parsedErr as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadDocument(filters: IPaginatedFiltersFormat): Promise<void> {
        return await executeApi()
          .post(
            `${URL_PATH_BUDGET_DOCUMENTS}/budget-document-export`,
            undefined,
            { responseType: 'blob', params: filters }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = getNameBlob(response)
            downloadBlobXlxx(blob, fileName)
          })
          .catch(async (err) => {
            let parsedErr = err
            if (
              err.response &&
              err.response.data instanceof Blob &&
              err.response.data.type === 'application/json'
            ) {
              parsedErr = JSON.parse(await err.response.data.text())
            }

            const error = parsedErr as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getAssociatedDocumentsById(
        filters: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetDocumentsAssociatedListItem>> {
        const { documentId, ...params } = filters
        return await executeApi()
          .get(
            `${URL_PATH_BUDGET_DOCUMENTS}/show-associated-budget-document/${documentId}`,
            {
              params: { ...params, paginate: true },
            }
          )
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

      async _getDocumentAccountingVouchers(
        filters: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetDocumentsAccountingVoucherListItem>> {
        const { documentId, ...params } = filters
        return await executeApi()
          .get(
            `${URL_PATH_BUDGET_DOCUMENTS}/show-accounting-voucher/${documentId}`,
            {
              params: { ...params, paginate: true },
            }
          )
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

      async _getDocumentPaymentOrders(
        filters: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetDocumentsPaymentOrderListItem>> {
        const { documentId, ...params } = filters
        return await executeApi()
          .get(
            `${URL_PATH_BUDGET_DOCUMENTS}/show-order-payment/${documentId}`,
            {
              params: { ...params, paginate: true },
            }
          )
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
    },
  }
)
