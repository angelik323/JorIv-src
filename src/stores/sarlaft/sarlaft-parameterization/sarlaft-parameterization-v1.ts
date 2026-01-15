// Vue - pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'

// Constants
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

const URL_PATH = `${URL_PATH_SARLAFT}/parameters`

export const useSarlaftParameterizationStoreV1 = defineStore(
  'sarlaft-parameterization-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        return await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            if (success) {
              return {
                list: items,
                pages: { currentPage: current_page, lastPage: last_page },
              }
            }

            return showAlert(
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

      async _updateAction(payload: {
        id: number
        value: string | number
        countries?: Array<{ name: string; code: number; selectable_id: number }>
      }) {
        let success = false
        const body = payload?.countries?.length
          ? { value: payload.value, countries: payload.countries }
          : { value: payload.value }
        await executeApi()
          .put(`${URL_PATH}/${payload.id}`, body)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
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
    },
  }
)
