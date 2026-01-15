import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import { useAlert, useShowError } from '@/composables'

import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IExchangeTradedFund } from '@/interfaces/customs'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_INVESTMENT_PORTFOLIO}/exchange-traded-fund`

export const useExchangedTradedFundsStoreV1 = defineStore(
  'exchanged-traded-funds-store-v1',
  {
    state: () => ({
      version: 'v1',
      exchange_traded_fund_list: [] as IExchangeTradedFund[],
      exchange_traded_fund_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}/operations`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.exchange_traded_fund_list = items
            this.exchange_traded_fund_pages = {
              currentPage: current_page,
              lastPage: last_page,
            }

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.exchange_traded_fund_list = []
        this.exchange_traded_fund_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
