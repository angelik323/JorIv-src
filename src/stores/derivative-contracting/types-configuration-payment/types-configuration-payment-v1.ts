import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import {
  ITypesPaymentConfigurationResponse,
  ITypePaymentConfigurationForm,
} from '@/interfaces/customs/derivative-contracting/TypePaymentsConfiguration'
import { IGenericResource } from '@/interfaces/customs/resources/Common'

const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTypesConfigurationPaymentStoreV1 = defineStore('types-configuration-payment-store-v1', {
  state: () => ({
    // opciones para selects
    type_payment: [] as IGenericResource[],

    // lista de tipos
    types_configuration_payment_list: [] as ITypesPaymentConfigurationResponse[],

    // datos que alimentan el formulario
    data_information_form: null as ITypesPaymentConfigurationResponse | null,

    // resultado de getById
    type_received_request: null as ITypesPaymentConfigurationResponse | null,
  }),

  actions: {
    async _getPaymentTypes(params: string) {
      this.type_payment = []
      this.types_configuration_payment_list = []

      await executeApi()
        .get(`${URL_PATH_DERIVATIVE_CONTRACTING}/payment-type?${params}`)
        .then((response) => {
          if (response.data?.success) {
            const payload = response.data?.data
            this.types_configuration_payment_list = Array.isArray(payload) ? payload : []
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

    async _updateTypeConfigurationPayment(payload: ITypePaymentConfigurationForm, id: number) {
      let success = false
      await executeApi()
        .put(`${URL_PATH_DERIVATIVE_CONTRACTING}/payment-type/${id}`, payload)
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

    async _getByIdTypeConfigurationPayment(id: number) {
      this.type_received_request = null
      await executeApi()
        .get(`${URL_PATH_DERIVATIVE_CONTRACTING}/payment-type/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.type_received_request = response.data.data ?? null
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

    async _createTypeConfigurationPayment(payload: ITypePaymentConfigurationForm) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_DERIVATIVE_CONTRACTING}/payment-type`, payload)
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

    async _deleteTypeConfigurationPayment(params: number) {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_DERIVATIVE_CONTRACTING}/payment-type/${params}`)
        .then(() => {
          showAlert('Tipo de recaudo eliminado', 'success')
          success = true
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          success = false
        })
      return success
    },

    async _setDataBasicTypeConfigurationPayment(data: ITypesPaymentConfigurationResponse | null) {
      this.data_information_form = data ? { ...data } : null
    },

    async _activateTypeConfigurationPayment(id: number) {
      let success = false
      await executeApi()
        .patch(`${URL_PATH_DERIVATIVE_CONTRACTING}/payment-type/${id}/activate`)
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
    
    async _inactivateTypeConfigurationPayment(id: number) {
      let success = false
      await executeApi()
        .patch(`${URL_PATH_DERIVATIVE_CONTRACTING}/payment-type/${id}/inactivate`)
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
    
  },
})
