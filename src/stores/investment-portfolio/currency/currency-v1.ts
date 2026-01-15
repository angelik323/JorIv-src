import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ICurrencyListItem,
  ICurrencyResponse,
  ICurrencyToCreate,
  ICurrencyToEdit,
} from '@/interfaces/customs/investment-portfolio/Currency'
import { IErrors } from '@/interfaces/global'

// Composables - Utils
import { useUtils, useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/currencies`

export const useCurrencyStoreV1 = defineStore('currency-store-v1', {
  state: () => ({
    headerPropsDefault: {
      title: 'Monedas',
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Portafolio de inversiones',
        },
        {
          label: 'Monedas',
          route: 'CurrencyList',
        },
      ],
      btn: {
        label: 'Crear',
        icon: useUtils().defaultIconsLucide.plusCircleOutline,
      },
    },
    currency_list: [] as ICurrencyListItem[],
    currency_response: null as ICurrencyResponse | null,
    currency_pages: {
      currentPage: 0,
      lastPage: 0,
    },
  }),

  actions: {
    async _getListAction(params: Record<string, string | number>) {
      this._clearData()

      await executeApi()
        .get(`${URL_PATH}/list`, {
          params: { ...params, paginate: 1 },
        })
        .then((response) => {
          const {
            data: { data: items = [], current_page = 0, last_page = 0 },
            message,
            success,
          } = response.data

          this.currency_list = items as ICurrencyListItem[]
          this.currency_pages.currentPage = current_page
          this.currency_pages.lastPage = last_page

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

    async _getByCurrencyId(
      currencyId: number,
      params?: Record<string, string | number>
    ) {
      await executeApi()
        .get(`${URL_PATH}/${currencyId}`, {
          params: { ...params },
        })
        .then((response) => {
          const { data: responseData, message, success } = response.data

          if (success && responseData) {
            this.currency_response = { ...responseData }
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

    async _createCurrency(data: Partial<ICurrencyToCreate>) {
      let success = false

      await executeApi()
        .post(`${URL_PATH}`, data)
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

    async _updateCurrency(data: Partial<ICurrencyToEdit>, currencyId: number) {
      let success = false

      await executeApi()
        .put(`${URL_PATH}/${currencyId}`, data)
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
      this.currency_list = []
      this.currency_response = null
      this.currency_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})
