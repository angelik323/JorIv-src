// Vue - Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import { IAccountingParametersAssociatedBusinessesList } from '@/interfaces/customs/fics/AssociatedBusinesses'

// Composables
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'

const URL_PATH = `${TRUST_BUSINESS_API_URL}/accounting-block/list-business-trusts`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingParametersAssociatedBusinessesStoreV1 = defineStore(
  'associated-businesses-store-v1',
  {
    state: () => ({
      associated_businesses_list:
        [] as IAccountingParametersAssociatedBusinessesList,
      associated_businesses_pages: {
        currentPage: 0,
        lastPage: 0,
        total_items: 0,
        per_page: 0,
      },
    }),

    actions: {
      async _getAssociatedBusinesses(params: string) {
        this._clearDataAssociatedBusinesses()

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

            this.associated_businesses_list = items
            this.associated_businesses_pages = {
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

      _clearDataAssociatedBusinesses() {
        this.$reset()
      },
    },
  }
)
