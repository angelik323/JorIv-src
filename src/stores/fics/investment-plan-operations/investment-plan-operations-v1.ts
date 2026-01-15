// Vue - pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import { IErrors } from '@/interfaces/global'
import { IPaginated } from '@/interfaces/customs'
import {
  IInvestmentPlanOperationCreatePayload,
  IInvestmentPlanOperationDetailPayload,
  IInvestmentPlanOperationItem,
  IInvestmentPlanOperationPayload,
  IInvestmentPlanOperationResponse,
  IMonetaryOperationDetail,
  IOperationValuesResponse,
  IStoredInvestmentPlanOperationResponse,
} from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_FICS}/operation-investment-plans`

export const useInvestmentPlanOperationStoreV1 = defineStore(
  'investment-plan-operation-store-v1',
  {
    state: () => ({
      defaultHeaderProps: {
        title: 'Registro operaciones para aportes/retiros a plan de inversión',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Fics',
          },
          {
            label: 'Registro de operaciones para Aportes/Retiros',
            route: 'InvestmentPlanOperationList',
          },
        ],
      },
      investment_plan_operations: {
        list: [],
        pages: { currentPage: 0, lastPage: 0 },
      } as IPaginated<IInvestmentPlanOperationItem>,
      operation_values: {
        cancellationControll: 0,
        available_value_without_taxes_cancellation: 0,
        available_value_without_taxes_withdrawal: 0,
        maximumInvestmentBalance: 0,
      } as IOperationValuesResponse,
      stored_investment_plan_operation:
        {} as IStoredInvestmentPlanOperationResponse,
      investment_plan_operation: {
        business_trust_code: '',
        business_trust_name: '',
        closing_date: '',
        compliance_date: '',
        fund_code: '',
        fund_name: '',
        holder_identification: '',
        holder_name: '',
        id: 0,
        investment_plan: '',
        maximum_value: 0,
        office: '',
        office_code: '',
        office_id: 0,
        operation_number: 0,
        operation_request: 0,
        operation_value: 0,
        operation_date: '',
        plan_balance: '',
        plan_business_trust_code: '',
        request_date: '',
        type: null,
        subtype: null,
        details: [],
      } as IInvestmentPlanOperationResponse,
      monetary_operations_list: [] as IMonetaryOperationDetail[],

      // Numero de operacion, se usa en movimientos
      operation_number: null as null | string | number,
    }),
    actions: {
      _cleanInvestmentPlanOperationData() {
        this.investment_plan_operations.list = []
        this.investment_plan_operations.pages.currentPage = 1
        this.investment_plan_operations.pages.lastPage = 1
      },
      async _getOperationValues(payload: {}) {
        let success = false
        await executeApi()
          .get(`${URL_PATH}/operation-values`, { params: payload })
          .then((response) => {
            success = response.data.success
            if (response.data.success) {
              this.operation_values = response.data.data
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
      async _getInvestmentPlanOperationList(params: {}) {
        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            if (response.data.success) {
              this.investment_plan_operations.list = response.data.data.data
              this.investment_plan_operations.pages.currentPage =
                response.data.data.current_page
              this.investment_plan_operations.pages.lastPage =
                response.data.data.last_page
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
      async _storeOperation(payload: IInvestmentPlanOperationPayload) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            success = response.data.success
            if (response.data.success) {
              this.stored_investment_plan_operation = response.data.data
            }

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            if (response.data.data.warning) {
              showAlert(
                response.data.data.warning,
                'warning',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      async _storeOperationDetail(
        payload: IInvestmentPlanOperationDetailPayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/details-operation`, payload)
          .then((response) => {
            success = response.data.success
            showAlert(
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
      async _storeCancellation(payload: IInvestmentPlanOperationPayload) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/cancellation`, payload)
          .then((response) => {
            success = response.data.success
            if (response.data.success) {
              this.stored_investment_plan_operation = response.data.data
            }

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
            if (response.data.data.warning) {
              showAlert(
                response.data.data.warning,
                'warning',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },
      async _storeCancellationDetail(
        payload: IInvestmentPlanOperationDetailPayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/cancellation-operation`, payload)
          .then((response) => {
            success = response.data.success
            showAlert(
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
      async _getInvestmentPlanOperation(investmentPlanOperationId: number) {
        await executeApi()
          .get(`${URL_PATH}/${investmentPlanOperationId}`)
          .then((response) => {
            if (response.data.success) {
              this.investment_plan_operation = response.data.data
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

      async _getInvestmentPlanOperationDetails(
        investmentPlanOperationId: number
      ) {
        await executeApi()
          .get(`${URL_PATH}/${investmentPlanOperationId}/details`)
          .then((response) => {
            if (response.data.success) {
              this.investment_plan_operation.details = response.data.data
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
      async _annulateOperation(investmentPlanOperationId: number) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/annul-operation/${investmentPlanOperationId}`)
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

      async _showAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}`)
          .then((response) => {
            if (response.data.success) return response.data.data

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _showDetailsAction(id: number) {
        return await executeApi()
          .get(`${URL_PATH}/${id}/details`)
          .then((response) => {
            const data = response.data

            if (response.data.success) this.monetary_operations_list = data.data

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _storePlanOperationWithDetails(
        payload: IInvestmentPlanOperationCreatePayload
      ) {
        return await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            const { message } = response.data
            const success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return true
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },
      resetOperationNumber() {
        this.operation_number = null
      },
    },
  }
)
