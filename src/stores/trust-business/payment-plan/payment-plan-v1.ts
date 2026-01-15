import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IPaymentPlanList,
  IPaymentPlanResponse,
  IPaymentPlanToCreate,
  IPaymentPlanToEdit,
  IPaymentInstallmentToCreate,
  IPaymentInstallmentToEdit,
  IPaymentPlanDocumentsForm,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useAlert, useShowError } from '@/composables'
import { defaultIconsLucide, createAndDownloadBlobByArrayBuffer } from '@/utils'

// Constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const INITIAL_ID_VALUE = 0

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePaymentPlanStoreV1 = defineStore('payment-plan-store-v1', {
  state: () => ({
    headerPropsDefault: {
      title: 'Plan de pagos',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Negocios fiduciarios',
        },
        {
          label: 'Plan de pagos',
          route: 'PaymentPlanList',
        },
      ],
      btn: {
        label: 'Crear',
        icon: defaultIconsLucide.plusCircleOutline,
      },
    },
    data_payment_plan_list: [] as IPaymentPlanList[],
    data_payment_plan_response: null as IPaymentPlanResponse | null,
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_documents_form: null as IPaymentPlanDocumentsForm | null,
  }),

  actions: {
    async _getListPaymentPlan(params: Record<string, string | number>) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/payment-plan/list`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          if (response.data.success) {
            this.data_payment_plan_list =
              (response.data?.data?.data as IPaymentPlanList[]) ?? []
            this.pages.currentPage = response.data?.data?.current_page ?? 1
            this.pages.lastPage = response.data?.data?.last_page ?? 1
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

    async _getByIdPaymentPlan(paymentPlanId: number) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/payment-plan/show/${paymentPlanId}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.data_payment_plan_response = { ...responseData }
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

    async _createPaymentPlan(
      propertyId: number,
      data: Partial<IPaymentPlanToCreate>
    ) {
      let success = false
      let id = INITIAL_ID_VALUE

      await executeApi()
        .post(`${TRUST_BUSINESS_API_URL}/payment-plan/new/${propertyId}`, data)
        .then((response) => {
          const { message } = response.data
          success = response.data?.success ?? false
          id = response.data?.data?.id ?? INITIAL_ID_VALUE

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

      return id
    },

    async _createPaymentInstallment(
      paymentPlanId: number,
      data: Partial<IPaymentInstallmentToCreate>
    ) {
      let success = false

      await executeApi()
        .post(
          `${TRUST_BUSINESS_API_URL}/payment-plan/add-installment/${paymentPlanId}`,
          data
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

    async _updatePaymentPlan(
      paymentPlanId: number,
      data: Partial<IPaymentPlanToEdit>
    ) {
      let success = false

      await executeApi()
        .put(
          `${TRUST_BUSINESS_API_URL}/payment-plan/update/${paymentPlanId}`,
          data
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

    async _updatePaymentInstallment(
      paymentInstallmentId: number,
      data: Partial<IPaymentInstallmentToEdit>
    ) {
      let success = false

      await executeApi()
        .put(
          `${TRUST_BUSINESS_API_URL}/payment-plan/update/installment/${paymentInstallmentId}`,
          data
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

    async _deletePaymentPlan(paymentPlanId: number) {
      let success = false

      await executeApi()
        .delete(`${TRUST_BUSINESS_API_URL}/payment-plan/${paymentPlanId}`)
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

    async _deletePaymentInstallment(paymentInstallmentId: number) {
      let success = false

      await executeApi()
        .delete(
          `${TRUST_BUSINESS_API_URL}/payment-plan/installment/${paymentInstallmentId}`
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

    async _signPaymentPlanFile(
      paymentPlanId: number,
      data: { name: string; document_type: string }
    ) {
      let success = false
      let documentId = INITIAL_ID_VALUE
      let uploadUrl = ''
      let filePath = ''

      await executeApi()
        .post(
          `${TRUST_BUSINESS_API_URL}/payment-plan/file/signed?name=${data.name}&document_type=${data.document_type}&payment_plan_id=${paymentPlanId}`
        )
        .then((response) => {
          const {
            data: responseData,
            message,
            success: responseSuccess,
          } = response.data

          success = responseSuccess
          documentId = responseData.document_id ?? INITIAL_ID_VALUE
          uploadUrl = responseData.upload_url ?? ''
          filePath = responseData.file_path ?? ''

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

      return { success, documentId, uploadUrl, filePath }
    },

    async _deletePaymentPlanFile(attachmentId: number) {
      let success = false

      await executeApi()
        .delete(
          `${TRUST_BUSINESS_API_URL}/real-state-project/file/${attachmentId}`
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

    async _exportPaymentPlan(paymentPlanId: number, fileName: string) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/payment-plan/export/${paymentPlanId}`, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          const stream = response.data
          if (stream.success === false) return

          createAndDownloadBlobByArrayBuffer(stream, fileName)
        })
        .catch((e) => {
          const error = e as IErrors
          const message = showCatchError(error)
          showAlert(message, 'error', undefined, TIMEOUT_ALERT)
        })
    },

    _setDataDocumentsForm(data_to_set: IPaymentPlanDocumentsForm | null) {
      this.data_documents_form = data_to_set ? { ...data_to_set } : null
    },

    _clearData() {
      this.data_payment_plan_list = []
      this.data_payment_plan_response = null
      this.pages = {
        currentPage: 0,
        lastPage: 0,
      }
      this._setDataDocumentsForm(null)
    },
  },
})
