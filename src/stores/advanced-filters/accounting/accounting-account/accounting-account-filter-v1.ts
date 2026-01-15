import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { IAccountStructureResource } from '@/interfaces/customs'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingAccountFilterStoreV1 = defineStore(
  'accounting-account-filter-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _advancedFiltersAccounts(
        account_structure_id: string | number | null,
        params: Record<string, string | number>
      ) {
        let accountsSelector: IAccountStructureResource[] = []
        let succes = false

        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/v2/reports/advanced-filter/accounts`, {
            params: { account_structure_id, ...params },
          })
          .then((response) => {
            if (response.data.success) {
              const data = response.data.data

              accountsSelector = data.map(
                (item: IAccountStructureResource) => ({
                  ...item,
                  value: item.code,
                  label: `${item.code} - ${item.name}`,
                })
              )

              succes = true
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

        return { accountsSelector, succes }
      },
    },
  }
)
