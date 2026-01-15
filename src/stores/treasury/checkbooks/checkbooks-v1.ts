import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ICheckbookResponse,
  ICheckbookInformationForm,
  ICheckbookToCreate,
  ICheckbookToEdit,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/checkbooks`

export const useCheckbooksStoreV1 = defineStore('checkbooks-store-v1', {
  state: () => ({
    data_list: [] as ICheckbookResponse[],
    data_response: null as ICheckbookResponse | null,
    data_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as ICheckbookInformationForm | null,
  }),

  actions: {
    async _getCheckbooks(params: Record<string, string | number>) {
      this._clearData()

      await executeApi()
        .get(`${URL_PATH}`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.data_list = items as ICheckbookResponse[]
          this.data_pages.currentPage = current_page
          this.data_pages.lastPage = last_page

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

    async _getByIdCheckbook(id: number) {
      await executeApi()
        .get(`${URL_PATH}/${id}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.data_response = { ...responseData }
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

    async _createCheckbook(data: ICheckbookToCreate) {
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

    async _updateCheckbook(data: ICheckbookToEdit, id: number) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${id}`, data)
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

    async _deleteCheckbook(id: number) {
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

    _setDataInformationForm(data_to_set: ICheckbookInformationForm | null) {
      this.data_information_form = data_to_set ? { ...data_to_set } : null
    },

    _clearData() {
      this.data_list = []
      this.data_response = null
      this.data_pages = {
        currentPage: 0,
        lastPage: 0,
      }

      this._setDataInformationForm(null)
    },
  },
})
