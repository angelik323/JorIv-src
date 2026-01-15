// Vue - Pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import {
  IWithdrawalOperationDetailModel,
  IInvestmentPlanOperationResponse,
  IContributionOperationDetailModel,
} from '@/interfaces/customs/fics/InvestmentPlanOperations'
import {
  IModalAccountInfo,
  ISelectedRowAccountInfo,
  IInvestmentPlanOperationResponseDetailItem,
  IToggleAuthorizationInvestmentPlanOperationPayload,
} from '@/interfaces/customs/fics/InvestmentPlanOperationCompliance'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS, URL_PATH_TREASURIES } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_FICS}/operation-investment-plans`

export const useInvestmentPlanOperationComplianceStoreV1 = defineStore(
  'investment-plan-operation-compliance-store-v1',
  {
    state: () => ({
      investment_plan_operation_response:
        {} as IInvestmentPlanOperationResponse,
      investment_plan_operation_details_response:
        [] as IInvestmentPlanOperationResponseDetailItem[],
      selected_fund: null as IContributionOperationDetailModel | null,
      selected_fund_withdrawal: null as IWithdrawalOperationDetailModel | null,
      modal_account_info: null as IModalAccountInfo | null,
      selected_row_account_info: null as ISelectedRowAccountInfo | null,
    }),
    actions: {
      async _getInvesmentPlanOperation(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.investment_plan_operation_response = response.data.data
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

      async _getInvesmentPlanOperationDetail(id: number) {
        await executeApi()
          .get(`${URL_PATH}/${id}/details`)
          .then((response) => {
            if (response.data.success) {
              this.investment_plan_operation_details_response =
                response.data.data
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getModalAccountInfo(account_id: number) {
        this.modal_account_info = null
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/v2/bank-accounts/${account_id}`)
          .then((response) => {
            if (response.data.success) {
              this.modal_account_info = response.data.data.data_basic
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return null
      },

      async _getSelectedRowAccountInfo(account_id: number) {
        this.selected_row_account_info = null
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/v2/bank-accounts/${account_id}`)
          .then((response) => {
            if (response.data.success && response.data.data) {
              const data = response.data.data.data_basic
              if (data) {
                this.selected_row_account_info = {
                  account_type: data.account_type,
                  initial_balance: 0,
                }
              }
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return null
      },

      async _toggleAuthorization(
        payload: IToggleAuthorizationInvestmentPlanOperationPayload,
        id: number
      ) {
        return await executeApi()
          .put(`${URL_PATH}/toggle-auth/${id}`, {
            ...payload,
          })
          .then((response) => {
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return response.data.success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },

      async _toggleApproveCancellation(
        payload: IToggleAuthorizationInvestmentPlanOperationPayload
      ) {
        return await executeApi()
          .post(`${URL_PATH}/approve-cancellation/`, {
            ...payload,
          })
          .then((response) => {
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return response.data.success
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },

      _setSelectedFund(
        selected_fund: IContributionOperationDetailModel | null
      ) {
        this.selected_fund = selected_fund
      },

      _setSelectedFundWithdrawal(
        selected_fund: IWithdrawalOperationDetailModel | null
      ) {
        this.selected_fund_withdrawal = selected_fund
      },
    },
  }
)
