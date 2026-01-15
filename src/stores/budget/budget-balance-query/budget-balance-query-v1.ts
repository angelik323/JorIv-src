// Apis - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces - Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_BUDGET } from '@/constants/apis'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

const URL_PATH = `${URL_PATH_BUDGET}/balances`

export const useBudgetBalanceQueryStoreV1 = defineStore(
  'budget-balance-query-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        return await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            if (success) {
              return {
                list: items,
                pages: { currentPage: current_page, lastPage: last_page },
              }
            }

            return showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _exportExcelAction(payload: Record<string, string | number>) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        await executeApi()
          .post(
            `${URL_PATH}/export`,
            {},
            {
              params: payload,
              responseType: 'blob',
            }
          )

          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = getNameBlob(response)
            downloadBlobXlxx(blob, fileName)

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
