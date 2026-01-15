import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  IAccountingReceipt,
  IAccountingReceiptCreate,
  IAccountingReceiptItem,
  IVoucherAmount,
  IVoucherLines,
} from '@/interfaces/customs/accounting/AccountingReceipt'
import {
  URL_PATH_ACCOUNTING,
  URL_PATH_INVESTMENT_PORTFOLIO,
} from '@/constants/apis'

const URL_PATH = `${URL_PATH_ACCOUNTING}/v2/voucher`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v2',
  accounting_receipt: {} as IAccountingReceiptCreate,
  accounting_receipt_list: [] as IAccountingReceiptItem[],
  accounting_receipt_pages: {
    currentPage: 0,
    lastPage: 0,
  },
})

export const useAccountingReceiptsV2 = defineStore('accounting-receipts-v2', {
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
    async _createAccountingReceipt(payload: IAccountingReceiptCreate) {
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
            response.data ? 'success' : 'error',
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
    async _getVoucherLines(
      voucherId: number,
      options?: { page?: number; rows?: number }
    ) {
      let success: IVoucherLines<Partial<IVoucherAmount>> | null = null

      const page = options?.page ?? 1
      const rows = options?.rows ?? 10

      const query = `?paginate=1&page=${page}&rows=${rows}`

      await executeApi()
        .get(`/accounting/api/accounting/v2/voucher/${voucherId}/lines${query}`)
        .then((response) => {
          const pagination = response.data?.data ?? response.data

          const lines = Array.isArray(pagination?.data)
            ? pagination.data
            : Array.isArray(pagination)
            ? pagination
            : []

          if (this.accounting_receipt) {
            this.accounting_receipt.voucher_data = lines.map(
              (item: Partial<IVoucherAmount>) => ({
                id: item.id!,
                nature: item.nature!,
                account_id: item.account?.id ?? 0,
                third_party_id: item.third_party?.id ?? 0,
                cost_center_id: item.cost_center?.id ?? null,
                register_detail: item.register_detail!,
                debit: item.debit ?? '',
                credit: item.credit ?? '',
                foreign_currency: item.foreign_currency ?? '',
                account: item.account,
                third_party: item.third_party,
                cost_center: item.cost_center,
                currency: item.currency,
                currency_id: item.currency?.id ?? 0,
              })
            )
          }

          success = {
            rows: this.accounting_receipt?.voucher_data ?? [],
            currentPage: pagination.current_page ?? 1,
            lastPage: pagination.last_page ?? 1,
            total:
              pagination.total ??
              this.accounting_receipt?.voucher_data?.length ??
              0,
            perPage: pagination.per_page ?? rows,
          }

          return success
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _getCoinById(coinId: number) {
      let coinData = null
      await executeApi()
        .get(
          `${URL_PATH_INVESTMENT_PORTFOLIO}/select-tables?keys[]=coins&filter[id]=${coinId}`
        )
        .then((response) => {
          if (response.data.success) {
            const coin = response.data.data.coins[0]
            coinData = `${coin.code} - ${coin.description} `
          }
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return coinData
    },
  },
})
