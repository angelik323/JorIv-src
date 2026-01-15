import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IInvoiceGenerationForm,
  IInvoiceGenerationList,
  IInvoiceGenerationResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_BILLING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useInvoiceGenerationStoreV1 = defineStore(
  'invoice-generation-store-v1',
  {
    state: () => ({
      version: 'v1',
      invoice_generation_list: [] as IInvoiceGenerationList[],
      invoice_generation_list_comissions: [] as IInvoiceGenerationList[],
      invoice_generation_response: null as IInvoiceGenerationResponse | null,
      invoice_generation_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getInvoiceGenerationList(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_BILLING}/generation-commission-invoices`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.invoice_generation_list = items
            this.invoice_generation_pages.currentPage = current_page
            this.invoice_generation_pages.lastPage = last_page

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

      async _getInvoiceGenerationListCommisions(
        params: Record<string, string | number>
      ) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_BILLING}/generation-commission-invoices`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.invoice_generation_list_comissions = items
            this.invoice_generation_pages.currentPage = current_page
            this.invoice_generation_pages.lastPage = last_page

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

      async _createInvoiceGeneration(data: Partial<IInvoiceGenerationForm>) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_BILLING}/generation-commission-invoices/massive`,
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

      async _getByIdInvoiceGeneration(id: number) {
        await executeApi()
          .get(`${URL_PATH_BILLING}/generation-commission-invoices/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.invoice_generation_response = { ...responseData }
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

      async _generateInvoice(id: number): Promise<boolean> {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_BILLING}/generation-commission-invoices/${id}/generate`
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
        this.invoice_generation_list = []
        this.invoice_generation_response = null
        this.invoice_generation_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
