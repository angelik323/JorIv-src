// Pinia - Apis
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IPaymentConceptsCreateBulkPayload,
  IPaymentConceptsCreateBulkResponse,
  IPaymentConceptsErrorsFileValidationPayload,
  IPaymentConceptsFileValidationResponse,
  IPaymentConceptsForm,
  IPaymentConceptsItem,
} from '@/interfaces/customs/accounts-payable/PaymentConcepts'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/payment-concepts`

export const usePaymentConceptsStoreV1 = defineStore(
  'payment-concepts-store-v1',
  {
    state: () => ({
      payment_concepts_list: [] as IPaymentConceptsItem[],
      payment_concepts_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _getPaymentConceptsList(
        params: Record<string, string | number | null>
      ) {
        await executeApi()
          .get(`${URL_PATH}`, {
            params: { ...params, paginate: 1, order_by: 'concept_code,asc' },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.payment_concepts_list = items

            this.payment_concepts_pages = {
              currentPage: current_page,
              lastPage: last_page,
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
      async _createPaymentConcepts(payload: IPaymentConceptsForm) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
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

      async _getPaymentConceptsById(
        id: number
      ): Promise<IPaymentConceptsItem | null> {
        let payment_concepts_response: IPaymentConceptsItem | null = null
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              payment_concepts_response = data
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

        return payment_concepts_response
      },

      async _updatePaymentConcepts(payload: IPaymentConceptsForm, id: number) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${id}`, payload)
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

      async _deletePaymentConcepts(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH}/${id}`)
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

      async _downloadExcelPaymentConceptsTemplate() {
        await executeApi()
          .get(`${URL_PATH}/import/template`, {
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

      async _validatePaymentConceptsFile(
        file: File
      ): Promise<IPaymentConceptsFileValidationResponse | null> {
        let payment_concepts_file_validation_response: IPaymentConceptsFileValidationResponse | null =
          null
        const formData = new FormData()
        formData.append('file', file)

        await executeApi()
          .post(`${URL_PATH}/import/validate`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            const { data } = response.data
            payment_concepts_file_validation_response = data
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return payment_concepts_file_validation_response
      },

      async _downloadExcelFileValidationErrors(
        payload: IPaymentConceptsErrorsFileValidationPayload
      ) {
        await executeApi()
          .post(`${URL_PATH}/import/errors`, payload, {
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

      async _createPaymentConceptsBulk(
        payload: IPaymentConceptsCreateBulkPayload
      ): Promise<IPaymentConceptsCreateBulkResponse | null> {
        let payment_concepts_create_bulk_response: IPaymentConceptsCreateBulkResponse | null =
          null
        await executeApi()
          .post(`${URL_PATH}/import/bulk`, payload)
          .then((response) => {
            const { data } = response.data
            payment_concepts_create_bulk_response = data
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return payment_concepts_create_bulk_response
      },

      _clearData() {
        this.payment_concepts_list = []
        this.payment_concepts_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
