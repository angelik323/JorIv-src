import { defineStore } from 'pinia'

// APIs
import { executeApi } from '@/apis'

// Utils
import { URL_PATH_JURISDICTIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Composables
import { useAlert, useShowError } from '@/composables'

// Interfaces
import {
  ITaxJurisdictionRequest,
  ITaxJurisdictionResponse,
  ITaxJurisdictionList,
} from '@/interfaces/customs/tax/Jurisdiction'

export const useJurisdictionsV1 = defineStore('jurisdictions-store-v1', {
  state: () => ({
    version: 'v1',
  }),
  actions: {
    async _getJurisdictions(params: string): Promise<{
      data: ITaxJurisdictionList[]
      pages: { currentPage: number; lastPage: number }
    }> {
      let response_data: ITaxJurisdictionList[] = []
      let response_pages = { currentPage: 1, lastPage: 1 }
      await executeApi()
        .get(
          `${URL_PATH_JURISDICTIONS}${params ? params + '&' : '?'}paginate=1`
        )
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
    async _createJurisdiction(
      payload: ITaxJurisdictionRequest | null
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .post(`${URL_PATH_JURISDICTIONS}`, payload)
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
    async _getJurisdiction(
      id: number
    ): Promise<ITaxJurisdictionResponse | null> {
      let response_data: ITaxJurisdictionResponse | null = null
      await executeApi()
        .get(`${URL_PATH_JURISDICTIONS}/${id}`)
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
    async _updateJurisdiction(
      id: number,
      payload: ITaxJurisdictionRequest
    ): Promise<boolean> {
      let success = false
      await executeApi()
        .put(`${URL_PATH_JURISDICTIONS}/${id}`, payload)
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

    async _deleteJurisdiction(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .delete(`${URL_PATH_JURISDICTIONS}/${id}`)
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

    async _changeStatusJurisdiction(id: number): Promise<boolean> {
      let success = false
      await executeApi()
        .patch(`${URL_PATH_JURISDICTIONS}/${id}/status`)
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
