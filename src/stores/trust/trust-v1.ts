import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Composables
import { useAlert, useShowError } from '@/composables'

// Interfaces
import { IErrors, IResource } from '@/interfaces/global'

// Constants
const URL_PATH_TRUST =
  'assets/api/assets/third-parties/customers/fideicomiso-person'
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTrustV1 = defineStore('trust-v1', {
  state: () => ({
    trust_list: [] as IResource[],
    trust_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    trust_request: {} as IErrors,
  }),
  actions: {
    async _getListAction(params: string) {
      this.trust_list = []
      await executeApi()
        .get(`${URL_PATH_TRUST}?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            const data = response.data?.data

            this.trust_list = data?.users?.data ?? []
            this.trust_pages.currentPage = data?.users?.current_page ?? 0
            this.trust_pages.lastPage = data?.users?.last_page ?? 0
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
  },
})
