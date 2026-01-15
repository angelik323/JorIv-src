// Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { IDetails, ITypeAccountingAction } from '@/interfaces/customs'

// Constants
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
const URL_PATH_TYPE_ACCOUNTING = `${URL_PATH_ACCOUNTING}/v2/receipt-type`

// Composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTypeAccountingReceiptStoreV2 = defineStore(
  'type-accounting-receipt-v2',
  {
    state: () => ({
      version: 'v2',
      type_accounting_receipt_list: [] as ITypeAccountingAction[] | [],
      type_accounting_receipt_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IDetails | null,
      type_accounting_request: null as ITypeAccountingAction | null,
    }),
    actions: {
      _cleanData() {
        this.type_accounting_receipt_list = []
        this.type_accounting_receipt_pages.currentPage = 0
        this.type_accounting_receipt_pages.lastPage = 0
      },
      async _getListAction(params: string) {
        await executeApi()
          .get(`${URL_PATH_TYPE_ACCOUNTING}?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.type_accounting_receipt_list =
                response.data?.data?.data ?? []
              this.type_accounting_receipt_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.type_accounting_receipt_pages.lastPage =
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

      async _getByIdTypeAccounting(id: number) {
        await executeApi()
          .get(`${URL_PATH_TYPE_ACCOUNTING}/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res: ITypeAccountingAction = response.data?.data
              if (res) {
                this.type_accounting_request = res
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

      async _createTypeAccountingReceipt(
        data: ITypeAccountingAction
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_TYPE_ACCOUNTING}`, data)
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

      async _getDataExcel(params: string): Promise<void> {
        await executeApi()
          .get(`${URL_PATH_TYPE_ACCOUNTING}/excel/export${params}`, {
            responseType: 'blob',
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

      async _updateTypeAccountingReceipt(
        data: ITypeAccountingAction,
        id: number
      ) {
        let success = false
        this.type_accounting_request = null

        await executeApi()
          .put(`${URL_PATH_TYPE_ACCOUNTING}/${id}`, data)
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

      async _changeStatusAction(id: number) {
        await executeApi()
          .get(`${URL_PATH_TYPE_ACCOUNTING}/switch-status/${id}`)
          .then((response) => {
            this._getListAction('')
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

      _setDataInformationForm(data_to_set: IDetails | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },
    },
  }
)
