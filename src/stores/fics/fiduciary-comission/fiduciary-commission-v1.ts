// Vue - pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import {
  IFiduciaryCommission,
  IFiduciaryCommissionRequest,
} from '@/interfaces/customs/fics/FiduciaryCommission'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_FICS}/fiduciary-commissions`

export const useFiduciaryCommissionStoreV1 = defineStore(
  'fiduciary-commission-store-v1',
  {
    state: () => ({
      version: 'v1',
      fiduciary_commission_list: [] as IFiduciaryCommission[],
      fiduciary_commission_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.fiduciary_commission_list = items.map(
              (item: IFiduciaryCommission) => ({
                ...item,
              })
            )
            this.fiduciary_commission_pages.currentPage = current_page
            this.fiduciary_commission_pages.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _showAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) {
              return response.data.data as IFiduciaryCommission
            }

            return showAlert(
              response.data.message,
              'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createAction(payload: IFiduciaryCommissionRequest) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
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

      async _updateAction(payload: IFiduciaryCommissionRequest) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${payload.id}`, payload)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      _clearData() {
        this.fiduciary_commission_list = []
        this.fiduciary_commission_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
