import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IBankAccountBalance } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const TIMEOUT_ALERT = 3000
const URL_PATH = 'treasuries/api/treasuries/initial-balances'

export const useBankAccountBalancesV1 = defineStore(
  'bank-account-balances-v1',
  {
    state: () => ({
      version: 'v1',
      bank_account_balances_list: [] as IBankAccountBalance[],
      bank_account_balances_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IBankAccountBalance | null,
      type_accont_balances_request: null as IBankAccountBalance | null,
    }),

    actions: {
      async _getListAction(params: string = '', pages: number = 20) {
        this._cleanBankAccountBalancesData()
        await executeApi()
          .get(`${URL_PATH}?paginate=1&rows=${pages}${params}`)
          .then((response) => {
            if (response.data.success) {
              this.bank_account_balances_list = response.data?.data?.data ?? []
              this.bank_account_balances_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }
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
      },

      async _getByIdBankAccountBalances(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) {
              const res: IBankAccountBalance = response.data?.data
              if (res) {
                this.type_accont_balances_request = res
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

      async _createBankAccountBalances(
        data: IBankAccountBalance
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, data)
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

      async _updateBankAccountBalances(data: IBankAccountBalance, id: number) {
        let success = false
        this.type_accont_balances_request = null

        await executeApi()
          .put(`${URL_PATH}/${id}`, data)
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
          .delete(`${URL_PATH}/${id}`)
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

      _setDataInformationForm(data_to_set: IBankAccountBalance | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _cleanBankAccountBalancesData() {
        this.bank_account_balances_list = []
        this.bank_account_balances_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
