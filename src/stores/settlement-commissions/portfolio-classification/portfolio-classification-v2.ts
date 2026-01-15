import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IPortfolioClassificationList,
  IPortfolioClassificationResponse,
  IPortfolioClassificationForm,
} from '@/interfaces/customs/settlement-commissions/PortfolioClassification'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PORTFOLIO_CLASSIFICATIONS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/porfolio-classifications`

export const usePortfolioClassificationStoreV2 = defineStore(
  'portfolio-classification-store-v2',
  {
    state: () => ({
      version: 'v2',
      headerPropsDefault: {
        title: 'Calificación de cartera',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Liquidación de comisiones',
          },
          {
            label: 'Calificación de cartera',
            route: 'PortfolioClassificationList',
          },
        ],
      },
      portfolio_classifications_list: [] as IPortfolioClassificationList[],
      portfolio_classifications_response:
        null as IPortfolioClassificationResponse | null,
      portfolio_classifications_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getPortfolioClassificationList(
        params: Record<string, string | number>
      ) {
        this._clearData()

        await executeApi()
          .get(`${URL_PORTFOLIO_CLASSIFICATIONS}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.portfolio_classifications_list = items
            this.portfolio_classifications_pages.currentPage = current_page
            this.portfolio_classifications_pages.lastPage = last_page

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

      async _getByIdPorfolioClassification(portfolioId: number) {
        await executeApi()
          .get(`${URL_PORTFOLIO_CLASSIFICATIONS}/${portfolioId}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.portfolio_classifications_response = { ...responseData }
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

      async _createPorfolioClassification(
        data: Partial<IPortfolioClassificationForm>
      ) {
        let success = false

        await executeApi()
          .post(`${URL_PORTFOLIO_CLASSIFICATIONS}`, data)
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

      async _updatePortfolioClassification(
        data: Partial<IPortfolioClassificationForm>,
        portfolioId: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PORTFOLIO_CLASSIFICATIONS}/${portfolioId}`, data)
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

      async _deletePortfolioClassification(id: number) {
        let success = false

        await executeApi()
          .delete(`${URL_PORTFOLIO_CLASSIFICATIONS}/${id}`)
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
        this.portfolio_classifications_list = []
        this.portfolio_classifications_response = null
        this.portfolio_classifications_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
