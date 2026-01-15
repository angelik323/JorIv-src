import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IThirdPartiesFilterResponse } from '@/interfaces/customs/accounting/ThirdPartiesFilter'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useThirdPartiesFilterStoreV1 = defineStore(
  'third-parties-filter-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _advancedFiltersThirdParties(
        params: Record<string, string | number>
      ) {
        let thirdPartiesData: IThirdPartiesFilterResponse = {
          data: [],
          current_page: 0,
          last_page: 0,
        }
        let success = false

        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/v2/reports/advanced-filter/third-person?paginate=1`,
            {
              params,
            }
          )
          .then((response) => {
            if (response.data.success) {
              const data = response.data.data
              thirdPartiesData = data
              success = true
            }

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return { thirdPartiesData, success }
      },
    },
  }
)
