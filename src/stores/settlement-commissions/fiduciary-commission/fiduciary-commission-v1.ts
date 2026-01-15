import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IFiduciaryCommissionResponse,
  IFiduciaryCommissionList,
  IFiduciaryCommissionForm,
  IFiduciaryCommissionLiquidate,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useFiduciaryCommissionsStoreV1 = defineStore(
  'settlement-commission-store-v1',
  {
    state: () => ({
      version: 'v1',
      fiduciary_commission_list: [] as IFiduciaryCommissionList[],
      fiduciary_commission_response:
        null as IFiduciaryCommissionResponse | null,
      fiduciary_commission_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getFiduciaryCommissionList(
        params: Record<string, string | number>
      ) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.fiduciary_commission_list = items
            this.fiduciary_commission_pages.currentPage = current_page
            this.fiduciary_commission_pages.lastPage = last_page

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
      },

      async _getByIdFiduciaryCommission(id: number) {
        await executeApi()
          .get(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions/${id}`
          )
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.fiduciary_commission_response = { ...responseData }
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
      },

      async _updateFiduciaryCommission(
        data: Partial<IFiduciaryCommissionForm>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions/${id}`,
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

      async _liquidateFiduciaryCommission(data: IFiduciaryCommissionLiquidate) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/settlement-commissions`,
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
        this.fiduciary_commission_response = null
        this.fiduciary_commission_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
