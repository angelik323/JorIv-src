import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IDerivativeInvestmentOperationList,
  IDerivativeInvestmentOperationToCreate,
  IDerivativeInvestmentOperationView,
} from '@/interfaces/customs'
import { defineStore } from 'pinia'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useDerivativeInvestmentOperationStoreV1 = defineStore(
  'derivative-investment-operation-collection-store-v1',
  {
    state: () => ({
      derivative_investment_operation_list:
        [] as IDerivativeInvestmentOperationList[],
      derivative_investment_operation_to_create:
        null as IDerivativeInvestmentOperationToCreate | null,
      derivative_investment_operation_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_view: null as IDerivativeInvestmentOperationView | null,
    }),
    actions: {
      async _getDerivativeInvestmentOperationList(params: string) {
        this.derivative_investment_operation_list = []
        await executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/forward-operation?${params}`)
          .then((response) => {
            if (response.data.success) {
              this.derivative_investment_operation_list =
                response.data?.data ?? []
              this.derivative_investment_operation_pages.currentPage =
                response.data?.data?.current_page ?? 0
              this.derivative_investment_operation_pages.lastPage =
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

      async _createDerivativeInvestmentOperation(
        data: Partial<IDerivativeInvestmentOperationToCreate>
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_INVESTMENT_PORTFOLIO}/forward-operation`, data)
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

      async _getDerivativeInvestmentOperationById(id: number): Promise<void> {
        this.data_information_view = null
        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/forward-operation/${id}/settlement`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_information_view = response.data.data
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

      async _settlement(
        id: number,
        data: Partial<IDerivativeInvestmentOperationView>
      ) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/forward-operation/${id}/settled`,
            data
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

      async _clearData() {
        this.derivative_investment_operation_list = []
        this.derivative_investment_operation_to_create = null
        this.derivative_investment_operation_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.data_information_view = null
      },
    },
  }
)
