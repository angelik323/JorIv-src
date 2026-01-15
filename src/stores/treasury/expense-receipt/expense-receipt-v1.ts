import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useAlert, useShowError, useUtils } from '@/composables'
import { IExpenseReceiptResponse } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
export const useExpenseReceiptStoreV1 = defineStore(
  'expense-receipt-store-v1',
  {
    state: () => ({
      expenseReceiptList: [] as IExpenseReceiptResponse[],
      expenseReceiptPages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getExpenseReceiptList(params: string) {
        this.expenseReceiptList = []
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/expense-voucher?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.expenseReceiptList = response.data?.data.data ?? []
              this.expenseReceiptPages = {
                currentPage: response.data?.data?.current_page ?? 1,
                lastPage: response.data?.data?.last_page ?? 1,
              }
              return showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            this.expenseReceiptList = []
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getExpenseReceiptExportById(id: number) {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/expense-voucher/export/${id}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            return showAlert(
              'Descarga exitosa',
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
