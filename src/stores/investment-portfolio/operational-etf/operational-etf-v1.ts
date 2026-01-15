import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  IOperationalETF,
  IOperationalETFEdit,
  IOperationalETFItem,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/exchange-traded-fund`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  operational_etf: {} as IOperationalETF,
  operational_etf_list: [] as IOperationalETFItem[],
  operational_etf_raw: null as IOperationalETFEdit | null,
  operational_etf_pages: {
    currentPage: 0,
    lastPage: 0,
  },
})

export const useOperationalETFStoreV1 = defineStore(
  'operational-etf-store-v1',
  {
    state: initialState,
    actions: {
      async _getOperationalETFList(params: string) {
        this._cleanOperationalETFsData()
        await executeApi()
          .get(`${URL_PATH}/list?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.operational_etf_list = response.data?.data?.data ?? []
              this.operational_etf_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
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
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
      async _createOperationalETF(payload: IOperationalETF) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/new`, payload)
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

      _cleanOperationalETFsData() {
        this.operational_etf_list = []
        this.operational_etf_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.operational_etf = initialState().operational_etf
      },
      async _getOperationalETF(id: number) {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/${id}/show`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.operational_etf_raw = response.data
                .data as IOperationalETFEdit
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
      async _updateOperationalETF(id: number, payload: IOperationalETF) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/${id}/update`, payload)
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

      async _updateOperationalETFStatus(id: number) {
        let success = false

        await executeApi()
          .patch(`${URL_PATH}/${id}/toggle-status`)
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
      async _deleteOperationalETF(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PATH}/${id}/delete`)
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
    },
  }
)
