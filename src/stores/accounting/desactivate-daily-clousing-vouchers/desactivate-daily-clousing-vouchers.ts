// pinia
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'

// interfaces
import {
  IDesativateDailyClosingVouchers,
  IDesativateDailyClosingVouchersCreate,
} from '@/interfaces/customs'

export const useDesactivateDailyClousingVouchersV1 = defineStore(
  'desactivate-daily-closing-vouchers',
  {
    state: () => ({
      version: 'v1',
      desactivate_daily_closing_list: [] as IDesativateDailyClosingVouchers[],
      desactivate_daily_closing_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form:
        null as IDesativateDailyClosingVouchersCreate | null,
      desactivate_daily_closing_request:
        null as IDesativateDailyClosingVouchers | null,
    }),
    actions: {
      async _getListAction(params: string) {
        await executeApi()
          .get(`${URL_PATH_ACCOUNTING}/revert-vouchers?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.desactivate_daily_closing_list =
                response.data?.data?.data ?? []
              this.desactivate_daily_closing_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
      },

      async _createAction(
        data: IDesativateDailyClosingVouchersCreate
      ): Promise<boolean> {
        let success = false

        await executeApi()
          .post(`${URL_PATH_ACCOUNTING}/revert-vouchers`, data)
          .then((response) => {
            success = response.data.success
            return useAlert().showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            success = false
            useAlert().showAlert(
              useShowError().showCatchError(error),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })

        return success
      },

      _setDataInformationForm(
        data: IDesativateDailyClosingVouchersCreate | null
      ) {
        this.data_information_form = data
      },
    },
  }
)
