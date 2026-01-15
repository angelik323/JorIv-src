import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IAutomaticDebitSettingsForm,
  IAutomaticDebitSettingsList,
  IAutomaticDebitSettingsResponse,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_BILLING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const CONFIG = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
}

export const useAutomaticDebitSettingsStoreV1 = defineStore(
  'automatic-debit-settings-store-v1',
  {
    state: () => ({
      version: 'v1',
      headerPropsDefault: {
        title: 'Débito automático',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Facturación y cartera',
            route: '',
          },
          {
            label: 'Débito automático',
            route: 'AutomaticDebitList',
          },
        ],
      },
      automatic_debit_list: [] as IAutomaticDebitSettingsList[],
      automatic_debit_response: null as IAutomaticDebitSettingsResponse | null,
      automatic_debit_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getAutomaticDebitList(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_BILLING}/automatic-debit-collection`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.automatic_debit_list = items
            this.automatic_debit_pages.currentPage = current_page
            this.automatic_debit_pages.lastPage = last_page

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

      async _createAutomaticDebit(data: Partial<IAutomaticDebitSettingsForm>) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_BILLING}/automatic-debit-collection`, data, CONFIG)
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

      async _getByIdAutomaticDebit(id: number) {
        await executeApi()
          .get(`${URL_PATH_BILLING}/automatic-debit-collection/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.automatic_debit_response = { ...responseData }
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

      async _updateAutomaticDebit(
        data: Partial<IAutomaticDebitSettingsForm>,
        id: number
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_BILLING}/automatic-debit-collection/${id}`,
            data,
            CONFIG
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

      async _changeStatusAutomaticDebit(id: number, status: boolean) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_BILLING}/automatic-debit-collection/change-status/${id}`,
            { is_active: status }
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
        this.automatic_debit_list = []
        this.automatic_debit_response = null
        this.automatic_debit_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
