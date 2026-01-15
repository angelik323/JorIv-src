import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  IAccountingReceipt,
  IAccountingReceiptCreate,
  IAccountingReceiptItem,
  IVoucherAmount,
} from '@/interfaces/customs'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const URL_PATH = `${URL_PATH_ACCOUNTING}/voucher`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  accounting_receipt: {} as IAccountingReceiptCreate,
  accounting_receipt_list: [] as IAccountingReceiptItem[],
  accounting_receipt_pages: {
    currentPage: 0,
    lastPage: 0,
  },
})

export const useAccountingReceiptsV1 = defineStore('accounting-receipts-v1', {
  state: initialState,
  actions: {
    async _getAccountingReceiptList(params: string) {
      this._cleanAccountingReceiptsData()
      await executeApi()
        .get(`${URL_PATH}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.accounting_receipt_list = response.data?.data?.data ?? []
            this.accounting_receipt_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.accounting_receipt_pages.lastPage =
              response.data?.data?.last_page ?? 0
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
    async _createAccountingReceipt(payload: IAccountingReceipt) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}`, payload)
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

    _cleanAccountingReceiptsData() {
      this.accounting_receipt_list = []
      this.accounting_receipt_pages = {
        currentPage: 0,
        lastPage: 0,
      }
      this.accounting_receipt = initialState().accounting_receipt
    },
    async _getAccountingReceipt(id: number) {
      let success = false
      await executeApi()
        .get(`${URL_PATH}/${id}/show`)
        .then((response) => {
          success = response.data.success
          if (success) {
            this.accounting_receipt = response.data.data
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

      return success
    },
    async _updateAccountingReceipt(id: number, payload: IAccountingReceipt) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${id}`, payload)
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

    async _downloadAccountingReceipt(accountingReceiptId: number) {
      let xlsFile = null
      await executeApi()
        .get(`${URL_PATH}/export?ids[0]=${accountingReceiptId}`, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          xlsFile = response.data
          return showAlert(
            response.data.message ?? 'Exportación exitosa',
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return xlsFile
    },
    async _annulateAccountingReceipt(id: number, annulate_date: string) {
      let success = false
      const payload = { annulate_date }
      await executeApi()
        .post(`${URL_PATH}/annulate/${id}`, payload)
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
    async _getVoucherLines(voucher_id: number) {
      let success = false

      await executeApi()
        .get(
          `/accounting/api/accounting/v2/voucher/${voucher_id}/lines?paginate=1&rows=1`
        )
        .then((response) => {
          success = response.data.success

          if (success && this.accounting_receipt) {
            this.accounting_receipt.voucher_data = response.data
              .data as IVoucherAmount[]
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

      return success
    },
  },
})
