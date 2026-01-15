// Pinia
import { defineStore } from 'pinia'

// APIs
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'

// Interfaces
import {
  ITerritorialTaxesItem,
  ITerritorialTaxesForm,
} from '@/interfaces/customs/accounts-payable/TerritorialTaxes'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/ica/territorial-taxes`

export const useTerritorialTaxesStoreV1 = defineStore(
  'territorial-taxes-store-v1',
  {
    state: () => ({
      territorial_taxes_list: [] as ITerritorialTaxesItem[],
      territorial_taxes_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      territorial_taxes_form: null as ITerritorialTaxesForm | null,
      territorial_taxes_response: null as ITerritorialTaxesItem | null,
    }),

    actions: {
      async _getTerritorialTaxesList(
        params: Record<string, string | number>
      ): Promise<{ data: ITerritorialTaxesItem[]; pages: { currentPage: number; lastPage: number } } | null> {
        let result: { data: ITerritorialTaxesItem[]; pages: { currentPage: number; lastPage: number } } | null = null

        await executeApi()
          .get(URL_PATH, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 1, last_page = 1 },
              message,
              success,
            } = response.data

            this.territorial_taxes_list = items as ITerritorialTaxesItem[]
            this.territorial_taxes_pages = {
              currentPage: current_page,
              lastPage: last_page,
            }

            result = {
              data: this.territorial_taxes_list,
              pages: this.territorial_taxes_pages,
            }

            showAlert(
              message ?? 'Listado obtenido exitosamente.',
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

        return result
      },

      async _createTerritorialTax(payload: ITerritorialTaxesForm) {
        let success = false
        await executeApi()
          .post(URL_PATH, payload)
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

      async _getTerritorialTaxById(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            this.territorial_taxes_response = data as ITerritorialTaxesItem

            showAlert(
              message ?? 'Registro obtenido exitosamente.',
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

      async _updateTerritorialTax(payload: ITerritorialTaxesForm, id: number) {
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

      async _deleteTerritorialTax(id: number) {
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

      _setFormData(data: ITerritorialTaxesForm | null) {
        this.territorial_taxes_form = data ? { ...data } : null
      },
    },
  }
)