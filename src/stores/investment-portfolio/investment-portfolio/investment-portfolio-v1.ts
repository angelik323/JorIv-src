import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  IInvestmentPortfolio,
  IInvestmentPortfolioItem,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/portfolio`
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  investment_portfolio: {} as IInvestmentPortfolio,
  investment_portfolio_list: [] as IInvestmentPortfolioItem[],
  investment_portfolio_pages: {
    currentPage: 0,
    lastPage: 0,
  },
})

export const useInvestmentPortfolioStoreV1 = defineStore(
  'investment-portfolio-store-v1',
  {
    state: initialState,
    actions: {
      async _getInvestmentPortfolioList(params: string) {
        this._cleanInvestmentPortfoliosData()
        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.investment_portfolio_list = response.data?.data?.data ?? []
              this.investment_portfolio_pages = {
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
      async _createInvestmentPortfolio(payload: IInvestmentPortfolio) {
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

      _cleanInvestmentPortfoliosData() {
        this.investment_portfolio_list = []
        this.investment_portfolio_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.investment_portfolio = initialState().investment_portfolio
      },
      async _getInvestmentPortfolio(id: number) {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.investment_portfolio = response.data.data
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
      async _updateInvestmentPortfolio(
        id: number,
        payload: IInvestmentPortfolio
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH}/${id}`, payload)
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

      async _updateInvestmentPortfolioStatus(id: number) {
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
    },
  }
)
