import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IUploadAccountingVoucherFailure,
  IUploadAccountingVoucherList,
  IUploadAccountingVouchersProcess,
  IUploadAccountingVouchersTempData,
  QueueJobStatusV2,
  UploadVoucherErrorRow,
} from '@/interfaces/customs'
import { defineStore } from 'pinia'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}

export const useUploadAccountingVouchersStoreV2 = defineStore(
  'upload-accounting-vouchers-store-v2',
  {
    state: () => ({
      version: 'v2',
      documents_import: null as File | null,
      data_errors_file: null,
      total_records: null as number | null,
      temp_data_import: {} as IUploadAccountingVouchersTempData,
      failed_count: 0 as number,
      data_process: {} as IUploadAccountingVouchersProcess,
    }),
    actions: {
      async _getFormatExcel(): Promise<void> {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/vouchers-upload/download-template`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _exportErrors(
        failures: IUploadAccountingVoucherFailure[]
      ): Promise<void> {
        const exportPayload = failures.map(
          ({ index, receipt_type, errors }) => ({
            index,
            receipt_type,
            errors,
          })
        )

        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/vouchers-upload/export-failures`,
            { failures: exportPayload },
            { responseType: 'blob' }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      _setDataDocuments(data_to_set: File | null) {
        this.documents_import = data_to_set
      },

      async _getListAction(params: string): Promise<{
        rows: IUploadAccountingVoucherList[]
        currentPage: number
        lastPage: number
      } | null> {
        let result: {
          rows: IUploadAccountingVoucherList[]
          currentPage: number
          lastPage: number
        } | null = null

        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/vouchers-upload?paginate=1${params}`)
          .then((response) => {
            const data = response.data
            const payload = data?.data

            const rows: IUploadAccountingVoucherList[] = Array.isArray(
              payload?.data
            )
              ? payload.data
              : []

            const currentPage = payload?.current_page ?? 1
            const lastPage = payload?.last_page ?? 1

            showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            result = {
              rows,
              currentPage,
              lastPage,
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            result = null
          })

        return result
      },

      async _exportExcelUploadVouchers(id: number): Promise<void> {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/voucher/export?ids[]=${id}`, {
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _importUploadVouchers(): Promise<number | null> {
        let queueId: number | null = null

        const formData = new FormData()
        if (this.documents_import) {
          formData.append('file', this.documents_import)
        }
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/vouchers-upload/validate`,
            formData,
            CONFIG
          )
          .then((response) => {
            const topSuccess = response.data?.success
            const payload = response.data?.data

            if (payload) {
              const { success, queue_id, file_name } = payload

              if (success && queue_id) {
                queueId = queue_id

                this.temp_data_import = {
                  ...(this.temp_data_import || {}),
                  queue_id,
                  file_name,
                  status_id: 20,
                } as IUploadAccountingVouchersTempData
              } else {
                this.temp_data_import = {} as IUploadAccountingVouchersTempData
              }
            }

            return showAlert(
              response.data.message ??
                'El archivo ha sido recibido y se está procesando.',
              topSuccess ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            this.total_records = 0
            this.temp_data_import = {} as IUploadAccountingVouchersTempData
            this.failed_count = 0
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return queueId
      },

      async _getQueueJobStatus(
        queueId: number | string
      ): Promise<QueueJobStatusV2 | null> {
        let dataQueue: QueueJobStatusV2 | null = null

        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/queues/${queueId}/upload-vouchers-import`
          )
          .then((response) => {
            dataQueue = response.data?.data as QueueJobStatusV2
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            dataQueue = null
          })

        return dataQueue
      },
      async _processUploadVouchers(
        payload: IUploadAccountingVouchersTempData
      ): Promise<boolean> {
        let success = false
        await executeApi()
          .post(`${URL_PATH_ACCOUNTING}/v2/vouchers-upload`, payload)
          .then((response) => {
            success = response.data.success
            this.data_process = response.data.data || {}
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
        return success
      },
      async _getUploadVoucherErrors(
        id: number,
        extraFilters = ''
      ): Promise<{
        rows: UploadVoucherErrorRow[]
        currentPage: number
        lastPage: number
      } | null> {
        return await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/vouchers-upload/${id}/errors?paginate=true${extraFilters}`
          )
          .then((response) => {
            const payload = response.data?.data
            const data = Array.isArray(payload?.data) ? payload.data : []

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rows = data.map((item: any, idx: number) => ({
              index: idx + 1,
              consecutivo_de_registros: item.index,
              codigo_de_comprobante: item.field,
              errors: item.message,
            }))

            return {
              rows,
              currentPage: Number(payload?.current_page ?? 1),
              lastPage: Number(payload?.last_page ?? 1),
            }
          })
          .catch(() => null)
      },
    },
  }
)
