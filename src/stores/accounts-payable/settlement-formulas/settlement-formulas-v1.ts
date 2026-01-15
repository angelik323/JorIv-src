// Pinia
import { defineStore } from 'pinia'

//Api
import { executeApi } from '@/apis'

//Composables
import { useAlert, useShowError } from '@/composables'

//Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

//Interfaces
import {
  ISettlementFormulasCreatePayload,
  ISettlementFormulasItem,
  ISettlementFormulasUpdatePayload,
} from '@/interfaces/customs/accounts-payable/SettlementFormulas'
import { IErrors } from '@/interfaces/global/errorMessage'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/settlement-formulas`

export const useSettlementFormulasStoreV1 = defineStore(
  'settlement-formulas-store-v1',
  {
    state: () => ({
      settlement_formulas_list: [] as ISettlementFormulasItem[],
      settlement_formulas_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _getSettlementFormulasList(
        params: Record<string, string | number | null>
      ) {
        await executeApi()
          .get(`${URL_PATH}`, {
            params: { ...params, paginate: 1, order_by: 'id,desc' },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.settlement_formulas_list = items

            this.settlement_formulas_pages = {
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

      async _createSettlementFormulas(
        payload: ISettlementFormulasCreatePayload
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

      async _getSettlementFormulasById(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              return data
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _updateSettlementFormulas(
        payload: ISettlementFormulasUpdatePayload,
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

      async _deleteSettlementFormulas(id: number) {
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
        this.settlement_formulas_list = []
        this.settlement_formulas_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
