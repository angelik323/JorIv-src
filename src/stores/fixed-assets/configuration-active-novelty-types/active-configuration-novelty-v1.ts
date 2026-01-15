// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FIXED_ASSETS } from '@/constants/apis'

// interfaces
import {
  IConfigurationActiveCreate,
  IConfigurationActiveForm,
  IConfigurationActiveResponseList,
} from '@/interfaces/customs/fixed-assets/ConfigurationActiveNoveltyTypes'
import { IErrors } from '@/interfaces/global'

// prepare composables
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useActiveConfigNoveltyStoreV1 = defineStore(
  'active-configuration-novelty-v1',
  {
    state: () => ({}),

    actions: {
      async _getActiveNoveltyList(params: Record<string, string | number>) {
        const responseData = {
          pages: {
            currentPage: 1,
            lastPage: 1,
          },
          data: [] as IConfigurationActiveResponseList[],
        }

        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/fixed-assets-novelty`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const { data: items = [], message, success } = response.data
            responseData.data = items
            responseData.pages = {
              currentPage: 1,
              lastPage: 1,
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

      async _createActiveNovelty(payload: IConfigurationActiveCreate[]) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_FIXED_ASSETS}/fixed-assets-novelty`, payload)
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

      async _getActiveNoveltyById(id: number) {
        let responseData: IConfigurationActiveForm | null = null
        await executeApi()
          .get(`${URL_PATH_FIXED_ASSETS}/fixed-assets-novelty/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              responseData = data
            }
            if (success) {
              responseData = {
                id: data.id ?? null,
                code: data.code ?? null,
                created_by_name: data.created_by_name ?? null,
                updated_by_name: data.updated_by_name ?? null,
                updated_at: data.updated_at ?? null,
                created_at: data.created_at ?? null,
                configuration_active_novelty_types: [
                  {
                    id: data.id ?? null,
                    code: data.code ?? null,
                    description: data.description ?? null,
                    accounting: data.accounting ?? null,
                    affectation_type: data.affectation_type ?? null,
                  },
                ],
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

      async _updateActiveNovelty(
        payload: IConfigurationActiveCreate,
        id: number
      ) {
        let success = false
        await executeApi()
          .put(`${URL_PATH_FIXED_ASSETS}/fixed-assets-novelty/${id}`, payload)
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

      async _deleteActiveNovelty(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_FIXED_ASSETS}/fixed-assets-novelty/${id}`)
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
  }
)
