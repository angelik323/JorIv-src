import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import {
  IFiduciaryBusinessCommissionsFormV2,
  IFiduciaryBusinessCommissionsListV2,
  IFiduciaryBusinessCommissionsResponseV2,
} from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'
import { IPaginated } from '@/interfaces/customs'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SETTLEMENT_COMMISSIONS } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useFiduciaryBusinessCommissionsV2 = defineStore(
  'fiduciary-business-commissions-store-v2',
  {
    state: () => ({
      version: 'v2',
    }),

    actions: {
      async _getFiduciaryBusinessCommissionsList(
        params: Record<string, string | number>
      ) {
        let responseList: IPaginated<IFiduciaryBusinessCommissionsListV2> | null =
        {
          list: [],
          pages: { currentPage: 0, lastPage: 0 },
        }

        await executeApi()
          .get(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/business-trust-commissions`,
            {
              params: { ...params, paginate: 1 },
            }
          )
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

      async _getByIdFiduciaryBusinessCommissions(id: number) {
        let dataResponse: IFiduciaryBusinessCommissionsResponseV2 | null = null
        await executeApi()
          .get(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/v2/business-trust-commissions/${id}`
          )
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

      async _createFiduciaryBusinessCommissions(
        data: Partial<IFiduciaryBusinessCommissionsFormV2>
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions`,
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

      async _updateRFiduciaryBusinessCommissions(
        data: Partial<IFiduciaryBusinessCommissionsFormV2>,
        id: number
      ) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_SETTLEMENT_COMMISSIONS}/business-trust-commissions/${id}`,
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
    },
  }
)
