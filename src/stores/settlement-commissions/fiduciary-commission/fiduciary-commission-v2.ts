import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IFiduciaryCommissionLiquidateV2,
  IFiduciaryCommissionListV2,
} from '@/interfaces/customs/settlement-commissions/FiduciaryCommissionV2'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useFiduciaryCommissionsStoreV2 = defineStore(
  'settlement-commission-store-v2',
  {
    state: () => ({
      version: 'v2',
      fiduciary_commission_list: [] as IFiduciaryCommissionListV2[],
      fiduciary_commission_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getFiduciaryCommissionList(
        params: Record<string, string | number | boolean>
      ) {

        this._clearData()

        let responseList = {
          list: [] as IFiduciaryCommissionListV2[],
          pages: { currentPage: 0, lastPage: 0 },
        }

        await executeApi()
          .get(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/commission-calculations`,
            {
              params: {
                ...params,
                'filter[only_registered]': true,
              },
            }
          )
          .then((response) => {
            const {
              data,
              message,
              success,
            } = response.data

            const hasParams = Object.keys(params).length > 0

            responseList = hasParams && data.data
              ? {
                list: data.data || [],
                pages: {
                  currentPage: data.current_page || 0,
                  lastPage: data.last_page || 0
                },
              }
              : {
                list: data || [],
                pages: { currentPage: 0, lastPage: 0 },
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

        return responseList
      },

      async _liquidateFiduciaryCommission(
        data: IFiduciaryCommissionLiquidateV2
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/settle-commissions`,
            data
          )
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

      _clearData() {
        this.fiduciary_commission_list = []
        this.fiduciary_commission_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
