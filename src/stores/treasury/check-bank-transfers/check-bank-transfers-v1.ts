import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { ICheckBankTransfer } from '@/interfaces/customs/treasury/CheckBankTransfers'
import { defineStore } from 'pinia'

const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCheckBankTransfers = defineStore('check-bank-transfers', {
  state: () => ({
    checkBankTransfersList: [] as ICheckBankTransfer[],
    checkBankTransfersPages: {
      currentPage: 0,
      lastPage: 0,
    },
    perPage: 20 as number | string,
  }),

  actions: {
    async _getCheckBankTransfers(params: Record<string, string | number>) {
      this.checkBankTransfersList = []
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/bank-transfers`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          if (response.data.success) {
            const respData = response.data?.data ?? {}
            this.checkBankTransfersList = respData.data ?? []
            this.checkBankTransfersPages.currentPage =
              respData.current_page ?? 0
            this.checkBankTransfersPages.lastPage = respData.last_page ?? 0
            this.perPage = respData.per_page ?? 20
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },
    async _exportCheckBankTransfers(params: string) {
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/bank-transfers/export?${params}`, {
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
})
