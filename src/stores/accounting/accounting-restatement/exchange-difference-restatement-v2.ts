//Vue - Pinia
import { defineStore } from 'pinia'

//Composables
import { useUtils } from '@/composables/useUtils'
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'

//Apis
import { executeApi } from '@/apis'

//Constants
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Interfaces for IExchangeModule
import {
  IExchangedDifferenceRestatementDataForm,
  IExchangeDifferenceRestatementListCalculationsItem,
  IExchangeDifferenceRestatementListDetailsItem,
  IExchangeDifferenceRestatementListItem,
  IExchangeDifferenceRestatementListItemChildrenVoucher,
  IExchangeDifferenceRestatementListProcessItem,
  IExchangeDifferenceRestatementListUndoItem,
  IExchangeDifferenceRestatementUndoProcess,
  IExchangeDifferenceRestatementVoucherProcess,
} from '@/interfaces/customs/accounting/AccountingRestatement'

// Auxiliary functions
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useExchangeDifferenceRestatementStoreV2 = defineStore(
  'exchange-difference-restatement-store-v2',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Reexpresión de diferencias en cambio',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Contabilidad',
          },
          {
            label: 'Reexpresión de diferencias en cambio',
            route: 'ExchangeDifferenceRestatementList',
          },
        ],
        btn: {
          label: 'Deshacer',
          icon: useUtils().defaultIconsLucide.rotateCcw,
          color: 'orange',
          class: 'custom',
          textColor: 'black',
        },
      },
      reexpresion_difference_list:
        [] as IExchangeDifferenceRestatementListItem[],
      reexpresion_difference_process_list:
        [] as IExchangeDifferenceRestatementListProcessItem[],
      reexpresion_difference_calculation_list:
        [] as IExchangeDifferenceRestatementListCalculationsItem[],
      reexpresion_difference_undo_process_list:
        [] as IExchangeDifferenceRestatementListUndoItem[],
      reexpresion_difference_voucher_list:
        [] as IExchangeDifferenceRestatementListItemChildrenVoucher[],
      pages: {
        currentPage: 0,
        lastPage: 0,
      },
      pages_calculations: {
        currentPage: 0,
        lastPage: 0,
      },
      pages_undo_process: {
        currentPage: 0,
        lastPage: 0,
      },

      reexpresion_identifier_voucher_id: '' as number | string,
      reexpresion_difference_response:
        {} as IExchangedDifferenceRestatementDataForm,
      reexpresion_difference_details_list:
        [] as IExchangeDifferenceRestatementListDetailsItem[],
    }),
    actions: {
      async _getExchangeDifferenceRestatementList(
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/accounting-restatement/process`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const { data, message, success } = response.data

            if (success) {
              this.reexpresion_difference_list =
                (data?.data as IExchangeDifferenceRestatementListItem[]) ?? []
              this.pages.currentPage = data?.current_page ?? 1
              this.pages.lastPage = data?.last_page ?? 1
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
      async _getExchangeDifferenceRestatementListUndo(
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/accounting-restatement/restatements`,
            {
              params: { ...params, paginate: 1 },
            }
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.reexpresion_difference_undo_process_list =
                (data?.data as IExchangeDifferenceRestatementListUndoItem[]) ??
                []
              this.pages_undo_process.currentPage = data?.current_page ?? 1
              this.pages_undo_process.lastPage = data?.last_page ?? 1
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

      async _getExchangeDifferenceRestatementProcessList(
        processId: number | string,
        params?: Record<string, string> | number
      ) {
        const queryString =
          typeof params === 'object'
            ? new URLSearchParams(params).toString()
            : params
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/accounting-restatement/process/${processId}/detail?${queryString}`
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.reexpresion_difference_response =
                data as IExchangedDifferenceRestatementDataForm

              this.reexpresion_difference_process_list =
                (data.process as IExchangeDifferenceRestatementListProcessItem[]) ??
                []
              this.reexpresion_difference_calculation_list =
                (data.calculations
                  .data as IExchangeDifferenceRestatementListCalculationsItem[]) ??
                []
              this.pages_calculations.currentPage =
                data.calculations?.current_page ?? 1
              this.pages_calculations.lastPage =
                data.calculations?.last_page ?? 1
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
      async _getExchangeDifferenceRestatementListVouchers(
        processId: number | string
      ) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/accounting-restatement/process/${processId}/vouchers`
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.reexpresion_difference_voucher_list =
                (data?.data as IExchangeDifferenceRestatementListItemChildrenVoucher[]) ??
                []
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
      async _getExchangeDifferencerRestatementNews(id: number | string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/accounting-restatement/restatements/${id}/details`
          )
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              this.reexpresion_difference_details_list =
                data.related_records as IExchangeDifferenceRestatementListDetailsItem[]
              this.reexpresion_difference_response = { ...data }
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
      async _exportCalculationsExchangeDifferenceRestatement(
        process_id: number | string,
        params: Record<string, string> | number
      ) {
        const queryString =
          typeof params === 'object'
            ? new URLSearchParams(params).toString()
            : params
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/accounting-restatement/process/${process_id}/export?${queryString}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)
            if (response.status === 200) {
              return showAlert(
                'Exportación exitosa',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _exportVouchersExchangeDifferenceRestatement(
        process_id: number | string,
        params: Record<string, string> | number
      ) {
        const queryString =
          typeof params === 'object'
            ? new URLSearchParams(params).toString()
            : params
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/accounting-restatement/process/${process_id}/vouchers/export?${queryString}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)
            if (response.status === 200) {
              return showAlert(
                'Exportación exitosa',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _generateProcessExchangeDifferenceRestatement(
        params: Record<string, string> | number
      ) {
        let flag = false
        const queryString =
          typeof params === 'object'
            ? new URLSearchParams(params).toString()
            : params
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/accounting-restatement/process?${queryString}`
          )
          .then((response) => {
            const { data, message, success } = response.data
            flag = success
            if (success) {
              this.reexpresion_identifier_voucher_id = data.id ?? null
            }
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return flag
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return flag
      },
      async _generateUndoProcessExchangeDifferenceRestatement(
        payload: IExchangeDifferenceRestatementUndoProcess
      ) {
        let dataResponse: IExchangeDifferenceRestatementUndoProcess | null =
          null
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/accounting-restatement/restatements/undo`,
            payload
          )
          .then((response) => {
            const { data, message, success } = response.data
            dataResponse = data?.id as IExchangeDifferenceRestatementUndoProcess
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
        return dataResponse
      },
      async _generateVouchersExchangeDifferenceRestatement(
        payload: IExchangeDifferenceRestatementVoucherProcess
      ) {
        let flag = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/accounting-restatement/restatements/generate-vouchers`,
            payload
          )
          .then((response) => {
            const { message, success } = response.data
            flag = success
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
        return flag
      },
    },
  }
)
