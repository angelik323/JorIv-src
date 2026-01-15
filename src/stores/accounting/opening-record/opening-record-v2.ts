// Vue - pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import { IAccountingReportList } from '@/interfaces/customs/accounting/v2/AccountingReport'
import { IAccountStructureResource } from '@/interfaces/customs/accounting/AccountStructure'
import { IPaginated } from '@/interfaces/customs/IPages'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'
import {
  ISuccessRow,
  IPendingRow,
  IOpeningRecord,
  IOpeningRecordModel,
  IOpeningRecordResponse,
  IOpeningRecordCreatePayload,
} from '@/interfaces/customs'

// Composables
import { useUtils, useAlert, useShowError } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTING}/v2/reports`
export const useOpeningRecordV2 = defineStore('opening-record-v2', {
  state: () => ({
    version: 'v2',
    opening_record_list: [] as IOpeningRecord[],
    opening_bussines_list: [] as IOpeningRecord[],
    opening_record_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    selected_opening_record: null as IOpeningRecord | null,
  }),

  actions: {
    async _getListOpeningRecord(params: string) {
      await executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/v2/accounting-period-opening/eligible-businesses?paginate=1${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.opening_record_list = response.data?.data?.data ?? []
            this.opening_record_pages = {
              currentPage: response.data?.data?.current_page ?? 1,
              lastPage: response.data?.data?.last_page ?? 1,
            }
          }

          return showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error: unknown) => {
          showAlert(
            showCatchError(error as IErrors),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
    },

    async _getListAction(params = '') {
      this._cleanOpeningRecordData()
      executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/reportables/business-trust-reports?${params}`,
          {
            params: { paginate: 1 },
          }
        )
        .then((response) => {
          if (response.data.success) {
            this.opening_record_list = response.data?.data?.data ?? []
            this.opening_record_pages = {
              currentPage: response.data?.data?.current_page ?? 1,
              lastPage: response.data?.data?.last_page ?? 1,
            }
          }
          return showAlert(
            response.data.message,
            'success',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _showAction(id: string) {
      return await executeApi()
        .get(`${URL_PATH_ACCOUNTING}/reportables/${id}/show`)
        .then((response) => {
          if (response.data.success) return response.data.data

          return showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error: unknown) => {
          showAlert(
            showCatchError(error as IErrors),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
          return null
        })
    },

    _cleanOpeningRecordData() {
      this.opening_record_list = []
      this.opening_record_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },

    async _createOpeningRecord(
      payload: IOpeningRecordCreatePayload
    ): Promise<IOpeningRecordResponse | null> {
      return executeApi()
        .post(
          `${URL_PATH_ACCOUNTING}/v2/accounting-period-opening/execute`,
          payload
        )
        .then((response) => {
          const data = response.data as IOpeningRecordResponse

          showAlert(
            data.message,
            data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )

          return data
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    async _updateOpeningRecord(
      structureId: number,
      chartId: number,
      payload: Partial<IOpeningRecordModel>
    ) {
      let success = false

      await executeApi()
        .put(
          `${URL_PATH_ACCOUNTING}/accounting-period-opening/${structureId}/${chartId}`,
          payload
        )
        .then((response) => {
          success = response.data.success
          return showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error: unknown) => {
          showAlert(
            showCatchError(error as IErrors),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })

      return success
    },

    async _getOpeningRecord(structureId: number, chartId: number) {
      let costCenter: IOpeningRecord | null = null

      await executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/accounting-period-opening/${structureId}/${chartId}`
        )
        .then((response) => {
          if (response.data.success) {
            costCenter = response.data.data
          }

          return showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error: unknown) => {
          showAlert(
            showCatchError(error as IErrors),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })

      return costCenter
    },

    async _getOpeningRecordCodesAndNames() {
      return executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/accounting-period-opening/?fields=code,name`
        )
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            return response.data.data as Array<{ code: string; name: string }>
          }
          return []
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    async _getOpeningRecordBusinessListing(params: {
      accounting_structure_id: number
      period: string
      from_business_id?: number
      to_business_id?: number
    }) {
      const {
        accounting_structure_id,
        period,
        from_business_id,
        to_business_id,
      } = params

      return executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/v2/accounting-period-opening/eligible-businesses`,
          {
            params: {
              'filter[current_period]': period,
              'filter[accounting_structure_id]': accounting_structure_id,
              ...(from_business_id && {
                'filter[from_business_code]': from_business_id,
              }),
              ...(to_business_id && {
                'filter[to_business_code]': to_business_id,
              }),
              paginate: 1,
            },
          }
        )
        .then((response) => {
          const { success, data, message } = response.data as {
            success: boolean
            data: {
              current_page: number
              last_page: number
              data: IOpeningRecord[]
            }
            message: string
          }

          if (success) {
            const rows = Array.isArray(data?.data) ? data.data : []

            this.opening_bussines_list = rows
            this.opening_record_pages = {
              currentPage: data?.current_page ?? 1,
              lastPage: data?.last_page ?? 1,
            }

            showAlert(message, 'success', undefined, TIMEOUT_ALERT)
          } else {
            showAlert(
              message || 'No se pudo obtener la información.',
              'warning',
              undefined,
              TIMEOUT_ALERT
            )
          }
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    async _toggleOpeningRecordStatus() {
      if (!this.selected_opening_record) {
        return false
      }

      const statusId = this.selected_opening_record.status_id
      const id = this.selected_opening_record.id

      if (!id || statusId === undefined) {
        return false
      }

      const newStatusId = statusId === 1 ? 2 : 1

      return executeApi()
        .patch(
          `${URL_PATH_ACCOUNTING}/accounting-period-opening/${id}/status`,
          {
            status_id: newStatusId,
          }
        )
        .then((response) => {
          const success = response.data.success
          showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
          return success
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    _selectOpeningRecord(costCenter: IOpeningRecord) {
      this.selected_opening_record = costCenter
    },

    async _getDataExcel(processId: number): Promise<void> {
      await executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/v2/accounting-period-opening/export/${processId}`,
          {
            responseType: 'blob',
          }
        )
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const name = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, name)
        })
        .catch((error: unknown) => {
          showAlert(
            showCatchError(error as IErrors),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
    },

    async _getSuccessProcessesReport(params: { process_id: number }) {
      const { process_id } = params

      return executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/v2/accounting-period-opening/reports/successful-businesses`,
          {
            params: {
              paginate: 1,
              'filter[status_id]': 107,
              'filter[accounting_period_opening_process_id]': process_id,
              sort: 'business_code_numeric',
            },
          }
        )
        .then((response) => {
          const { success, data, message } = response.data as {
            success: boolean
            message: string
            data: {
              current_page: number
              last_page: number
              data: ISuccessRow[]
            }
          }

          if (!success) {
            showAlert(
              message ||
                'No fue posible obtener el reporte de procesos exitosos.',
              'warning',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          }

          showAlert(message, 'success', undefined, TIMEOUT_ALERT)

          return data
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    async _getPendingProcessesReport(params: { process_id: number }) {
      const { process_id } = params

      return executeApi()
        .get(
          `${URL_PATH_ACCOUNTING}/v2/accounting-period-opening/reports/pending-processes`,
          {
            params: {
              paginate: 1,
              'filter[status_id]': 108,
              'filter[accounting_period_opening_process_id]': process_id,
              'filter[news]': true,
              sort: 'business_code_numeric',
            },
          }
        )
        .then((response) => {
          const { success, data, message } = response.data as {
            success: boolean
            message: string
            data: {
              current_page: number
              last_page: number
              data: IPendingRow[]
            }
          }

          if (!success) {
            showAlert(
              message ||
                'No fue posible obtener el reporte de procesos pendientes.',
              'warning',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          }

          showAlert(message, 'success', undefined, TIMEOUT_ALERT)

          return data
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          return null
        })
    },

    async _getOpeningRecordList(params: {}) {
      await executeApi()
        .get(`${URL_PATH_ACCOUNTING}/v2/accounting-period-opening/list`, {
          params: {
            ...params,
            'filter[status_id]': 107,
            paginate: 1,
          },
        })
        .then((response) => {
          const { success, data, message } = response.data as {
            success: boolean
            message: string
            data: {
              current_page: number
              last_page: number
              data: IOpeningRecord[]
            }
          }

          if (success) {
            this.opening_record_list = data?.data ?? []
            this.opening_record_pages = {
              currentPage: data?.current_page ?? 1,
              lastPage: data?.last_page ?? 1,
            }
          }

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
    },
    async _listAction(params: Record<string, string | number>) {
      let responseList: IPaginated<IAccountingReportList> | null = {
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      }

      await executeApi()
        .get(`${URL_PATH}/list`, { params: { ...params, paginate: 1 } })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          responseList = {
            list: items,
            pages: { currentPage: current_page, lastPage: last_page },
          }

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

      return responseList
    },

    async _advancedFiltersAccounts(
      account_structure_id: number,
      params: Record<string, string | number>
    ) {
      let accountsSelector: IAccountStructureResource[] = []
      let succes = false

      await executeApi()
        .get(`${URL_PATH}/advanced-filter/accounts`, {
          params: { account_structure_id, ...params },
        })
        .then((response) => {
          if (response.data.success) {
            const data = response.data.data

            accountsSelector = data.map((item: IAccountStructureResource) => ({
              value: item.code,
              label: `${item.code} - ${item.name}`,
            }))

            succes = true
          }

          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })

      return { accountsSelector, succes }
    },

    async _downloadReport(idFile: number) {
      await executeApi()
        .get(`${URL_PATH}/download/${idFile}`)
        .then((response) => {
          const { success, data, message } = response.data

          if (!success || !data?.has_ready_to_download) {
            showAlert(
              message ?? 'El reporte no existe o no se encuentra disponible',
              'error'
            )
            return
          }

          const downloadUrl = data.url_to_download_for_s3

          window.open(downloadUrl, '_blank')
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error')
        })
    },
  },
})
