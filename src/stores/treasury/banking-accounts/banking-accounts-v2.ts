import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  IBankAccount,
  IBankAccountPerformance,
  IBankAccountRestatement,
  IBankingAccountsList,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const TIMEOUT_ALERT = 3000

export const useBankingAccountsV2 = defineStore('banking-accounts-v2', {
  state: () => ({
    banking_accounts_list: [] as IBankingAccountsList[] | [],
    banking_accounts_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as IBankAccount | null,
    data_performance_form: null as IBankAccountPerformance | null,
    data_restatement_form: null as IBankAccountRestatement | null,
    error_information_form: null as string | null,
    information_receipt_request: null as IBankAccount | null,
    performance_receipt_request: null as IBankAccountPerformance | null,
    restatement_receipt_request: null as IBankAccountRestatement | null,
    businessTrustHasCostCenter: false as boolean,
  }),

  actions: {
    async _getBankingAccountsList(params: string) {
      this.banking_accounts_list = []
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/v2/bank-accounts?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.banking_accounts_list = response.data?.data?.data ?? []
            this.banking_accounts_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.banking_accounts_pages.lastPage =
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

    async _createBankingAccounts(payload: object): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_TREASURIES}/bank-accounts`, payload)
        .then((response) => {
          success = response.data.success
          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          this.error_information_form = error.response.data.message
        })
      return success
    },

    async _getByIdBankingAccounts(id: number) {
      this.information_receipt_request = null
      this.performance_receipt_request = null
      this.restatement_receipt_request = null

      await executeApi()
        .get(`${URL_PATH_TREASURIES}/v2/bank-accounts/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.information_receipt_request =
              response.data.data.data_basic ?? null
            this.performance_receipt_request =
              response.data.data.performance ?? null
            this.restatement_receipt_request =
              response.data.data.restatement ?? null
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

    async _deleteBankingAccounts(params: number) {
      await executeApi()
        .delete(`${URL_PATH_TREASURIES}/bank-accounts/${params}`)
        .then((response) => {
          showAlert(response.data.message, 'success')
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _updateBankingAccounts(
      id: number,
      payload: object
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_TREASURIES}/bank-accounts/${id}`, payload)
        .then((response) => {
          success = response.data.success
          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          this.error_information_form = error.response.data.message
        })
      return success
    },

    async _isValidDataBasicForm(payload: object) {
      let success = false
      await executeApi()
        .post(
          `${URL_PATH_TREASURIES}/v2/bank-accounts/validate-basic-data`,
          payload
        )
        .then((response) => {
          success = response.data.success
          showAlert(
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

    async _isValidDataBasicEditForm(payload: object, bankingEntitieId: number) {
      let success = false
      await executeApi()
        .put(
          `${URL_PATH_TREASURIES}/bank-accounts/validate-basic-data-update/${bankingEntitieId}`,
          payload
        )
        .then((response) => {
          success = response.data.success
          showAlert(
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

    async _isValidPerformanceForm(payload: object) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_TREASURIES}/bank-accounts/validate-performance`, {
          performance: payload,
        })
        .then((response) => {
          success = response.data.success
          showAlert(
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

    async _isValidRestatementForm(payload: object) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_TREASURIES}/bank-accounts/validate-restatement`, {
          restatement: payload,
        })
        .then((response) => {
          success = response.data.success
          showAlert(
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

    _resetBankingAccountForms() {
      this.data_information_form = null
      this.data_performance_form = null
      this.data_restatement_form = null
    },

    async _setDataBasicBankingAccount(data: IBankAccount | null) {
      this.data_information_form = data ? { ...data } : null
    },

    async _setDataPerformanceBankingAccount(
      data: IBankAccountPerformance | null
    ) {
      this.data_performance_form = data ? { ...data } : null
    },

    async _setDataRestatementBankingAccount(
      data: IBankAccountRestatement | null
    ) {
      this.data_restatement_form = data ? { ...data } : null
    },

    async _dataBasicError(data: string | null) {
      this.error_information_form = data ? { ...JSON.parse(data) } : null
    },

    async _setBusinessTrustHasCostCenter(has_cost_center: boolean) {
      this.businessTrustHasCostCenter = has_cost_center
    },

    async _exportBankingAccountsExcel(params: string): Promise<void> {
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/bank-accounts/export?${params}`, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const today = new Date()
          const year = today.getFullYear()
          const month = String(today.getMonth() + 1).padStart(2, '0')
          const day = String(today.getDate()).padStart(2, '0')
          const dateString = `${year}-${month}-${day}`

          const fileName = `Listado_de_cuentas_bancarias_${dateString}.xlsx`

          const link = document.createElement('a')
          const url = URL.createObjectURL(blob)
          link.href = url
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          link.remove()
          URL.revokeObjectURL(url)

          showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
        })
        .catch(async (error) => {
          let errorMessage = 'Error al descargar el archivo Excel'

          if (error.response) {
            if (error.response.data instanceof Blob) {
              try {
                const text = await error.response.data.text()

                if (
                  error.response.headers['content-type']?.includes(
                    'application/json'
                  )
                ) {
                  const jsonError = JSON.parse(text)
                  errorMessage = jsonError.message || errorMessage
                }
              } catch (parseError) {}
            } else if (error.response.data?.message) {
              errorMessage = error.response.data.message
            }
          } else if (error.message) {
            errorMessage = error.message
          }

          showAlert(errorMessage, 'error', undefined, TIMEOUT_ALERT)
        })
    },
  },
})
