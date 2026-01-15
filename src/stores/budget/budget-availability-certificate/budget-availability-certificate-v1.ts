//Apis - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import { IPaginated } from '@/interfaces/customs'
import {
  IBudgetAvailabilityCertificateExportResponse,
  IBudgetAvailabilityCertificateForm,
  IBudgetAvailabilityCertificateList,
  IBudgetAvailabilityCertificateListExtraFields,
  IBudgetAvailabilityCertificateStatusResponse,
} from '@/interfaces/customs/budget/BudgetAvailabilityCertificate'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_BUDGET } from '@/constants/apis'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

const URL_PATH = `${URL_PATH_BUDGET}/budget-availability-certificates`

export const useBudgetAvailabilityCertificateStoreV1 = defineStore(
  'budget-availability-certificate-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _listAction(
        params: Record<string, string | number>
      ): Promise<
        IPaginated<IBudgetAvailabilityCertificateList> &
          IBudgetAvailabilityCertificateListExtraFields
      > {
        return await executeApi()
          .get(`${URL_PATH}/list`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: {
                data: items = [],
                current_page = 0,
                last_page = 0,
                last_description_society = '',
                last_file_exportable_id = null,
              },
              message,
              success,
            } = response.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return {
              success,
              last_description_society,
              last_file_exportable_id,
              list: items,
              pages: { currentPage: current_page, lastPage: last_page },
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)

            return {
              success: false,
              last_description_society: '',
              last_file_exportable_id: null,
              list: [],
              pages: { currentPage: 0, lastPage: 0 },
            }
          })
      },

      async _generateAction(payload: IBudgetAvailabilityCertificateForm) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/generate`, payload)
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

      async _showAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) return response.data.data

            return showAlert(
              response.data.message,
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _bulkExportPDFAction(): Promise<IBudgetAvailabilityCertificateExportResponse> {
        return await executeApi()
          .get(`${URL_PATH}/export-pdf`)
          .then((res) => {
            // NOTE: <= 25 Certificates
            if (res.headers['Content-Type'] === 'application/pdf') {
              const blob = new Blob([res.data], {
                type: res.headers['content-type'],
              })
              const fileName = useUtils().getNameBlob(res)

              useUtils().downloadBlob(blob, fileName)
              showAlert(
                res.data.message || 'Descarga exitosa',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
              return { success: res.data.success, data: null }
            }

            // NOTE: > 25 Certificates
            return { success: res.data.success, data: res.data.data }
          })
          .catch((err) => {
            showAlert(showCatchError(err), 'error', undefined, TIMEOUT_ALERT)
            return { success: false, data: null }
          })
      },

      async _getCertificatesGenerationStatus(
        fileExportableId: number
      ): Promise<IBudgetAvailabilityCertificateStatusResponse | null> {
        return await executeApi()
          .get(`${URL_PATH}/export-pdf/${fileExportableId}`)
          .then((res) => {
            const { success, data = null, message } = res.data
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return data
          })
          .catch((err) => {
            showAlert(showCatchError(err), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _exportPDFActionById(id: number) {
        await executeApi()
          .get(`${URL_PATH}/export-pdf`, {
            params: { id },
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)

            useUtils().downloadBlob(blob, fileName)
            showAlert(
              response.data.message || 'Descarga exitosa',
              'success',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getCertificatePDFBlobById(id: number): Promise<Blob | null> {
        return await executeApi()
          .get(`${URL_PATH}/export-pdf`, {
            params: { id },
            responseType: 'blob',
          })
          .then((response) => {
            return new Blob([response.data], {
              type: response.headers['content-type'],
            })
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
    },
  }
)
