// Apis - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
//Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'
//Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_BUDGET } from '@/constants/apis'
//Interfaces
import {
  IBudgetTransferQueryList,
  IBudgetTransferQueryDocument,
} from '@/interfaces/customs/budget/BudgetTransferQuery'
import { IPaginated, IPaginatedFiltersFormat } from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { useUtils } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const URL_PATH = `${URL_PATH_BUDGET}/budget-transfers-management`
export const useBudgetTransferQueryStoreV1 = defineStore(
  'budget-transfer-query-v1',
  {
    state: () => ({ version: 'v1' }),
    actions: {
      async _listAction(
        params: IPaginatedFiltersFormat
      ): Promise<IPaginated<IBudgetTransferQueryList>> {
        return await executeApi()
          .get(`${URL_PATH}/list`, { params: { ...params, paginate: true } })
          .then((response) => {
            const { message, success, data } = response.data

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
          .catch((error) => {
            const err = error as IErrors
            const message = showCatchError(err)
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
      async _listDocumentAction(
        id: number
      ): Promise<{ success: boolean; data: IBudgetTransferQueryDocument[] }> {
        let success = false
        let data: IBudgetTransferQueryDocument[] = []

        await executeApi()
          .get(`${URL_PATH}/show-document-associated/${id}`)
          .then((response) => {
            const {
              message,
              success: responseSuccess,
              data: responseData,
            } = response.data
            success = responseSuccess
            data = responseData || []

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

        return { success, data }
      },
      async _downloadExcelAction(params: IPaginatedFiltersFormat) {
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        await executeApi()
          .post(`${URL_PATH}/export`, null, {
            responseType: 'blob',
            params,
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = getNameBlob(response)
            downloadBlobXlxx(blob, fileName)

            return showAlert(
              'La descarga comenzará pronto',
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
