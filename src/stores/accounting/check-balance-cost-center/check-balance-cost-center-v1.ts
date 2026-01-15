import { useAlert, useShowError, useUtils } from '@/composables'
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { ICheckBalanceCostCenter } from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useCheckBalanceCostCenterStoreV1 = defineStore(
  'check-balance-cost-center-store-v1',
  {
    state: () => ({
      check_balance_cost_center: [] as ICheckBalanceCostCenter[],
      check_balance_cost_center_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getCheckBalanceCostCenter(params: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/check-balance-cost-center?paginate=1${params}`
          )
          .then((response) => {
            this.check_balance_cost_center = response.data?.data?.data ?? []
            this.check_balance_cost_center_pages = {
              currentPage: response.data?.data?.current_page,
              lastPage: response.data?.data?.last_page,
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
      async _downloadTemplate(params: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/check-balance-cost-center/export?${params}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })
            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message)
          })
      },
    },
  }
)
