import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { IErrors } from '@/interfaces/global'
import { IFiltersFormat } from '@/interfaces/customs'
import {
  IBudgetDocumentCancellation,
  IBudgetDocumentCancellationPayload,
  IBudgetDocumentErrorLogPayload,
} from '@/interfaces/customs/budget/BudgetDocumentCancellation'
import { URL_PATH_BUDGET } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH_BUDGET_CANCELLATION = `${URL_PATH_BUDGET}/budget-document-cancellation`

const { showCatchError } = useShowError()
const { showAlert } = useAlert()
const { getNameBlob, downloadBlobXlxx } = useUtils()

export const useBudgetDocumentCancellationStoreV1 = defineStore(
  'budget-document-cancellation-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _getDocumentCancellationWithDetailsById(
        filters: IFiltersFormat
      ): Promise<IBudgetDocumentCancellation | null> {
        return await executeApi()
          .get(`${URL_PATH_BUDGET_CANCELLATION}/list`, {
            params: { ...filters },
          })
          .then((res) => {
            const { data, message, success } = res.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return { ...data }
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _cancelBudgetDocument(
        payload: IBudgetDocumentCancellationPayload
      ): Promise<{ success: boolean; hasGeneratedErrorLogs: boolean }> {
        return await executeApi()
          .post(`${URL_PATH_BUDGET_CANCELLATION}/cancel`, payload)
          .then((res) => {
            const { success = false, message } = res.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return {
              success,
              hasGeneratedErrorLogs: false,
            }
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return { success: false, hasGeneratedErrorLogs: err.status === 422 }
          })
      },

      async _downloadDocumentCancellationErrorLogs(
        payload: IBudgetDocumentErrorLogPayload
      ) {
        await executeApi()
          .get(`${URL_PATH_BUDGET_CANCELLATION}/error-logs`, {
            params: { ...payload },
            responseType: 'blob',
          })
          .then((res) => {
            const blob = new Blob([res.data], {
              type: res.headers['content-type'],
            })

            const fileName = getNameBlob(res)
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
    },
  }
)
