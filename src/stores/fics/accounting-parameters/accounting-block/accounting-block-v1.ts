// Vue - Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import {
  IAccountingParametersAccountingBlockList,
  IAccountingParametersAccountingBlockForm,
  IAccountingParametersAccountingBlockView,
} from '@/interfaces/customs/fics/AccountingBlocks'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_FICS}/accounting-blocks`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingParametersAccountingBlockStoreV1 = defineStore(
  'accounting-block-store-v1',
  {
    state: () => ({
      accounting_block_list: [] as IAccountingParametersAccountingBlockList[],
      accounting_block_form:
        null as IAccountingParametersAccountingBlockForm | null,
      accounting_block_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
      accounting_block_selected:
        null as IAccountingParametersAccountingBlockList | null,
      accounting_block_view:
        null as IAccountingParametersAccountingBlockView | null,
    }),

    actions: {
      async _getAccountingBlock(params: string) {
        this._clearDataAccountingBlock()

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
            } = response.data

            this.accounting_block_list = items
            this.accounting_block_pages.currentPage = current_page
            this.accounting_block_pages.lastPage = last_page
            this.accounting_block_pages.total_items = total
            this.accounting_block_pages.per_page = per_page

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
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

      async _getByIdAccountingBlock(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.accounting_block_view = { ...responseData }
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

      async _createAccountingBlock(
        data: IAccountingParametersAccountingBlockForm
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

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

        return success
      },

      async _updateAccountingBlock(
        data: IAccountingParametersAccountingBlockForm,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/${id}`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

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

        return success
      },

      _setAccountingBlockForm(
        data: IAccountingParametersAccountingBlockForm | null
      ) {
        this.accounting_block_form = data ? { ...data } : null
      },

      _setAccountingBlockSelected(
        data: IAccountingParametersAccountingBlockList | null
      ) {
        this.accounting_block_selected = data ? { ...data } : null
      },

      _setAccountingBlockView(
        data: IAccountingParametersAccountingBlockView | null
      ) {
        this.accounting_block_view = data ? { ...data } : null
      },

      _clearDataAccountingBlock() {
        this.$reset()
      },
    },
  }
)
