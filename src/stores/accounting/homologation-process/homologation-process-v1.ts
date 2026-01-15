import { defineStore } from 'pinia'

import { executeApi } from '@/apis'

import { useAlert, useShowError } from '@/composables'

import {
  IBulkHomologationPayload,
  IFilterableVoucher,
  IHomologationDownloadPayload,
  IHomologationPayload,
  IHomologationProcess,
  IHomologationProcessItem,
  IHomologationProcessVoucher,
  IHomologationProcessView,
  IHomologationProcessHistory,
  IPaginated,
} from '@/interfaces/customs'

import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const URL_PATH = `${URL_PATH_ACCOUNTING}/vouchers-mapping`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useHomologationProcessStoreV1 = defineStore(
  'homologation-process-store-v1',
  {
    state: () => ({
      version: 'v1',
      process_type: null as null | 1 | 2 | 3 | 4,
      homologation_process_list: [] as IHomologationProcessItem[],
      homologation_process_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      filterable_vouchers_list: [] as IFilterableVoucher[],
      processed_homologations: [] as IHomologationProcess[],
      selected_homologation_process: {} as IHomologationProcessView,
      homologation_process_vouchers: {
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      } as IPaginated<IHomologationProcessVoucher>,
      homologation_process_history: {} as IHomologationProcessHistory,
    }),
    actions: {
      async _getHomologationProcessList(params: string) {
        this._cleanHomologationProcessData()
        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.homologation_process_list = response.data?.data?.data ?? []
              this.homologation_process_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.homologation_process_pages.lastPage =
                response.data?.data?.last_page ?? 0
            }

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

      _cleanCreateData() {
        this.filterable_vouchers_list = []
        this.processed_homologations = []
      },

      _cleanHomologationProcessData() {
        this.processed_homologations = []
        this.homologation_process_list = []
        this.homologation_process_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },

      async _bulkHomologation(payload: IBulkHomologationPayload) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/bulk`, payload)
          .then((response) => {
            success = response.data.success
            this.processed_homologations = response.data.data
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

      async _downloadResults(payload: IHomologationDownloadPayload) {
        let xlsFile = null
        await executeApi()
          .post(`${URL_PATH}/export/result`, payload, {
            responseType: 'arraybuffer',
          })
          .then((response) => {
            xlsFile = response.data
            return showAlert(
              response.data.message ?? 'Exportación exitosa',
              !response.data.message ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return xlsFile
      },

      async _downloadDetailedResults(payload: {
        results: IHomologationProcessVoucher[]
      }) {
        let xlsFile = null
        await executeApi()
          .post(`${URL_PATH}/export/logs`, payload, {
            responseType: 'arraybuffer',
          })
          .then((response) => {
            xlsFile = response.data
            return showAlert(
              response.data.message ?? 'Exportación exitosa',
              !response.data.message ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return xlsFile
      },

      async _searchFilterableVouchers(params: string) {
        await executeApi()
          .get(`${URL_PATH}/filterable?${params}`)
          .then((response) => {
            if (response.data.success) {
              this.filterable_vouchers_list = response.data.data
            }

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

      async _selectiveHomologation(payload: IHomologationPayload) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/selective`, payload)
          .then((response) => {
            success = response.data.success
            this.processed_homologations = response.data.data
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

      async _getHomologationProcess(id: number) {
        let success = false

        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            success = response.data.data
            if (success) {
              this.selected_homologation_process = response.data.data
            }
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

      async _getHomologationProcessLogs(
        id: number,
        params: Record<string, string | number>
      ) {
        let success = false
        this.homologation_process_vouchers.list = []
        this.homologation_process_vouchers.pages.currentPage = 0
        this.homologation_process_vouchers.pages.lastPage = 0
        await executeApi()
          .get(`${URL_PATH}/${id}/logs`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            success = response.data.data
            if (success) {
              this.homologation_process_vouchers.list = response.data.data.data
              this.homologation_process_vouchers.pages.currentPage =
                response.data.data.current_page
              this.homologation_process_vouchers.pages.lastPage =
                response.data.data.last_page
            }
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

      async _getVoucherLogs(processId: number, voucherId: number) {
        let success = false

        await executeApi()
          .get(`${URL_PATH}/${processId}/${voucherId}/history`)
          .then((response) => {
            success = response.data.data
            if (success) {
              this.homologation_process_history = response.data.data
            }
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
    },
  }
)
