import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { ICollectionConceptsResponse } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCollectionsConceptsV1 = defineStore('collections-concepts-v1', {
  state: () => ({
    version: 'v1',
    collections_concepts_list: [] as ICollectionConceptsResponse[],
    collections_concepts_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as ICollectionConceptsResponse | null,
    error_information_form: null as string | null,
    collections_concepts_request: null as any,
  }),
  actions: {
    async _getCollectionConceptsList(params: string) {
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/collection-concept?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.collections_concepts_list = response.data?.data?.data ?? []
            this.collections_concepts_pages = {
              currentPage: response.data?.data?.current_page ?? 1,
              lastPage: response.data?.data?.last_page ?? 1,
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

    async _createCollectionConcepts(
      payload: ICollectionConceptsResponse
    ): Promise<boolean> {
      let success = false

      await executeApi()
        .post(`${URL_PATH_TREASURIES}/collection-concept`, payload)
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
          return false
        })
      return success
    },

    async _deleteCollectionConcepts(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_TREASURIES}/collection-concept/${id}`)
        .then((response) => {
          success = response.data.success
          showAlert(response.data.message, 'success', undefined, TIMEOUT_ALERT)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
      return success
    },

    async _updateCollectionConcepts(
      id: number,
      payload: object
    ): Promise<boolean> {
      let success = false

      await executeApi()
        .put(`${URL_PATH_TREASURIES}/collection-concept/${id}`, payload)
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
          return false
        })
      return success
    },

    async _getByIdCollectionConcepts(id: number) {
      this.collections_concepts_request = null
      await executeApi()
        .get(`${URL_PATH_TREASURIES}/collection-concept/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.collections_concepts_request = response.data.data ?? null
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

    async _setDataCollectionsConcepts(data: any | null) {
      this.data_information_form = data ? { ...data } : null
    },

    async _dataBasicError(data: string | null) {
      this.error_information_form = data ? { ...JSON.parse(data) } : null
    },
  },
})
