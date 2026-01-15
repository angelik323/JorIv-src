import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import {
  IOpeningRecord,
  IOpeningRecordCreatePayload,
  IOpeningRecordModel,
  IOpeningRecordResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const TIMEOUT_ALERT = 3000

export const useOpeningRecordV1 = defineStore('opening-record-v1', {
  state: () => ({
    version: 'v1',
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
          `${URL_PATH_ACCOUNTING}/accounting-period-opening/list-business-trusts?paginate=1${params}`
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
            data: IOpeningRecord[] | { data: IOpeningRecord[] }
            message: string
          }

          // En v1 asumías que data es un array plano
          const rows = Array.isArray(data)
            ? data
            : (data as { data: IOpeningRecord[] }).data ?? []

          if (success) {
            this.opening_bussines_list = rows
            showAlert(message, 'success', undefined, TIMEOUT_ALERT)
          } else {
            showAlert(
              message || 'No se pudo obtener la información.',
              'warning',
              undefined,
              TIMEOUT_ALERT
            )
          }

          return rows
        })
        .catch((e: unknown) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
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
          `${URL_PATH_ACCOUNTING}/accounting-period-opening/execute`,
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

    async _getDataExcel(): Promise<void> {
      await executeApi()
        .get(`${URL_PATH_ACCOUNTING}/accounting-period-opening/export`, {
          responseType: 'blob',
        })
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
  },
})
