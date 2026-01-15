import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IIsinesCodesForm } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useIsinesCodesStoreV1 = defineStore('isines-codes-store-v1', {
  state: () => ({
    version: 'v1',
    isines_codes_list: [] as IIsinesCodesForm[],
    isines_codes_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as IIsinesCodesForm | null,
  }),

  actions: {
    async _getListAction(params: string = '', pages: number = 1) {
      this._cleanData()
      await executeApi()
        .get(
          `${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/list?paginate=${pages}${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.isines_codes_list = response.data.data.data ?? []
            this.isines_codes_pages = {
              currentPage: response.data?.data?.current_page ?? 0,
              lastPage: response.data?.data?.last_page ?? 0,
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
    },

    async _getByIdIsinesCodes(id: number) {
      await executeApi()
        .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/show/${id}`)
        .then((response) => {
          if (response.data.success) {
            const res = response.data.data
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

    async _updateIsinesCodes(data: IIsinesCodesForm, id: number) {
      let success = false

      await executeApi()
        .put(`${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/update/${id}`, data)
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
    async _createIsinesCodes(data: IIsinesCodesForm) {
      let success = false

      await executeApi()
        .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/new/`, data)
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
    async _deleteIsinesCodes(id: number) {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_INVESTMENT_PORTFOLIO}/isin-code/destroy/${id}`)
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
    _setDataInformationForm(data_to_set: IIsinesCodesForm | null) {
      this.data_information_form = data_to_set ? { ...data_to_set } : null
    },

    _cleanData() {
      this.isines_codes_list = []
      this.isines_codes_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})
