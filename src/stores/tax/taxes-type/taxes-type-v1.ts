import { defineStore } from 'pinia'

// APIs
import { executeApi } from '@/apis'

// Utils
import { URL_PATH_TAX_TYPES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Composables
import { useAlert, useShowError } from '@/composables'

// Interfaces
import {
  ITaxTypeTaxRequest,
  ITaxTypeTaxResponse,
  ITaxTypeTaxList,
} from '@/interfaces/customs/tax/TaxType'

export const useTaxesTypeV1 = defineStore('taxes-type-store-v1', {
  state: () => ({
    version: 'v1',
  }),
  actions: {
    async _getTaxesTypes(params: string): Promise<{
      data: ITaxTypeTaxList[]
      pages: { currentPage: number; lastPage: number }
    }> {
      let response_data: ITaxTypeTaxList[] = []
      let response_pages = { currentPage: 1, lastPage: 1 }
      await executeApi()
        .get(`${URL_PATH_TAX_TYPES}${params ? params + '&' : '?'}paginate=1`)
        .then((response) => {
          response_data = response?.data?.data?.data ?? []
          response_pages = {
            currentPage: response?.data?.data?.current_page ?? 1,
            lastPage: response?.data?.data?.last_page ?? 1,
          }
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })

      return { data: response_data, pages: response_pages }
    },
    async _createTaxType(payload: ITaxTypeTaxRequest): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_TAX_TYPES}`, payload)
        .then((response) => {
          if (response.data.success) {
            success = true
          }

          useAlert().showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })

      return success
    },
    async _getTaxType(id: number): Promise<ITaxTypeTaxResponse | null> {
      let response_data: ITaxTypeTaxResponse | null = null
      await executeApi()
        .get(`${URL_PATH_TAX_TYPES}/${id}`)
        .then((response) => {
          response_data = response?.data?.data ?? null

          useAlert().showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })

      return response_data
    },
    async _updateTaxType(
      id: number,
      payload: ITaxTypeTaxRequest
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_TAX_TYPES}/${id}`, payload)
        .then((response) => {
          if (response.data.success) {
            success = true
          }

          useAlert().showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })

      return success
    },

    async _deleteTaxType(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_TAX_TYPES}/${id}`)
        .then((response) => {
          if (response.data.success) {
            success = true
          }

          useAlert().showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })

      return success
    },

    async _changeStatusTaxType(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .patch(`${URL_PATH_TAX_TYPES}/${id}/status`)
        .then((response) => {
          if (response.data.success) {
            success = true
          }

          useAlert().showAlert(
            response.data.message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })

      return success
    },
  },
})
