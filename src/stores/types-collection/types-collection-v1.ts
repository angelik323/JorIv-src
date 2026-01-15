import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  ITypesCollectionDetail,
  ITypesCollectionList,
} from '@interfaces/customs/TypesCollection'
import { executeApi } from '@/apis'

const TIMEOUT_ALERT = 3000
const URL_PATH_TREASURIES = 'treasuries/api/treasuries'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTypesCollection = defineStore('types-collection-v1', {
  state: () => ({
    types_collection_list: [] as ITypesCollectionList[] | [],
    types_collection_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as ITypesCollectionDetail | null,
    type_received_request: null as ITypesCollectionDetail | null,
  }),

  actions: {
    async _getTypeCollection(params: string) {
      this.types_collection_list = []
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/type-receives?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.types_collection_list = response.data?.data?.data ?? []
            this.types_collection_pages.currentPage =
              response.data?.data?.current_page ?? 0
            this.types_collection_pages.lastPage =
              response.data?.data?.last_page ?? 0
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

    async _updateTypeCollection(payload: ITypesCollectionDetail, id: number) {
      let success = false
      await executeApi()
        .put(`${URL_PATH_TREASURIES}/type-receives/${id}`, payload)
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

    async _getByIdTypeCollection(id: number) {
      this.type_received_request = null
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/type-receives/${id}`)
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

    async _createTypeCollection(payload: object): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_TREASURIES}/type-receives`, payload)
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

    async _deleteTypeCollection(params: number) {
      await executeApi()
        .delete(`${URL_PATH_TREASURIES}/type-receives/${params}`)
        .then(() => {
          showAlert('Tipo de recaudo eliminado', 'success')
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _setDataBasicCollection(data: ITypesCollectionDetail | null) {
      this.data_information_form = data ? { ...data } : null
    },
  },
})
