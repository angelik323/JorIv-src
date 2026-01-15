// core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import { IErrors } from '@/interfaces/global'
import {
  IBusinessesPaymentBlock,
  IPaymentBlockForm,
  IPaymentBlockItem,
  IPaymentConceptItem,
  IPaymentConceptUpdate,
  ISettlementConcepts,
  ISettlementConceptsUpdate,
} from '@/interfaces/customs/accounts-payable/PaymentBlocks'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// prepare composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePaymentBlocksStoreV1 = defineStore('payment-blocks-store-v1', {
  state: () => ({}),

  actions: {
    async _getPaymentBlockList(params: Record<string, string | number>) {
      const responseData = {
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
        data: [] as IPaymentBlockItem[],
      }

      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          responseData.data = items
          responseData.pages = {
            currentPage: current_page,
            lastPage: last_page,
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
      return responseData
    },

    async _createPaymentBlock(payload: IPaymentBlockForm) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks`, payload)
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

    async _getPaymentBlockById(id: number) {
      let responseData: IPaymentBlockForm | null = null
      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/${id}`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            responseData = data
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
      return responseData
    },

    async _updatePaymentBlock(payload: IPaymentBlockForm, id: number) {
      let success = false
      await executeApi()
        .put(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/${id}`, payload)
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

    async _deletePaymentBlock(id: number) {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/${id}`)
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

    async _getPaymentConceptsById(
      params: Record<string, string | number>,
      id: number
    ) {
      const responseData = {
        pages: {
          currentPage: 1,
          lastPage: 1,
        },
        data: [] as IPaymentConceptItem[],
      }
      await executeApi()
        .get(
          `${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/${id}/payment-concepts`,
          {
            params: { ...params, paginate: 1 },
          }
        )
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            responseData.data = data.data
            responseData.pages = {
              currentPage: data.current_page,
              lastPage: data.last_page,
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
      return responseData
    },

    async _createPaymentConcept(
      payload: { concepts: IPaymentConceptItem[] },
      id: number
    ) {
      let success = false
      await executeApi()
        .post(
          `${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/${id}/payment-concepts`,
          payload
        )
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

    async _deleteConcept(blockId: number, id: number) {
      let success = false
      await executeApi()
        .delete(
          `${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/${blockId}/payment-concepts/${id}`
        )
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

    async _createSettlementConcept(
      payload: { concepts: ISettlementConcepts[] },
      blockId: number,
      conceptId: number
    ) {
      let success = false
      await executeApi()
        .post(
          `${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/${blockId}/payment-concepts/${conceptId}/settlement-concepts`,
          payload
        )
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

    async _deleteSettlement(id: number) {
      let success = false
      await executeApi()
        .delete(
          `${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/settlement-concepts/${id}`
        )
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

    async _updatePaymentConcept(
      payload: IPaymentConceptUpdate,
      blockId: number,
      conceptId: number
    ) {
      let success = false
      await executeApi()
        .put(
          `${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/${blockId}/payment-concepts/${conceptId}`,
          payload
        )
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

    async _updateSettlementConcept(
      payload: ISettlementConceptsUpdate,
      id: number
    ) {
      let success = false
      await executeApi()
        .put(
          `${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/settlement-concepts/${id}`,
          payload
        )
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

    async _getBusinessesById(id: number) {
      let responseData: IBusinessesPaymentBlock[] | null = null
      await executeApi()
        .get(`${URL_PATH_ACCOUNTS_PAYABLE}/payment-blocks/${id}/businesses`)
        .then((response) => {
          const { data, message, success } = response.data
          if (success) {
            responseData = data
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
      return responseData
    },
  },
})
