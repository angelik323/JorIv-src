import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IUploadAccountingVoucherFailure,
  IUploadAccountingVoucherList,
  IUploadAccountingVouchersProcess,
  IUploadAccountingVouchersTempData,
  IViewUploadAccountingVouchers,
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

export const useUploadAccountingVouchersStoreV1 = defineStore(
  'upload-accounting-vouchers-store-v1',
  {
    state: () => ({
      version: 'v1',
      uploadAccountingVouchersList: [] as IUploadAccountingVoucherList[],
      documents_import: null as File | null,
      data_errors_file: null,
      total_records: null as number | null,
      temp_data_import: {} as IUploadAccountingVouchersTempData,
      uploadAccountingVoucherView: {} as IViewUploadAccountingVouchers,
      failed_count: 0 as number,
      data_process: {} as IUploadAccountingVouchersProcess,
    }),
    actions: {
      async _getFormatExcel(): Promise<void> {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/vouchers-upload/download-template`, {
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

      async _getListAction(params: string) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/vouchers-upload?paginate=1${params}`)
          .then((response) => {
            this.uploadAccountingVouchersList = response.data.data.data
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
      },

      async _showUploadAccountingVoucher(id: number): Promise<void> {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/voucher/${id}/show`)
          .then((response) => {
            this.uploadAccountingVoucherView = response.data.data
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
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

      async _importUploadVouchers(): Promise<boolean> {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/vouchers-upload/validate`,
            { file: this.documents_import },
            CONFIG
          )
          .then((response) => {
            success = response.data.success
            this.total_records = response.data.data?.total_count
            this.temp_data_import = response.data.data
            this.failed_count = response.data.data.failed_count || 0

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
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

        return success
      },

      async _getQueueJobStatus(
        queueId: number | string
      ): Promise<{ queue_id: number; status: string } | null> {
        let dataQueue: { queue_id: number; status: string } | null = null

        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/queues/${queueId}`, CONFIG)
          .then((response) => {
            dataQueue = response.data?.data
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
          .post(`${URL_PATH_ACCOUNTING}/vouchers-upload`, payload)
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

      _clearData() {
        this.uploadAccountingVouchersList = []
      },
    },
  }
)
