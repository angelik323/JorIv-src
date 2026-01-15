// Pinia
import { defineStore } from 'pinia'

// APIs
import { executeApi } from '@/apis'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// Interfaces
import { IErrors } from '@/interfaces/global/'
import {
  IDocumentaryStructureContractList,
  IDocumentaryStructureContractAnnexedDocumentList,
  IDocumentaryStructureContractForm,
} from '@/interfaces/customs/derivative-contracting/DocumentaryStructureContract'

// Constants
import { URL_PATH_DERIVATIVE_CONTRACTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_DERIVATIVE_CONTRACTING}/contract-document`

export const useDocumentaryStructureContractStoreV1 = defineStore(
  'documentary-structure-contract-store-v1',
  {
    state: () => ({
      documentary_structure_contracts_list:
        [] as IDocumentaryStructureContractList,
      documentary_structure_contracts_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
      annexed_documents_list:
        [] as IDocumentaryStructureContractAnnexedDocumentList,
      annexed_documents_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
    }),

    actions: {
      async _getListAction(params: string) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
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

            this.documentary_structure_contracts_list = items
            this.documentary_structure_contracts_pages = {
              currentPage: current_page,
              lastPage: last_page,
              total_items: total,
              per_page: per_page,
            }

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

      async _getListAnnexedDocumentsAction(params: string) {
        await executeApi()
          .get(`${URL_PATH}/listAnnex?paginate=1${params}`)
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

            this.annexed_documents_list = items
            this.annexed_documents_pages = {
              currentPage: current_page,
              lastPage: last_page,
              total_items: total,
              per_page: per_page,
            }

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

      async _getByIdAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              return responseData
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createAction(data: IDocumentaryStructureContractForm) {
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

      async _updateAction(data: IDocumentaryStructureContractForm, id: number) {
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

      async _deleteAction(id: number) {
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

      async _updateStatusAnnexedDocumentAction(annexedId: number) {
        let success = false

        await executeApi()
          .patch(`${URL_PATH}/${annexedId}`)
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

      _clearData() {
        this.documentary_structure_contracts_list = []
        this.annexed_documents_list = []
        this.documentary_structure_contracts_pages = {
          currentPage: 0,
          lastPage: 0,
          total_items: 0,
          per_page: 0,
        }
        this.annexed_documents_pages = {
          currentPage: 0,
          lastPage: 0,
          total_items: 0,
          per_page: 0,
        }
      },
    },
  }
)
