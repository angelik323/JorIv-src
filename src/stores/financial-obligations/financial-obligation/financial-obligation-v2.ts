// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import {
  IFinancialObligationCreateV2,
  IFinancialObligationDetailV2,
  IFinancialObligationListItemV2,
  IFinancialObligationUpdateV2,
  IPaymentPlanCalculateRequest,
  IPaymentPlanCalculateResponse,
  IAttachmentUploadTempResponse,
  ISarlaftValidationResponse,
} from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'
import { IErrors } from '@/interfaces/global'

// composables
import { useAlert, useShowError, useUtils } from '@/composables'

// constants
import { URL_PATH_FINANCIAL_OBLIGATION } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// store constants
const INITIAL_ID_VALUE = 0

const HEADER_PROPS_DEFAULT = {
  title: 'Obligaciones financieras',
  breadcrumbs: [
    { label: 'Inicio', route: 'HomeView' },
    { label: 'Negocios fiduciarios' },
    { label: 'Obligaciones financieras', route: 'FinancialObligationList' },
  ],
}

export const useFinancialObligationStoreV2 = defineStore(
  'financial-obligation-v2',
  {
    state: () => ({
      version: 'v2',
      headerPropsDefault: HEADER_PROPS_DEFAULT,
    }),

    actions: {
      // ============ List Operations ============

      async _getFinancialObligationList(
        params: Record<string, string | number>
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let list: IFinancialObligationListItemV2[] = []
        let pages = { currentPage: 1, lastPage: 1 }

        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            queryParams.append(key, String(value))
          }
        })

        const queryString = queryParams.toString()
        const url = queryString
          ? `${URL_PATH_FINANCIAL_OBLIGATION}/v2/obligations/list?${queryString}`
          : `${URL_PATH_FINANCIAL_OBLIGATION}/v2/obligations/list`

        await executeApi()
          .get(url)
          .then((response) => {
            const responseData = response.data?.data

            if (Array.isArray(responseData)) {
              list = responseData
              pages = { currentPage: 1, lastPage: 1 }
            } else {
              list = responseData?.data ?? []
              pages = {
                currentPage: responseData?.current_page ?? 1,
                lastPage: responseData?.last_page ?? 1,
              }
            }
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return { list, pages }
      },

      // ============ CRUD Operations ============

      async _getFinancialObligationById(
        id: number
      ): Promise<IFinancialObligationDetailV2 | null> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let result: IFinancialObligationDetailV2 | null = null

        await executeApi()
          .get(`${URL_PATH_FINANCIAL_OBLIGATION}/v2/obligations/show/${id}`)
          .then((response) => {
            result = response.data?.data ?? null
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return result
      },

      async _createFinancialObligation(data: IFinancialObligationCreateV2) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let success = false
        let id = INITIAL_ID_VALUE

        await executeApi()
          .post(`${URL_PATH_FINANCIAL_OBLIGATION}/v2/obligations/store`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false
            id = response.data?.data?.id ?? INITIAL_ID_VALUE

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return { success, id }
      },

      async _updateFinancialObligation(
        id: number,
        data: IFinancialObligationUpdateV2
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let success = false

        await executeApi()
          .put(`${URL_PATH_FINANCIAL_OBLIGATION}/v2/obligations/update`, {
            id,
            ...data,
          })
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
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      // ============ Validation ============

      async _validateSarlaft(
        clientId: number
      ): Promise<ISarlaftValidationResponse> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let result: ISarlaftValidationResponse = {
          success: false,
          is_valid: false,
          message: null,
        }

        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/v2/validate-sarlaft/${clientId}`
          )
          .then((response) => {
            result = {
              success: response.data?.success ?? false,
              is_valid: response.data?.data?.is_valid ?? false,
              message: response.data?.message ?? null,
            }

            showAlert(
              result.message ?? 'Validación SARLAFT completada',
              result.is_valid ? 'success' : 'warning',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return result
      },

      // ============ Payment Plan ============

      async _calculatePaymentPlan(
        data: IPaymentPlanCalculateRequest
      ): Promise<IPaymentPlanCalculateResponse> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let result: IPaymentPlanCalculateResponse = {
          success: false,
          basic_data: null,
          quotas: [],
        }

        await executeApi()
          .post(
            `${URL_PATH_FINANCIAL_OBLIGATION}/v2/payment-plans/calculate`,
            data
          )
          .then((response) => {
            const responseData = response.data?.data
            result = {
              success: response.data?.success ?? false,
              basic_data: responseData?.basic_data ?? null,
              quotas: responseData?.quotas ?? [],
            }
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return result
      },

      // ============ Documents ============

      async _uploadAttachmentsTemp(
        files: File[]
      ): Promise<IAttachmentUploadTempResponse> {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let result: IAttachmentUploadTempResponse = {
          success: false,
          attachments_cache_key: null,
          files_count: 0,
          expires_at: null,
        }

        const formData = new FormData()
        files.forEach((file) => {
          formData.append('attachments[]', file)
        })

        await executeApi()
          .post(
            `${URL_PATH_FINANCIAL_OBLIGATION}/v2/attachments/upload`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then((response) => {
            const responseData = response.data?.data
            result = {
              success: response.data?.success ?? false,
              attachments_cache_key:
                responseData?.attachments_cache_key ?? null,
              files_count: responseData?.files_count ?? 0,
              expires_at: responseData?.expires_at ?? null,
            }
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return result
      },

      async _addFinancialObligationDocument(obligationId: number, file: File) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let success = false

        const formData = new FormData()
        formData.append('attachments[]', file)

        await executeApi()
          .post(
            `${URL_PATH_FINANCIAL_OBLIGATION}/v2/attachments/validate-updates/${obligationId}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            }
          )
          .then((response) => {
            const { message, success: responseSuccess } = response.data

            success = responseSuccess

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return { success }
      },

      async _updateFinancialObligationDocuments(
        obligationId: number,
        data: Record<string, string | boolean | string[]>
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let success = false

        await executeApi()
          .post(
            `${URL_PATH_FINANCIAL_OBLIGATION}/v2/attachments/validate-updates/${obligationId}`,
            data
          )
          .then((response) => {
            const { message, success: responseSuccess } = response.data
            success = responseSuccess

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _deleteFinancialObligationDocuments(
        obligationId: number,
        documentIds: number[]
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let success = false

        await executeApi()
          .post(
            `${URL_PATH_FINANCIAL_OBLIGATION}/v2/delete-files/${obligationId}`,
            {
              documents: documentIds,
            }
          )
          .then((response) => {
            const { message, success: responseSuccess } = response.data
            success = responseSuccess

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      // ============ Export ============

      async _downloadFinancialObligationList(params: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/v2/export?paginate=1${params}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = getNameBlob(response)
            downloadBlobXlxx(blob, fileName)
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadFinancialObligationListByIds(params: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        let url = `${URL_PATH_FINANCIAL_OBLIGATION}/v2/obligations/export`
        if (params && params !== '') {
          url += params.startsWith('?') ? params : `?${params}`
        }

        await executeApi()
          .get(url, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = getNameBlob(response)
            downloadBlobXlxx(blob, fileName)
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _downloadPaymentPlan(obligationId: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        const { getNameBlob, downloadBlobXlxx } = useUtils()

        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/v2/obligations/export-complete/${obligationId}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = getNameBlob(response)
            downloadBlobXlxx(blob, fileName)
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _authorize(id: number, action: boolean, observation: string) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        let success = false

        await executeApi()
          .post(`${URL_PATH_FINANCIAL_OBLIGATION}/v2/obligations/authorize`, {
            financial_obligation_id: id,
            authorized: action,
            observations: observation,
          })
          .then((response) => {
            const { message, success: responseSuccess } = response.data
            success = responseSuccess

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _downloadObligationDetail(obligationId: number) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()
        const { downloadBlobXlxx, formatDate } = useUtils()

        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/v2/payment-plans/export/${obligationId}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const currentDate = formatDate('', 'YYYY-MM-DD')
            const fileName = `Detalles_de_la_obligación_financiera_${obligationId}_${currentDate}.xlsx`
            downloadBlobXlxx(blob, fileName)
          })
          .catch((e) => {
            const message = showCatchError(e as IErrors)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
