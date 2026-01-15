// Core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

// Interfaces
import { IPaginated } from '@/interfaces/customs/IPages'
import {
  IPendingVoucherItem,
  IVoucherAuthorizationPayload,
} from '@/interfaces/customs/accounting/VoucherAuthorization'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const URL_PATH = `${URL_PATH_ACCOUNTING}/voucher-authorizations`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
})

export const useVoucherAuthorizationStoreV1 = defineStore(
  'voucher-authorization-store-v1',
  {
    state: initialState,
    actions: {
      async _getPendingVouchers(
        params: Record<string, string | number>
      ): Promise<IPaginated<IPendingVoucherItem> | null> {
        let pendingVouchers: IPaginated<IPendingVoucherItem> | null = null
        await executeApi()
          .get(`${URL_PATH}`, { params: { paginate: 1, ...params } })
          .then((response) => {
            if (response.data.success) {
              pendingVouchers = {
                list: response.data?.data?.data ?? [],
                pages: {
                  currentPage: response.data?.data?.current_page ?? 0,
                  lastPage: response.data?.data?.last_page ?? 0,
                },
              }
            }

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(
              showCatchError(error),
              error.status === 404 ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
        return pendingVouchers
      },
      async _processVoucherAuthorization(
        payload: IVoucherAuthorizationPayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/process`, payload)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT - 2000
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
