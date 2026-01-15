import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IAccountingSettingsInformationFormV2,
  IAccountingSettingsListV2,
} from '@/interfaces/customs/settlement-commissions/AccountingSettingsV2'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_ACCOUNTING_SETTINGS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/accounting-parameters`

export const useAccountingSettingsStoreV2 = defineStore(
  'accounting-settings-store-v2',
  {
    state: () => ({
      version: 'v2',
      accounting_settings_list: [] as IAccountingSettingsListV2[],
      accounting_settings_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getAccountingSettingsList(
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(`${URL_ACCOUNTING_SETTINGS}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.accounting_settings_list = items
            this.accounting_settings_pages.currentPage = current_page
            this.accounting_settings_pages.lastPage = last_page

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

      async _getByIdAccountingSettings(id: number) {
        let response_data = null
        await executeApi()
          .get(`${URL_ACCOUNTING_SETTINGS}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success) {
              response_data = { ...responseData }
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
        return response_data
      },

      async _createAccountingSettings(
        data: Partial<IAccountingSettingsInformationFormV2>
      ) {
        let success = false

        await executeApi()
          .post(`${URL_ACCOUNTING_SETTINGS}`, data)
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

      async _updateAccountingSettings(
        data: Partial<IAccountingSettingsInformationFormV2>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_ACCOUNTING_SETTINGS}/${id}`, data)
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

      async _deleteAccountingSettings(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_ACCOUNTING_SETTINGS}/${id}`)
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
        this.accounting_settings_list = []
        this.accounting_settings_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
