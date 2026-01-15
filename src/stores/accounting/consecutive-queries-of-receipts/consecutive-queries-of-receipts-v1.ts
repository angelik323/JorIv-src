import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IConsecutiveQueriesOfReceiptsList } from '@/interfaces/customs'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useConsecutiveQueriesOfReceiptv1 = defineStore(
  'consecutive-queries-of-receipts-v1',
  {
    state: () => ({
      consecutiveQueriesOfReceiptsList:
        [] as IConsecutiveQueriesOfReceiptsList[],
      consecutiveQueriesOfReceiptspages: {
        currentPage: 0,
        lastPage: 0,
      },
      urlExportXlsx: null as string | null,
    }),

    actions: {
      async _getConsecutiveQueriesOfReceiptsList(params: string) {
        this.consecutiveQueriesOfReceiptsList = []
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/consecutive-vouchers?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.urlExportXlsx = response.data.data.route_export ?? ''

              this.consecutiveQueriesOfReceiptsList =
                response.data?.data?.data ?? []
              this.consecutiveQueriesOfReceiptspages.currentPage =
                response.data?.data?.current_page ?? 0
              this.consecutiveQueriesOfReceiptspages.lastPage =
                response.data?.data?.last_page ?? 0
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _exportXlsxConsecutiveQueriesOfReceiptsList(params: string) {
        const nameFile = `Listado_de_consecutivos_de_comprobantes`
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/consecutive-vouchers/export?${params}`, {
            responseType: 'arraybuffer',
          })
          .then((response) => {
            createAndDownloadBlobByArrayBuffer(
              response.data,
              nameFile,
              undefined,
              true
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
