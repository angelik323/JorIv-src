import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

import { useAlert, useShowError } from '@/composables'
import { IErrors } from '@/interfaces/global'
import { CollectionMethodsForm, ICollectionFormList } from '@/interfaces/customs/treasury/CollectionForms'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCollectionFormsV1 = defineStore('collection-forms', {
  state: () => ({
    collection_forms_list: [] as | ICollectionFormList[] | [],
    collection_method_view: null as ICollectionFormList | null,
  }),
  actions: {
    async _getListAction(params: string = '', pages: number = 20) {
      await executeApi()
        .get(
          `${URL_PATH_TREASURIES}/accounting_parameters_commissions/ways_to_collect?paginate=1&rows=${pages}${params}`
        )
        .then((response) => {
          if (response.data.success) {
            this.collection_forms_list = response.data?.data?.data ?? []
          }
          showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          this.collection_forms_list = []
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _getCollectionFormsList(params: string = '') {
      this.collection_forms_list = []
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/accounting_parameters_commissions/ways_to_collect?${params}`)
        .then((response) => {
          if (response.data.success) {
            this.collection_forms_list = response.data?.data?.data ?? []
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

    async _createCollectionMethod(data: CollectionMethodsForm) {
      let success = false

      await executeApi()
        .post(`${URL_PATH_TREASURIES}/accounting_parameters_commissions/ways_to_collect`, data)
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

    async _updateCollectionMethod(data: CollectionMethodsForm, id: number) {
      let success = false

      await executeApi()
        .put(`${URL_PATH_TREASURIES}/accounting_parameters_commissions/ways_to_collect/${id}`, data)
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

    async _getByIdCollectionMethod(id: number) {
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/accounting_parameters_commissions/ways_to_collect/${id}`)
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.collection_method_view = {
              ...responseData,
            }
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

    async _deleteCollectionForms(id: number) {
      await executeApi()
        .delete(
          `${URL_PATH_TREASURIES}/accounting_parameters_commissions/ways_to_collect/${id}`
        )
        .then((response) => {
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
  },
})
