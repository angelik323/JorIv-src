// Apis - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
//Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'
import { useUtils } from '@/composables'
//Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_BUDGET } from '@/constants/apis'
//Interfaces
import type { IErrors } from '@/interfaces/global/errorMessage'
import { IPaginated } from '@/interfaces/customs'
import {
  IBudgetRegistrationCertificateList,
  IBudgetRegistrationCertificateListResponse,
  IBudgetRegistrationCertificateExportResponse,
  IBudgetRegistrationCertificateStatusResponse,
} from '@/interfaces/customs/budget/BudgetRegistrationCertificate'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const URL_PATH = `${URL_PATH_BUDGET}/budget-registration-certificates`
export const useBudgetRegistrationCertificateStoreV1 = defineStore(
  'budget-transfer-query-v1',
  {
    state: () => ({ version: 'v1' }),
    actions: {
      async _listAction(
        params: Record<string, string | number>
      ): Promise<
        IPaginated<IBudgetRegistrationCertificateList> &
          Omit<IBudgetRegistrationCertificateListResponse, 'data'>
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

      async _generateAction(
        params: unknown
      ): Promise<{ success: boolean; data: unknown }> {
        let success = false
        let data: unknown

        await executeApi()
          .post(`${URL_PATH}/generate`, params)
          .then((response) => {
            const {
              message,
              success: responseSuccess,
              data: responseData,
            } = response.data
            success = responseSuccess
            data = responseData?.certificates || []

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return { success, data }
      },

      async _showAction(documentNumber: string | number) {
        return await executeApi()
          .get(`${URL_PATH}/${documentNumber}`)
          .then((response) => {
            const { data, success, message } = response.data

            if (!success) {
              showAlert(
                message || 'Error al obtener el certificado',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
            }

            return data
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _bulkExportPDFAction(): Promise<IBudgetRegistrationCertificateExportResponse> {
        return await executeApi()
          .get(`${URL_PATH}/export-pdf`, { responseType: 'blob' })
          .then((res) => {
            const contentType =
              res.headers['content-type'] || res.headers['Content-Type']

            // NOTE: <= 25 Certificates - Download immediately
            if (contentType === 'application/pdf') {
              const blob = new Blob([res.data], {
                type: contentType,
              })
              const fileName = useUtils().getNameBlob(res)

              useUtils().downloadBlob(blob, fileName)
              showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
              return { success: true, data: null }
            }

            // NOTE: > 25 Certificates - Process in background
            // Convert blob to JSON
            return res.data.text().then((text: string) => {
              const jsonData = JSON.parse(text)
              const { success, data, message } = jsonData

              showAlert(
                message || 'Proceso de generación iniciado',
                success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )

              return { success, data }
            })
          })
          .catch((err) => {
            showAlert(showCatchError(err), 'error', undefined, TIMEOUT_ALERT)
            return { success: false, data: null }
          })
      },

      async _getCertificatesGenerationStatus(
        fileExportableId: number
      ): Promise<IBudgetRegistrationCertificateStatusResponse | null> {
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

      async _exportPDFAction(id?: number) {
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
            showAlert('Descarga exitosa', 'success', undefined, TIMEOUT_ALERT)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getBlobPreview(id: number): Promise<Blob | null> {
        try {
          const response = await executeApi().get(`${URL_PATH}/export-pdf`, {
            params: { id },
            responseType: 'blob',
          })

          const blob = new Blob([response.data], {
            type: response.headers['content-type'] || 'application/pdf',
          })

          return blob
        } catch (error) {
          showAlert(
            showCatchError(error as IErrors),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
          return null
        }
      },
    },
  }
)
