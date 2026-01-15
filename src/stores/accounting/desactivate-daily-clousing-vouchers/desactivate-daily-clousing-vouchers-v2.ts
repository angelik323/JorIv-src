// pinia
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError } from '@/composables'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

// constants
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'

// interfaces
import {} from '@/interfaces/customs'
import {
  IBusinessAvailableListItem,
  IDesativateDailyClosingVouchersListItem,
  IDesativateDailyClosingVouchersCreate,
  IInformProcessPendingListItem,
  ISuccessProcessListItem,
} from '@/interfaces/customs/accounting/DesactivateDailyClosingVouchersV2'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useDesactivateDailyClousingVouchersStoreV2 = defineStore(
  'desactivate-daily-closing-vouchers-store-v2',
  {
    state: () => ({
      version: 'v2',
    }),
    actions: {
      async _getListAction(params: string) {
        let data_list: IDesativateDailyClosingVouchersListItem[] = []
        let pages = { currentPage: 0, lastPage: 0 }
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/revert-vouchers?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              data_list = response.data?.data?.data ?? []
              pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(
              showCatchError(error),
              error.status === 404 ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return { data_list, pages }
      },
      async _getListBusinessAvailable(params: string) {
        let data_list_business_available: IBusinessAvailableListItem[] = []
        let pages = { currentPage: 0, lastPage: 0 }
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/revert-vouchers/eligible-businesses-daily-closing?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              data_list_business_available = response.data?.data?.data ?? []
              pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(
              showCatchError(error),
              error.status === 404 ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return { data_list_business_available, pages }
      },
      async _createAction(
        data: IDesativateDailyClosingVouchersCreate
      ): Promise<{ id: number | null; success: boolean }> {
        const data_response = {
          id: null,
          success: false,
        }

        await executeApi()
          .post(`${URL_PATH_ACCOUNTING}/v2/revert-vouchers/execute`, data)
          .then((response) => {
            data_response.success = response.data.success
            data_response.id = response.data?.data?.id ?? null

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT - 2000
            )
          })
          .catch((error) => {
            data_response.success = false
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return data_response
      },
      async _getListInformProcessPending(params: string) {
        let data_list_inform_process_pending: IInformProcessPendingListItem[] =
          []
        let pages = { currentPage: 0, lastPage: 0 }
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/revert-vouchers/reports/pending-processes?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              data_list_inform_process_pending = response.data?.data?.data ?? []
              pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(
              showCatchError(error),
              error.status === 404 ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return { data_list_inform_process_pending, pages }
      },
      async _getListSuccessProcess(params: string) {
        let data_list_success_process: ISuccessProcessListItem[] = []
        let pages = { currentPage: 0, lastPage: 0 }
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/revert-vouchers/reports/successful-processes?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              data_list_success_process = response.data?.data?.data ?? []
              pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(
              showCatchError(error),
              error.status === 404 ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return { data_list_success_process, pages }
      },
      async _exportXlsx(params: string) {
        const nameFile = `Desactualizacion_de_cierres_diarios`
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/revert-vouchers/export/${params}`, {
            responseType: 'arraybuffer',
          })
          .then((response) => {
            createAndDownloadBlobByArrayBuffer(
              response.data,
              nameFile,
              undefined,
              true
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
