import {
  IAccountingBlockResponse,
  IAccountingBlockInformationForm,
  IAccountingBlockToCreate,
  IAccountingBlockToEdit,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'

const URL_PATH = `${URL_PATH_TREASURIES}/accounting-blocks`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingBlocksStoreV1 = defineStore(
  'accounting-blocks-store-v1',
  {
    state: () => ({
      accounting_blocks_list: [] as IAccountingBlockResponse[],
      accounting_blocks_response:
        null as IAccountingBlockInformationForm | null,
      accounting_blocks_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
      data_information_form: null as IAccountingBlockInformationForm | null,
    }),

    actions: {
      async _getAccountingBlocks(params: string) {
        this._clearData()

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

            this.accounting_blocks_list = items
            this.accounting_blocks_pages.currentPage = current_page
            this.accounting_blocks_pages.lastPage = last_page
            this.accounting_blocks_pages.total_items = total
            this.accounting_blocks_pages.per_page = per_page

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
              this.accounting_blocks_response = { ...responseData }
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

      async _createAccountingBlock(data: IAccountingBlockToCreate) {
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

      async _updateAccountingBlock(data: IAccountingBlockToEdit, id: number) {
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

      async _deleteAccountingBlock(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/${id}`)
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

      _setDataInformationForm(
        data_to_set: IAccountingBlockInformationForm | null
      ) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },

      _clearData() {
        this.accounting_blocks_list = []
        this.accounting_blocks_response = null
        this.data_information_form = null
        this.accounting_blocks_pages = {
          currentPage: 0,
          lastPage: 0,
          total_items: 0,
          per_page: 0,
        }

        this._setDataInformationForm(null)
      },
    },
  }
)
