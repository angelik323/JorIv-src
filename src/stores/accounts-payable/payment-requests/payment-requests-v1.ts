// core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import { IErrors } from '@/interfaces/global'
import {
  IPaymentRequestAssociatedDataAdvancesForm,
  IPaymentRequestAssociatedDataForm,
  IPaymentRequestBasicDataForm,
  IPaymentRequestConceptsForm,
  IPaymentRequestInstructionsForm,
  IPaymentRequestItem,
  IPaymentRequestMainInformationForm,
  IPaymentRequestTaxLiquidation,
  IPaymentRequestView,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// prepare composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePaymentRequestsStoreV1 = defineStore(
  'payment-requests-store-v1',
  {
    state: () => ({
      total_value: 0 as number | string,
      iva_value: 0 as number | string,
      business_id: 0 as number,
      business_label: '' as string,
      supplier_id: 0 as number,
      basic_data_id: 0 as number,
      has_budget: false as boolean,
    }),

    actions: {
      async _getPaymentRequestList(params: Record<string, string | number>) {
        const responseData = {
          pages: {
            currentPage: 1,
            lastPage: 1,
          },
          data: [] as IPaymentRequestItem[],
        }

        await executeApi()
          .get(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-requests`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            responseData.data = items
            responseData.pages = {
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
        return responseData
      },

      async _getPaymentRequestById(id: number) {
        let responseData: IPaymentRequestView | null = null
        await executeApi()
          .get(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-requests/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              responseData = data
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
        return responseData
      },

      async _getAdvances() {
        let responseData: IPaymentRequestAssociatedDataAdvancesForm | null =
          null
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTS_PAYABLE}/payment-requests/available-advances/${this.business_id}/${this.supplier_id}`
          )
          .then((response) => {
            const { data, success } = response.data
            if (success) {
              responseData = data
            }
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return responseData
      },

      async _createPaymentRequestBasicData(
        payload: IPaymentRequestBasicDataForm
      ) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/payment-requests/basic-data`,
            payload
          )
          .then((response) => {
            const { data, message } = response.data
            success = response.data?.success ?? false

            this.basic_data_id = data.id

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

      async _createPaymentRequestMainInformation(
        payload: IPaymentRequestMainInformationForm
      ) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/payment-requests/${this.basic_data_id}/main-info`,
            payload
          )
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

      async _createPaymentRequestConcepts(
        payload: IPaymentRequestConceptsForm
      ) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/payment-requests/${this.basic_data_id}/concepts`,
            payload
          )
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

      async _createPaymentRequestInstructions(
        payload: IPaymentRequestInstructionsForm
      ) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/payment-requests/${this.basic_data_id}/instructions`,
            payload
          )
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

      async _createPaymentRequestAssociatedData(
        payload: IPaymentRequestAssociatedDataForm
      ) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/payment-requests/${this.basic_data_id}/associated-data`,
            payload
          )
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

      async _getGenerateTaxLiquidation() {
        let responseData: IPaymentRequestTaxLiquidation | null = null
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTS_PAYABLE}/payment-requests/${this.basic_data_id}/generate-tax-liquidation`
          )
          .then((response) => {
            const { data, success } = response.data
            if (success) {
              responseData = data
              showAlert(data.message, 'info', undefined, TIMEOUT_ALERT)
            }
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return responseData
      },
    },
  }
)
