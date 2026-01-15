import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IGroundsBlockingInvestmentPlanItemList } from '@/interfaces/customs/fics/GroundsBlockingInvestmentPlan'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_FICS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const INITIAL_ID_VALUE = 0

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useGroundsBlockingInvestmentPlanListV1 = defineStore(
  'grounds-blocking-investment-plan-v1',
  {
    state: () => ({
      version: 'v1',
      rounds_blocking_investment_plan_list:
        [] as IGroundsBlockingInvestmentPlanItemList[],
      rounds_blocking_investment_plan_response:
        null as IGroundsBlockingInvestmentPlanItemList | null,
      rounds_blocking_investment_plan_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getGroundsBlockingInvestment(params: string) {
        this._clearData()
        await executeApi()
          .get(
            `${URL_PATH_FICS}/blocking-reason-investment/get-index?${params}`
          )
          .then((response) => {
            if (params === 'status=all') {
              this.rounds_blocking_investment_plan_list = response.data.data
              showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            } else {
              const {
                data: { data: items = [], current_page = 0, last_page = 0 },
                message,
                success,
              } = response.data

              this.rounds_blocking_investment_plan_list = items.map(
                (item: IGroundsBlockingInvestmentPlanItemList) => ({
                  ...item,
                })
              )
              this.rounds_blocking_investment_plan_pages.currentPage =
                current_page
              this.rounds_blocking_investment_plan_pages.lastPage = last_page
              showAlert(
                message,
                success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getByIdGroundsBlockingInvestment(id: number) {
        await executeApi()
          .get(`${URL_PATH_FICS}/blocking-reason-investment/get-by-id/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              this.rounds_blocking_investment_plan_response = {
                ...responseData,
              }
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

      async _createGroundsBlockingInvestment(
        data: Partial<IGroundsBlockingInvestmentPlanItemList>
      ) {
        let success = false
        let id = INITIAL_ID_VALUE

        await executeApi()
          .post(`${URL_PATH_FICS}/blocking-reason-investment`, data)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false
            id = response.data?.data?.id ?? INITIAL_ID_VALUE

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

        return id
      },

      async _updateGroundsBlockingInvestment(
        data: Partial<IGroundsBlockingInvestmentPlanItemList>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(`${URL_PATH_FICS}/blocking-reason-investment/${id}`, data)
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
      _setDataInformationForm(
        data_to_set: IGroundsBlockingInvestmentPlanItemList | null
      ) {
        this.rounds_blocking_investment_plan_response = data_to_set
          ? { ...data_to_set }
          : null
      },
      async _updateStatus(id: number) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_FICS}/blocking-reason-investment/switch-status/${id}`
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
        this.rounds_blocking_investment_plan_list = []
        this.rounds_blocking_investment_plan_response = null
        this.rounds_blocking_investment_plan_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
    },
  }
)
