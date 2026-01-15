import { defineStore } from 'pinia'

import { IErrors } from '@/interfaces/global'
import {
  IBankResponseFilterForm,
  IBankResponseAssignForm,
  IBankResponseDescriptionForm,
  IBankResponseDetailRejectForm,
  IBankResponsePayment,
  IBankResponsePaymentList,
  IBankResponsePaymentPages,
  IBankResponseDocument,
  IBankResponseFilterFormResponse,
  IBankResponseRejectResponse,
  IBankResponseError,
  IBankResponseValidateApiResponse,
} from '@/interfaces/customs'

import { executeApi } from '@/apis'
import { useAlert, useShowError, useUtils } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/response-banks`

export const useBankResponseStoreV1 = defineStore('bank-response-store-v1', {
  state: () => ({
    bank_response_filter_form: null as IBankResponseFilterForm | null,
    bank_response_document: null as IBankResponseDocument | null,
    bank_response_filter_form_response:
      null as IBankResponseFilterFormResponse | null,
    bank_response_filter_form_response_success: null as boolean | null,
    bank_response_assign_form: null as IBankResponseAssignForm | null,
    bank_response_description_form: null as IBankResponseDescriptionForm | null,
    bank_response_detail_reject_form:
      null as IBankResponseDetailRejectForm | null,
    bank_response_reject_response: null as IBankResponseRejectResponse | null,
    bank_response_payment_list: [] as IBankResponsePaymentList,
    bank_response_payment: null as IBankResponsePayment | null,
    bank_response_payment_selected: [] as IBankResponsePaymentList,
    has_rejected_records: false as boolean,
    bank_response_payment_pages: {
      currentPage: 0,
      lastPage: 0,
      total_items: 0,
      per_page: 0,
    } as IBankResponsePaymentPages,
    isAssignmentSuccessful: null as boolean | null,
  }),

  actions: {
    async _getBankResponsePaymentList(params: string) {
      this._clearBankResponse()

      await executeApi()
        .get(`${URL_PATH}/list?paginate=1${params}`)
        .then((response) => {
          const { data, current_page, last_page, total, per_page } =
            response.data.data
          this.bank_response_payment_list = data
          this.bank_response_payment_pages = {
            currentPage: current_page,
            lastPage: last_page,
            total_items: total,
            per_page: per_page,
          }

          return showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
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

    async _validateBankResponseUploadFile(formData: FormData) {
      let success = false

      await executeApi()
        .post<IBankResponseValidateApiResponse>(
          `${URL_PATH}/validate-file`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        .then((response) => {
          const { success: ok, message, data } = response.data

          this.bank_response_filter_form_response = data
          success = ok

          showAlert(message, ok ? 'success' : 'error', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const backend = e.response?.data as
            | IBankResponseValidateApiResponse
            | undefined
          const data = backend?.data
          const errors = data?.errors

          this.bank_response_filter_form_response = data ?? null

          if (errors?.length) {
            const formatted = errors.join('\n')
            showAlert(formatted, 'error', undefined, TIMEOUT_ALERT)
            return
          }

          const fallback = showCatchError(e)
          showAlert(fallback, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _createBankResponseAssign(data: IBankResponseAssignForm) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}`, data)
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

    async _processBankResponseDetailReject(
      data: IBankResponseDetailRejectForm
    ) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}/process`, data)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false
          this.isAssignmentSuccessful = response.data?.success ?? false
          this.bank_response_reject_response = response.data?.data || null

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
          this.bank_response_reject_response = e.response?.data?.data || null

          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })

      return success
    },

    async _errorsBankResponseDetailReject(data: IBankResponseError[] | null) {
      await executeApi()
        .post(`${URL_PATH}/download-errors`, data, {
          responseType: 'blob',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const fileName = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, fileName.replace(/['"]/g, ''))

          return showAlert(
            'Archivo generado correctamente',
            'success',
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

    _setBankResponseFilterForm(data: IBankResponseFilterForm | null) {
      this.bank_response_filter_form = data
    },

    _setBankResponseDocument(data: IBankResponseDocument | null) {
      this.bank_response_document = data || null
    },

    _setBankResponseAssignForm(data: IBankResponseAssignForm | null) {
      this.bank_response_assign_form = data
    },

    _setBankResponseDescriptionForm(item: IBankResponseDescriptionForm | null) {
      this.bank_response_description_form = item
    },

    _setBankResponseDetailRejectForm(
      data: IBankResponseDetailRejectForm | null
    ) {
      this.bank_response_detail_reject_form = data
    },

    _setBankResponsePaymentSelected(data: IBankResponsePaymentList) {
      this.bank_response_payment_selected = data
    },

    _setHasRejectedRecords(value: boolean) {
      this.has_rejected_records = value
    },

    _clearBankResponse() {
      this.bank_response_document = null
      this.bank_response_assign_form = null
      this.bank_response_description_form = null
      this.bank_response_detail_reject_form = null
      this.bank_response_reject_response = null
      this.bank_response_payment_list = []
      this.bank_response_payment = null
      this.bank_response_payment_pages = {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      }
    },
  },
})
