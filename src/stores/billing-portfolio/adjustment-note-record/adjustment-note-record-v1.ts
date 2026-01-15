// Vue - pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IPagination } from '@/interfaces/customs/fics/ConfigureUserPermissions'
import {
  IAdjustmentNoteRecordPayloadCreate,
  IInvoiceCommissionNote,
  IInvoiceCommissionNoteListResponse,
} from '@/interfaces/customs'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_BILLING } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_BILLING}/invoices-commission-notes`

export const useAdjustmentNoteRecordStoreV1 = defineStore(
  'adjustment-note-record-store-v1',
  {
    state: () => ({
      version: 'v1',
      list_invoices_comissions_note: [] as IInvoiceCommissionNote[],
      list_invoices_comissions_note_pages: {
        currentPage: 1,
        lastPage: 1,
      } as IPagination,
    }),

    actions: {
      async _createInvoiceAdjustmentNote(
        invoiceId: number,
        payload: IAdjustmentNoteRecordPayloadCreate
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/${invoiceId}/create`, payload)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _listInvoicesCommissionsNote(
        params: Record<string, string | number>
      ) {
        this.list_invoices_comissions_note = []

        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const data = response.data as {
              success: boolean
              message: string
              data: IInvoiceCommissionNoteListResponse
            }

            if (data.success) {
              this.list_invoices_comissions_note = data.data.data ?? []
              this.list_invoices_comissions_note_pages = {
                currentPage: data.data.current_page ?? 1,
                lastPage: data.data.last_page ?? 1,
                rowsPerPage: data.data.per_page ?? 20,
                rowsNumber: data.data.total ?? 0,
              }
            }

            return showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _showAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success)
              return response.data.data as IInvoiceCommissionNote

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _updateInvoiceAdjustmentNote(
        invoiceId: number,
        noteId: number,
        payload: IAdjustmentNoteRecordPayloadCreate
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/${invoiceId}/edit/${noteId}`, payload)
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
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },
    },
  }
)
