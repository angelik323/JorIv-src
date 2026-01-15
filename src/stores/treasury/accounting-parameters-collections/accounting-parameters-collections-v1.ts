import { IErrors } from '@/interfaces/global'
import { defineStore } from 'pinia'
import { useAlert, useShowError } from '@/composables'
import { executeApi } from '@/apis'
import { URL_PATH_TREASURIES } from '@/constants/apis'

// Interfaces
import { ICollectionAccountingParameterList } from '@/interfaces/customs/treasury/CollectionAccountingBlocks'
import {
  IAccountingParametersCollections,
  IAccountingParametersCollectionsForm,
} from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useUtils } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/v2/accounting-parameters-collections`

export const useAccountingParametersCollectionsStoreV1 = defineStore(
  'accounting-parameters-collections-store-v1',
  {
    state: () => ({
      accounting_parameters_collections_list:
        [] as ICollectionAccountingParameterList[],
      accounting_parameters_collections_response:
        null as IAccountingParametersCollections | null,
      accounting_parameters_collections_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      accounting_parameters_collections_form:
        null as IAccountingParametersCollectionsForm | null,
    }),

    actions: {
      async _getAccountingParametersCollection(params: string = '', page: number = 1) {
        this.accounting_parameters_collections_list = []
        await executeApi()
          .get(
            `${URL_PATH}?paginate=1&page=${page}${params}`
          )
          .then((response) => {
            const {
              data: { data, current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.accounting_parameters_collections_list = data
            this.accounting_parameters_collections_pages.currentPage =
              current_page
            this.accounting_parameters_collections_pages.lastPage = last_page

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getByIdAccountingParametersCollections(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.accounting_parameters_collections_response = {
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

      async _createAccountingParametersCollections(
        data: IAccountingParametersCollectionsForm
      ) {
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

      async _updateAccountingParametersCollections(
        data: IAccountingParametersCollectionsForm,
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

      async _deleteAccountingParametersCollections(id: number) {
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

      async _downloadAccountingParametersCollections(ids: number[]) {
        if (!ids.length) return

        await executeApi()
          .get(`${URL_PATH}/export`, {
            params: { accounting_block_ids: ids },
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName.replace(/['"]/g, ''))
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _setAccountingParametersCollectionsForm(
        data_to_set: IAccountingParametersCollectionsForm | null
      ) {
        this.accounting_parameters_collections_form = data_to_set
          ? { ...data_to_set }
          : null
      },

      _clearData() {
        this.accounting_parameters_collections_list = []
        this.accounting_parameters_collections_form = null
        this.accounting_parameters_collections_response = null
        this.accounting_parameters_collections_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
