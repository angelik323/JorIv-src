import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import {
  IAccountingClosingParameterItem,
  IAccountingClosingParameterModel,
  IPeriodClosureParameter,
  IPeriodClosureParameterModel,
} from '@/interfaces/customs'

const URL_PATH = 'accounting/api/accounting/accounting-closing-parameters'
const TIMEOUT_ALERT = 3000

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const usePeriodClosureParametersV1 = defineStore(
  'period-closure-parameter-v1',
  {
    state: () => ({
      version: 'v1',
      period_closure_parameter_list: [] as IAccountingClosingParameterItem[],
      period_closure_parameter_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      period_closure_parameter: {
        structure: {
          id: 0,
          code: '',
          name: '',
          purpose: '',
        },
        parameters: [
          {
            structure_id: 0,
            event: 'Utilidad',
            nature: '',
            chart_id: 0,
            third_party_id: 0,
            cost_center_id: 0,
            counterpart_nature: '',
            counterpart_chart_id: 0,
            counterpart_third_party_id: 0,
            counterpart_cost_center_id: 0,
          },
          {
            structure_id: 0,
            event: 'Pérdida',
            nature: '',
            chart_id: 0,
            third_party_id: 0,
            cost_center_id: 0,
            counterpart_nature: '',
            counterpart_chart_id: 0,
            counterpart_third_party_id: 0,
            counterpart_cost_center_id: 0,
          },
        ],
      } as IPeriodClosureParameter,
    }),
    actions: {
      async _getPeriodClosureParameterList(params: string) {
        this._cleanPeriodClosureParametersData()
        await executeApi()
          .get(`${URL_PATH}?paginate=1${params}`)
          .then((response) => {
            if (response.data.success) {
              this.period_closure_parameter_list =
                response.data?.data?.data ?? []
              this.period_closure_parameter_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.period_closure_parameter_pages.lastPage =
                response.data?.data?.last_page ?? 0
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

      async _cleanPeriodClosureParametersData() {
        this.period_closure_parameter_list = []
        this.period_closure_parameter_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.period_closure_parameter = {
          structure: {
            id: 0,
            code: '',
            structure: '',
            purpose: '',
          },
          parameters: [
            {
              structure_id: 0,
              event: 'Utilidad',
              nature: '',
              chart_id: 0,
              third_party_id: 0,
              cost_center_id: 0,
              counterpart_nature: '',
              counterpart_chart_id: 0,
              counterpart_third_party_id: 0,
              counterpart_cost_center_id: 0,
            },
            {
              structure_id: 0,
              event: 'Pérdida',
              nature: '',
              chart_id: 0,
              third_party_id: 0,
              cost_center_id: 0,
              counterpart_nature: '',
              counterpart_chart_id: 0,
              counterpart_third_party_id: 0,
              counterpart_cost_center_id: 0,
            },
          ],
        }
      },

      async _createPeriodClosureParameter(payload: IPeriodClosureParameter) {
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
        payload: IPeriodClosureParameterModel
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
        let success = false
        await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            success = response.data.success
            if (success) {
              this.period_closure_parameter.structure =
                response.data.data.structure
              this.period_closure_parameter.parameters =
                response.data.data.parameters.map(
                  (parameter: IAccountingClosingParameterModel) => {
                    return {
                      ...parameter,
                      chart_id: parameter.chart?.id,
                      third_party_id: parameter.third_party?.id,
                      cost_center_id: parameter.cost_center?.id,
                      counterpart_nature: parameter.counterpart_nature,
                      counterpart_chart_id: parameter.counterpart_chart?.id,
                      counterpart_third_party_id:
                        parameter.counterpart_third_party?.id,
                      counterpart_cost_center_id:
                        parameter.counterpart_cost_center?.id,
                    }
                  }
                )
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
    },
  }
)
