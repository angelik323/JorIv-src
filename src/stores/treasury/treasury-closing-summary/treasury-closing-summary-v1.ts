import { defineStore } from 'pinia'

import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'
import { ITreasuryClosingSummary } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/treasury-closing`

export const useTreasuryClosingSummaryStoreV1 = defineStore(
  'treasury-closing-summary-store-v1',
  {
    state: () => ({
      treasury_closing_summary_list: [] as ITreasuryClosingSummary[],
      treasury_closing_summary_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getTreasuryClosingSummaryList(
        params: Record<string, string | number | null>
      ) {
        await executeApi()
          .get(`${URL_PATH}/resumen`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.treasury_closing_summary_list = items

            this.treasury_closing_summary_pages = {
              currentPage: current_page,
              lastPage: last_page,
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadExcelTreasuryClosingSummaryList(
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(`${URL_PATH}/export-resumen`, {
            responseType: 'blob',
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
