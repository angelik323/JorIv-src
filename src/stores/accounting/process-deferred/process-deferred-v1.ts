import { defineStore } from 'pinia'

import { executeApi } from '@/apis'

import { useAlert, useShowError } from '@/composables'

import {
  IDeferredVoucher,
  IPaginated,
  IProcessDeferredPayload,
  IScheduleDeferralItem,
} from '@/interfaces/customs'

import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH = `${URL_PATH_ACCOUNTING}/deferred-processing`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  deferred_schedule: {} as IScheduleDeferralItem,
  deferred_vouchers: {
    list: [],
    pages: { currentPage: 0, lastPage: 0 },
  } as IPaginated<IScheduleDeferralItem>,
  selected_deferred_voucher: {} as IDeferredVoucher,
})

export const useProcessDeferredStoreV1 = defineStore(
  'process-deferred-store-v1',
  {
    state: initialState,
    actions: {
      _cleanProcessDeferredData() {
        this.deferred_vouchers.list = initialState().deferred_vouchers.list
        this.deferred_vouchers.pages.currentPage = 0
        this.deferred_vouchers.pages.lastPage = 0
      },
      _resetDeferredSchedule() {
        this.deferred_schedule = initialState().deferred_schedule
      },
      async _processDeferredVouchers(payload: IProcessDeferredPayload) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/process`, payload)
          .then((response) => {
            success = response.data.success
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

        return success
      },
      async _getDeferredVouchers(params: string) {
        let success = false
        await executeApi()
          .get(`${URL_PATH}?paginate=1&${params}`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.deferred_vouchers.list = response.data.data.data
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

        return success
      },
      async _showDeferredVoucherDetail(voucherId: number) {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/${voucherId}/show`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.selected_deferred_voucher = response.data.data
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

        return success
      },
    },
  }
)
