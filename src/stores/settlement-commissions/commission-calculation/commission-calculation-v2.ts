import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IFiduciaryBusinessCommissionsFormV2 } from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'
import {
  ICommissionCalculationListV2,
  ICommissionCalculationResponseV2,
} from '@/interfaces/customs/settlement-commissions/CommissionCalculationV2'
import { IErrors } from '@/interfaces/global'
import { IPaginated } from '@/interfaces/customs'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const PATH_COMISSIONS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/commission-calculations`
const PATH_FIDUCIARY_BUSINESS_COMMISSIONS = `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/business-trust-commissions`

export const useCommissionCalculationV2 = defineStore(
  'commission-calculation-store-v2',
  {
    state: () => ({
      version: 'v2',
    }),

    actions: {
      async _getCommissionCalculationList(
        params: Record<string, string | number>
      ) {
        let responseList: IPaginated<ICommissionCalculationListV2> | null = {
          list: [],
          pages: { currentPage: 0, lastPage: 0 },
        }

        await executeApi()
          .get(`${PATH_COMISSIONS}`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            responseList = {
              list: items,
              pages: { currentPage: current_page, lastPage: last_page },
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
        return responseList
      },

      async _getByIdCommissionCalculation(id: number) {
        let dataResponse: ICommissionCalculationResponseV2 | null = null
        await executeApi()
          .get(`${PATH_FIDUCIARY_BUSINESS_COMMISSIONS}/${id}`)
          .then((response) => {
            const { data: responseData, message, success } = response.data

            if (success && responseData) {
              dataResponse = { ...responseData }
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

        return dataResponse
      },

      async _createCommisionCalculation(
        data: Partial<IFiduciaryBusinessCommissionsFormV2>
      ) {
        let success = false

        await executeApi()
          .post(`${PATH_COMISSIONS}`, data)
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

      async _updateCommissionCalculation(
        data: Partial<IFiduciaryBusinessCommissionsFormV2>
      ) {
        let success = false

        await executeApi()
          .put(`${PATH_COMISSIONS}`, data)
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
    },
  }
)
