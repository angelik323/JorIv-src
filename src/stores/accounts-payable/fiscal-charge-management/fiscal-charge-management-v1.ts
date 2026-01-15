// Pinia - Apis
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IFiscalChargeManagementForm,
  IFiscalChargeManagementItem,
} from '@/interfaces/customs/accounts-payable/FiscalChargeManagement'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/fiscal-charges`

export const useFiscalChargeManagementStoreV1 = defineStore(
  'fiscal-charge-management-store-v1',
  {
    state: () => ({
      fiscal_charge_management_list: [] as IFiscalChargeManagementItem[],
      fiscal_charge_management_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _getFiscalChargeManagementList(
        params: Record<string, string | number | null>
      ) {
        await executeApi()
          .get(`${URL_PATH}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.fiscal_charge_management_list = items

            this.fiscal_charge_management_pages = {
              currentPage: current_page,
              lastPage: last_page,
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
      async _createFiscalChargeManagement(
        payload: IFiscalChargeManagementForm
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
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

      async _getFiscalChargeManagementById(
        id: number
      ): Promise<IFiscalChargeManagementItem | null> {
        let fiscal_charge_management_response: IFiscalChargeManagementItem | null =
          null
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              fiscal_charge_management_response = data
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
        return fiscal_charge_management_response
      },

      async _updateFiscalChargeManagement(
        payload: IFiscalChargeManagementForm,
        id: number
      ) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${id}`, payload)
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

      async _updateFiscalChargeManagementStatus(id: number) {
        let success = false
        await executeApi()
          .patch(`${URL_PATH}/${id}/toggle-status`)
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

      async _deleteFiscalChargeManagement(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH}/${id}`)
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
        this.fiscal_charge_management_list = []
        this.fiscal_charge_management_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
