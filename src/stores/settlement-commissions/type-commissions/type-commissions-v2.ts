import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ITypeCommissionsInformationFormV2,
  ITypeCommissionsListV2,
  ITypeCommissionsResponseV2,
} from '@/interfaces/customs/settlement-commissions/TypeCommissionsV2'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTypeCommissionsStoreV2 = defineStore(
  'type-commissions-store-v2',
  {
    state: () => ({
      version: 'v2',
      headerPropsDefault: {
        title: 'Tipos de comisión',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Liquidación de comisiones',
            route: '',
          },
          {
            label: 'Tipos de comisión',
            route: 'CommissionTypesList',
          },
        ],
      },
      type_commissions_list: [] as ITypeCommissionsListV2[],
      type_commissions_response: null as ITypeCommissionsResponseV2 | null,
      type_commissions_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getTypeCommissionsList(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.type_commissions_list = items
            this.type_commissions_pages.currentPage = current_page
            this.type_commissions_pages.lastPage = last_page

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

      async _getByIdTypeCommissions(id: number) {
        await executeApi()
          .get(`${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.type_commissions_response = { ...responseData }
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

      async _createTypeCommissions(
        data: Partial<ITypeCommissionsInformationFormV2>
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types`, data)
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

      async _updateTypeCommissions(
        data: Partial<ITypeCommissionsInformationFormV2>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/commission-types/${id}`,
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
        this.type_commissions_list = []
        this.type_commissions_response = null
        this.type_commissions_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
