import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import {
  IAccountingVoucher,
  ICheckTreasuryReceiptList,
  ICheckTreasuryReceiptResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'

const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCheckTreasuryReceiptStoreV1 = defineStore(
  'check-treasury-receipt-store-v1',
  {
    state: () => ({
      data_information_form: null as ICheckTreasuryReceiptResponse | null,
      checkTreasuryReceiptList: [] as ICheckTreasuryReceiptList[],
      accountingCoucherList: [] as IAccountingVoucher[],
    }),
    actions: {
      async _getCheckTreasuryReceipts(params: string) {
        this.checkTreasuryReceiptList = []
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/treasury-movements?${params}`)
          .then((response) => {
            if (response.data.success) {
              const respData = response.data?.data ?? {}
              this.checkTreasuryReceiptList = respData ?? []
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

      async _downloadCheckTreasuryReceipts(params: string) {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/treasury-movements/export${params}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName.replace(/['"]/g, ''))
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getByIdCheckTreasuryReceipts(id: number) {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/treasury-movements/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res = response.data?.data
              if (res) {
                this.data_information_form = res
              }
            }
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
      },

      async _getAccountingVoucherList(treasuryMovementId: number) {
        this.accountingCoucherList = []
        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/treasury-movements/${treasuryMovementId}/accounting-vouchers`
          )
          .then((response) => {
            if (response.data.success) {
              this.accountingCoucherList = response.data?.data
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
    },
  }
)
