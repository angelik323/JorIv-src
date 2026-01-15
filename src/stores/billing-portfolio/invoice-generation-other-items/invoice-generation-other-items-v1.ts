import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IInvoiceGenerationOtherItemsForm,
  IInvoiceGenerationOtherItemsList,
  IInvoiceGenerationOtherItemsResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_BILLING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useInvoiceGenerationOtherItemsStoreV1 = defineStore(
  'invoice-generation-other-items-store-v1',
  {
    state: () => ({
      version: 'v1',
      invoice_generation_other_items_list:
        [] as IInvoiceGenerationOtherItemsList[],
      invoice_generation_other_items_response:
        null as IInvoiceGenerationOtherItemsResponse | null,
      invoice_generation_other_items_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getInvoiceGenerationOtherItemsList(
        params: Record<string, string | number>
      ) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_BILLING}/generation-invoices-other-concepts`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.invoice_generation_other_items_list = items
            this.invoice_generation_other_items_pages.currentPage = current_page
            this.invoice_generation_other_items_pages.lastPage = last_page

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

      async _createInvoiceGenerationOtherItem(
        data: Partial<IInvoiceGenerationOtherItemsForm>
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_BILLING}/generation-invoices-other-concepts`, data)
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

      async _getByIdInvoiceGenerationOtherItem(id: number) {
        await executeApi()
          .get(`${URL_PATH_BILLING}/generation-invoices-other-concepts/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.invoice_generation_other_items_response = { ...responseData }
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

      async _updateInvoiceGenerationOtherItem(
        data: Partial<IInvoiceGenerationOtherItemsForm>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_BILLING}/generation-invoices-other-concepts/${id}`,
            data
          )
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

      async _getFilePDFInvoiceGenerationOtherItem(id: number) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_BILLING}/generation-invoices-other-concepts/${id}/pdf`
          )
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

      _clearData() {
        this.invoice_generation_other_items_list = []
        this.invoice_generation_other_items_response = null
        this.invoice_generation_other_items_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
