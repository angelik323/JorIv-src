// Vue - pinia
import { defineStore } from 'pinia'

// Interfaces
import {
  ICreateValidatePayload,
  IErrorsOnValidate,
  IValidateVoucherResponse,
  IVoucherManagementList,
  IVoucherManagementListItem,
  IVoucherManagementUpdateForm,
  IVoucherManagementValidationForm,
  IVoucherManagementView,
} from '@/interfaces/customs/accounting/VoucherManagement'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// APIs
import { executeApi } from '@/apis'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useVoucherManagementStoreV1 = defineStore(
  'voucher-management-store-v1',
  {
    state: () => ({
      headerPropsDefault: {
        title: 'Gestión de comprobantes',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Contabilidad',
          },
          {
            label: 'Gestión de comprobantes',
            route: 'VoucherManagementList',
          },
        ],
        btn: {
          label: 'Actualizar',
          icon: useUtils().defaultIconsLucide.reload,
          color: 'primary',
          textColor: 'white',
          size: 'md',
          class: 'btn-header',
          outline: false,
          disable: false,
        },
      },
    }),
    getters: {},
    actions: {
      async _getVoucherManagementList(params: string) {
        let voucher_management_list = {} as IVoucherManagementList
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/vouchers?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              voucher_management_list = {
                data:
                  (response.data?.data?.data as IVoucherManagementListItem[]) ??
                  [],
                pages: {
                  currentPage: response.data?.data?.current_page ?? 1,
                  lastPage: response.data?.data?.last_page ?? 1,
                },
              }
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
        return voucher_management_list
      },
      async _exportXlsxVoucherManagementList(params: string) {
        const nameFile = `Listado_de_procesos_gestionados.xlsx`
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/vouchers/export?with_errors=0&${params}`,
            {
              responseType: 'arraybuffer',
            }
          )
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
      async _validateVoucher(payload: IVoucherManagementValidationForm) {
        let responseValidation: IValidateVoucherResponse = {
          data: [],
          success: false,
        }

        await executeApi()
          .post(`${URL_PATH_ACCOUNTING}/v2/vouchers/validate`, payload)
          .then((response) => {
            const data = response.data.data
            responseValidation = {
              data: (data?.failures ? data.failures : data) || [],
              success: response.data.success,
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

        return responseValidation
      },
      async _createValidation(payload: ICreateValidatePayload) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_ACCOUNTING}/v2/vouchers`, payload)
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
      async _updateVoucher(payload: IVoucherManagementUpdateForm) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_ACCOUNTING}/v2/vouchers/updated`, payload)
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
      async _exportXlsxErrors(
        errors: IErrorsOnValidate[],
        nameFile: string = 'Comprobantes_con_novedades'
      ) {
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/v2/vouchers/export?with_errors=1`,
            {
              errors,
            },
            {
              responseType: 'arraybuffer',
            }
          )
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
      async _exportXlsxErrors2(params: {
        with_errors: number
        errors: IErrorsOnValidate[]
      }) {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/vouchers/export`, {
            params: JSON.parse(JSON.stringify(params)),
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _getVoucherWithErrorsById(id: number) {
        let data = {} as IVoucherManagementView
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/vouchers/${id}`)
          .then((response) => {
            if (response.data.success) {
              data = response.data?.data as IVoucherManagementView
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
        return data
      },
    },
  }
)
