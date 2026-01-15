// Core
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Composables
import { useAlert, useShowError } from '@/composables'

// Interfaces
import {
  IAccountingClosingParameterItem,
  IAccountingDailyClosingParameterModel,
  IPeriodClosureParameterModelV2,
} from '@/interfaces/customs/accounting/PeriodClosureParameter'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'

const URL_PATH = `${URL_PATH_ACCOUNTING}/v2/accounting-closing-parameters`

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePeriodClosureParametersV2 = defineStore(
  'period-closure-parameter-v2',
  {
    state: () => ({
      version: 'v1',
      period_closure_parameter_list: [] as IAccountingClosingParameterItem[],
      period_closure_parameter_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _cleanPeriodClosureParametersData() {
        this.period_closure_parameter_list = []
        this.period_closure_parameter_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },
      async _getPeriodClosureParameterList(params: {}) {
        this._cleanPeriodClosureParametersData()
        await executeApi()
          .get(URL_PATH, { params: { ...params, paginate: 1 } })
          .then((response) => {
            if (response.data.success) {
              this.period_closure_parameter_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.period_closure_parameter_pages.lastPage =
                response.data?.data?.last_page ?? 0
              this.period_closure_parameter_list =
                response.data?.data?.data ?? []
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
      async _createPeriodClosureParameter(
        payload: IPeriodClosureParameterModelV2
      ) {
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

      async _updatePeriodClosureParameter(
        id: number,
        payload: IPeriodClosureParameterModelV2
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

      async _getPeriodClosureParameter(id: number) {
        let paramData = null
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) {
              paramData = {
                structure: response.data.data.structure,
                parameters: {
                  daily_parameters: (
                    Object.values(
                      response.data.data.parameters.daily_parameters
                    ) as IAccountingDailyClosingParameterModel[]
                  ).map((parameter: IAccountingDailyClosingParameterModel) => {
                    return {
                      ...parameter,
                      accounts_chart_id: parameter.account?.id,
                      third_party_id: parameter.third_party?.id || null,
                      counterpart_accounts_chart_id:
                        parameter.counterpart_account?.id,
                      counterpart_third_party_id:
                        parameter.counterpart_third_party?.id || null,
                      sub_receipt_type_id: parameter.sub_receipt_type?.id,
                    }
                  }),
                  monthly_parameters: (
                    Object.values(
                      response.data.data.parameters.monthly_parameters
                    ) as IAccountingDailyClosingParameterModel[]
                  ).map((parameter: IAccountingDailyClosingParameterModel) => {
                    return {
                      ...parameter,
                      accounts_chart_id: parameter.account?.id,
                      third_party_id: parameter.third_party?.id || null,
                      counterpart_accounts_chart_id:
                        parameter.counterpart_account?.id,
                      counterpart_third_party_id:
                        parameter.counterpart_third_party?.id || null,
                      sub_receipt_type_id: parameter.sub_receipt_type?.id,
                    }
                  }),
                  yearly_parameters: (
                    Object.values(
                      response.data.data.parameters.yearly_parameters
                    ) as IAccountingDailyClosingParameterModel[]
                  ).map((parameter: IAccountingDailyClosingParameterModel) => {
                    return {
                      ...parameter,
                      accounts_chart_id: parameter.account?.id,
                      third_party_id: parameter.third_party?.id || null,
                      sub_receipt_type_id: parameter.sub_receipt_type?.id,
                    }
                  }),
                },
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
        return paramData
      },
    },
  }
)
