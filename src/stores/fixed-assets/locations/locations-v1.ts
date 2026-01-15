// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces - constants
import { IErrors } from '@/interfaces/global'
import {
  ICreateLocationPayload,
  ILocationListItem,
} from '@/interfaces/customs/fixed-assets/v1/Locations'
import { IPaginated } from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'

// composables
import { useAlert, useShowError } from '@/composables'

// prepare composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useLocationsStoreV1 = defineStore('locations-v1', {
  state: () => ({}),

  actions: {
    async _getLocationsList(params: Record<string, string | number>) {
      let responseData: IPaginated<ILocationListItem> | null = {
        pages: {
          currentPage: 0,
          lastPage: 0,
        },
        list: [],
      }

      await executeApi()
        .get(`${URL_PATH_FIXED_ASSETS}/locations`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          responseData = {
            list: data,
            pages: { currentPage: current_page, lastPage: last_page },
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

    async _toggleLocationsStatus(idLocation: number) {
      let success = false
      await executeApi()
        .patch(`${URL_PATH_FIXED_ASSETS}/locations/${idLocation}/toggle-status`)
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
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
      return success
    },

    async _createLocation(payload: ICreateLocationPayload) {
      let success = false
      await executeApi()
        .post(`${URL_PATH_FIXED_ASSETS}/locations`, payload)
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

    async _updateLocation(payload: ICreateLocationPayload, idLocation: number) {
      let success = false
      await executeApi()
        .put(`${URL_PATH_FIXED_ASSETS}/locations/${idLocation}`, payload)
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
  },
})
