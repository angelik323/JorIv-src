import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { defineStore } from 'pinia'
import { IErrors } from '@/interfaces/global'
import {
  IVouncherValidationModel,
  IValidateVouchersForm,
  IValidateVouchersResponse,
  IUpdateVouchersForm,
  IValidationVouchersView,
  IAccountStructure,
} from '@/interfaces/customs'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

const URL_PATH = `${URL_PATH_ACCOUNTING}/vouchers`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useValidationVouchersV1 = defineStore('validation-vouchers-v1', {
  state: () => ({
    version: 'v1',
    validation_vouchers_list: [] as IVouncherValidationModel[],
    validation_vouchers_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    selected_account_structure: null as null | IAccountStructure,

    validate_vouchers_form: null as null | IValidateVouchersForm,
    validate_vouchers_response: null as null | IValidateVouchersResponse,
    update_vouchers_form: null as null | IUpdateVouchersForm,
    validation_vouchers_view: null as null | IValidationVouchersView,
  }),

  actions: {
    async _getListAction(params: string) {
      this._cleanValidationVouchersData()
      await executeApi()
        .get(`${URL_PATH}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.validation_vouchers_list = response.data?.data.data ?? []
            this.validation_vouchers_pages.currentPage =
              response.data?.data.current_page ?? 0
            this.validation_vouchers_pages.lastPage =
              response.data?.data.last_page ?? 0
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

    _cleanValidationVouchersData() {
      this.validation_vouchers_list = []
      this.validation_vouchers_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },

    async _validateVouchers(payload: IVouncherValidationModel) {
      let success = false
      let data: [] = []
      await executeApi()
        .post(`${URL_PATH}/validate`, payload)
        .then((response) => {
          success = response.data.success
          this.validation_vouchers_list = response.data?.data ?? []
          data = response.data?.data[0] ?? []
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

      return { success, data }
    },

    async __createValidationVouchers(payload: IVouncherValidationModel) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}`, payload)
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

    async _dowloadTrustBusinessList(body: any) {
      const params = {
        with_errors: body.with_errors,
        errors: body.errors,
      }
      await executeApi()
        .get(`${URL_PATH}/export`, {
          params,
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const fileName = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, fileName)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },
    async _exportXlsxValidationVouchersList(params: string) {
      const nameFile = `Listado_de_Validacion_de_Comprobantes`
      await executeApi()
        .get(`${URL_PATH}/export?with_errors=0&${params}`, {
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

    async _getByIdValidationVouchers(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.validation_vouchers_view = { ...responseData }
          }

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _validateVouchersUpdate(payload: IValidateVouchersForm) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}/validate`, payload)
        .then((response) => {
          const { message, data = [] } = response.data
          const hasValidData =
            Array.isArray(data) &&
            data.length > 0 &&
            Array.isArray(data[0]) &&
            data[0].length > 0 &&
            data[0].some((item) => item?.id && Array.isArray(item?.vouchers))

          success = response.data?.success ?? false
          this.validate_vouchers_response = hasValidData ? data[0] : []

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return { success }
    },

    async _updateVouchers(data: IUpdateVouchersForm) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}/updated`, data)
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
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    _setValidateVouchersForm(data: IValidateVouchersForm | null) {
      this.validate_vouchers_form = data ? { ...data } : null
    },

    _setUpdateVouchersForm(data: IUpdateVouchersForm | null) {
      this.update_vouchers_form = data ? { ...data } : null
    },

    _setValidationVouchersView(data: IValidationVouchersView | null) {
      this.validation_vouchers_view = data ? { ...data } : null
    },

    _clearData() {
      this.validate_vouchers_form = null
      this.update_vouchers_form = null
      this.validation_vouchers_view = null
    },

    _selectAccountStructure(accountStructure: IAccountStructure) {
      this.selected_account_structure = accountStructure
    },
  },
})
