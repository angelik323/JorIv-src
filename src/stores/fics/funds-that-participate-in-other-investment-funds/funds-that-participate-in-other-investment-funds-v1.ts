// Apis - Pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'
import {
  IFundsThatParticipateInOtherInvestmentFundInfo,
  IFundsThatParticipateInOtherInvestmentFundsList,
  IFundsThatParticipateInOtherInvestmentMovementsList,
  IFundsThatParticipateInOtherInvestmentMovementsPayload,
} from '@/interfaces/customs/fics/FundsThatParticipateInOtherInvestmentFunds'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_FICS}/fund-participations`

export const useFundsThatParticipateInOtherInvestmentFundsStoreV1 = defineStore(
  'funds-that-participate-in-other-investment-funds-store-v1',
  {
    state: () => ({
      fund_origin_info: {
        business_trust: {
          business_code: '',
          name: '',
        },
        id: 0,
        name: '',
      } as IFundsThatParticipateInOtherInvestmentFundInfo,

      funds_that_participate_in_other_investment_funds_list:
        [] as IFundsThatParticipateInOtherInvestmentFundsList[],
      funds_that_participate_in_other_investment_funds_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      funds_that_participate_in_other_investment_funds_movements_list:
        [] as IFundsThatParticipateInOtherInvestmentMovementsList[],
      funds_that_participate_in_other_investment_funds_movements_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getFundsThatParticipateInOtherInvestmentFundsList(
        fund_id: number,
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(`${URL_PATH}/${fund_id}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { origin_fund, plans },
              message,
              success,
            } = response.data

            this.fund_origin_info = origin_fund
            this.funds_that_participate_in_other_investment_funds_list =
              plans.data

            this.funds_that_participate_in_other_investment_funds_pages = {
              currentPage: plans.current_page,
              lastPage: plans.last_page,
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

      async _getFundsThatParticipateInOtherInvestmentFundsMovementsList(
        payload: IFundsThatParticipateInOtherInvestmentMovementsPayload,
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(`${URL_PATH}/movements`, {
            params: {
              ...payload,
              ...params,
              paginate: 1,
            },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.funds_that_participate_in_other_investment_funds_movements_list =
              items

            this.funds_that_participate_in_other_investment_funds_movements_pages =
              {
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

      async _downloadExcelFundsThatParticipateInOtherInvestmentFundsMovements(
        payload: IFundsThatParticipateInOtherInvestmentMovementsPayload,
        params: Record<string, string | number>
      ) {
        await executeApi()
          .get(`${URL_PATH}/export`, {
            params: {
              ...payload,
              ...params,
              paginate: 1,
            },
            responseType: 'blob',
          })
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const name = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, name)
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },
    },
  }
)
