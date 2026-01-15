import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'

import { defineStore } from 'pinia'
import { IPaymentMethodV2 } from '@/interfaces/customs'

const URL_PATH_PAYMENT_METHOD = 'treasuries/api/treasuries/means-of-payments'
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePaymentMethodsStoreV2 = defineStore('payment-methods-v2', {
  state: () => ({
    version: 'v2',
    payment_methods_list: [] as IPaymentMethodV2[],
    payment_methods_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as IPaymentMethodV2 | null,
    payment_methods_request: null as IPaymentMethodV2 | null,
  }),
  actions: {
    async _getListAction(params: string) {
      this._clearData()
      await executeApi()
        .get(`${URL_PATH_PAYMENT_METHOD}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.payment_methods_list = response.data?.data?.data ?? []
            this.payment_methods_pages = {
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
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getByIdPaymentMethod(id: number) {
      this._clearData()
      await executeApi()
        .get(`${URL_PATH_PAYMENT_METHOD}/${id}`)
        .then((response) => {
          if (response.data.success) {
            const res = response.data?.data
            if (res) {
              this.payment_methods_request = { ...res }
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
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _createPaymentMethod(data: IPaymentMethodV2): Promise<boolean> {
      let success = false

      await executeApi()
        .post(`${URL_PATH_PAYMENT_METHOD}`, data)
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

    async _updatePaymentMethod(data: IPaymentMethodV2, id: number) {
      let success = false
      this.payment_methods_request = null
      await executeApi()
        .put(`${URL_PATH_PAYMENT_METHOD}/${id}`, data)
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
    async _changeStatusAction(id: number) {
      await executeApi()
        .delete(`${URL_PATH_PAYMENT_METHOD}/${id}`)
        .then((response) => {
          this._getListAction('')
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

    _setDataInformationForm(data_to_set: IPaymentMethodV2 | null) {
      this.data_information_form = data_to_set ? { ...data_to_set } : null
    },

    _clearData() {
      this.payment_methods_list = []
      this.payment_methods_request = null
      this.data_information_form = null
    },
  },
})
