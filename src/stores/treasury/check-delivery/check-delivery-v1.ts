// Pinia
import { defineStore } from 'pinia'

// Utils
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { executeApi } from '@/apis'

// Interfaces
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { ICheckDeliveryList } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const URL_PATH = `${URL_PATH_TREASURIES}/check-delivery`

export const useCheckDeliveryStoreV1 = defineStore('check-delivery-store-v1', {
  state: () => ({
    data_check_delivery_list: [] as ICheckDeliveryList[],
    data_check_delivery_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as ICheckDeliveryList | null,
  }),

  actions: {
    async _getApiCheckDelivery(params: string) {
      this._clearData()

      await executeApi()
        .get(`${URL_PATH}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.data_check_delivery_list = response.data?.data?.data ?? []
            this.data_check_delivery_pages = {
              currentPage: response.data?.data?.current_page ?? 1,
              lastPage: response.data?.data?.last_page ?? 1,
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

    async _getByIdCheckDelivery(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}/view`)
        .then((response) => {
          if (response.data.success) {
            const res = response.data?.data
            if (res) {
              this.data_information_form = res
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
    async _getByIdCheckDeliveryToEdit(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}`)
        .then((response) => {
          if (response.data.success) {
            const res = response.data?.data
            if (res) {
              this.data_information_form = res
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

    async _updateCheckDelivery(data: ICheckDeliveryList, id: number) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${id}`, data)
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
    async _confirmCheckDelivery(data: {check_ids: number[]}) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}/confirm`, data)
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

    _setDataInformationForm(data_to_set: ICheckDeliveryList | null) {
      this.data_information_form = data_to_set ? { ...data_to_set } : null
    },

    _clearData() {
      this.data_check_delivery_list = []
      this.data_check_delivery_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})
