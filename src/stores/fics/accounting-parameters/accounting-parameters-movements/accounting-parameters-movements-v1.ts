// Vue - Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import { IAccountingParametersAccountingBlockList } from '@/interfaces/customs/fics/AccountingBlocks'
import {
  IAccountingParametersMovementsForm,
  IAccountingParametersMovementsView,
  IAccountingParametersMovementsList,
} from '@/interfaces/customs/fics/AccountingParametersMovements'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_FICS}/accounting-parameters-movements`

export const useAccountingParametersAccountingParametersMovementsStoreV1 =
  defineStore('accounting-parameters-movements-store-v1', {
    state: () => ({
      accounting_parameters_movements_list:
        [] as IAccountingParametersMovementsList,
      accounting_parameters_movements_form:
        null as IAccountingParametersMovementsForm | null,
      accounting_parameters_movements_view:
        null as IAccountingParametersMovementsView | null,
      accounting_parameters_movements_block_selected:
        null as IAccountingParametersAccountingBlockList | null,
      accounting_parameters_movements_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
    }),

    actions: {
      async _getAccountingParametersMovements(params: string) {
        this._clearDataAccountingParametersMovements()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            const {
              data: {
                data: items = [],
                current_page = 0,
                last_page = 0,
                total = 0,
                per_page = 0,
              },
              message,
              success,
            } = response.data

            this.accounting_parameters_movements_list =
              items as IAccountingParametersMovementsList
            this.accounting_parameters_movements_pages.currentPage =
              current_page
            this.accounting_parameters_movements_pages.lastPage = last_page
            this.accounting_parameters_movements_pages.total_items = total
            this.accounting_parameters_movements_pages.per_page = per_page

            return showAlert(
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

      async _getByIdAccountingParametersMovements(id: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.accounting_parameters_movements_view = { ...responseData }
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

      async _createAccountingParametersMovements(
        data: IAccountingParametersMovementsForm
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH}`, data)
          .then((response) => {
            const { message, success } = response.data
            isSuccess = success ?? false

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

        return isSuccess
      },

      async _updateAccountingParametersMovements(
        data: IAccountingParametersMovementsForm,
        id: number
      ) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(`${URL_PATH}/${id}`, data)
          .then((response) => {
            const { message, success } = response.data
            isSuccess = success ?? false

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

        return isSuccess
      },

      async _deleteAccountingParametersMovements(id: number) {
        let isSuccess = false

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .delete(`${URL_PATH}/${id}`)
          .then((response) => {
            const { message, success } = response.data
            isSuccess = success ?? false

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

        return isSuccess
      },

      _setAccountingParametersMovementsForm(
        data: IAccountingParametersMovementsForm | null
      ) {
        this.accounting_parameters_movements_form = data
      },

      _setAccountingParametersMovementsBlockSelected(
        data: IAccountingParametersAccountingBlockList | null
      ) {
        this.accounting_parameters_movements_block_selected = data
          ? { ...data }
          : null
      },

      _clearDataAccountingParametersMovements() {
        this.accounting_parameters_movements_list = []
        this.accounting_parameters_movements_view = null
        this.accounting_parameters_movements_form = null
        this.accounting_parameters_movements_pages = {
          currentPage: 0,
          lastPage: 0,
          total_items: 0,
          per_page: 0,
        }
      },
    },
    persist: true,
  })
