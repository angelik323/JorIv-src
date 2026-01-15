import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'
import { useAlert, useShowError } from '@/composables'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import {
  ICollectionReference,
  ICollectionReferenceForm,
  ICollectionReferenceList,
} from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/collection-references`

export const useCollectionReferenceStoreV1 = defineStore(
  'collection-reference-store-v1',
  {
    state: () => ({
      collection_reference_list: [] as ICollectionReferenceList,
      collection_reference_view: null as ICollectionReference | null,
      collection_reference_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
      collection_reference_form: null as ICollectionReferenceForm | null,
    }),

    actions: {
      async _getCollectionReferences(params: string) {
        this._clearData()

        await executeApi()
          .get(
            `${URL_PATH}?paginate=1&${params}`
          )
          .then((response) => {
            const {
              data: {
                data: items = [],
                current_page = 0,
                last_page = 0,
                total = 0,
                per_page = 0,
              },
            } = response.data

            this.collection_reference_list = items
            this.collection_reference_pages.currentPage = current_page
            this.collection_reference_pages.lastPage = last_page
            this.collection_reference_pages.total_items = total
            this.collection_reference_pages.per_page = per_page

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
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

      async _getByIdCollectionReference(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.collection_reference_view = {
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

      async _createCollectionReference(data: ICollectionReferenceForm) {
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

      async _updateCollectionReference(
        data: ICollectionReferenceForm,
        id: number
      ) {
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

      async _deleteCollectionReference(id: number) {
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

      _setCollectionReferenceForm(data: ICollectionReferenceForm | null) {
        this.collection_reference_form = data ? { ...data } : null
      },

      _clearData() {
        this.$reset()
      },
    },
  }
)
