// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import { IErrors } from '@/interfaces/global'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useFirstAuthorizationTaxSettlementStoreV1 = defineStore(
  'first-authorization-tax-settlement-store-v1',
  {
    state: () => ({}),

    actions: {
      async _getFirstAuthorizationTaxSettlementList(
        params: Record<string, string | number>
      ) {
        const responseData = {
          pages: {
            currentPage: 1,
            lastPage: 1,
          },
          data: [],
        }

        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTS_PAYABLE}/first-authorization-tax-settlement-generation`,
            { params }
          )
          .then((response) => {
            const {
              data: items = [],
              current_page = 1,
              last_page = 1,
              message,
              success,
            } = response.data

            responseData.data = items
            responseData.pages = {
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

        return responseData
      },

      async _getFirstAuthorizationTaxSettlementShow(id: number) {
        const responseData = {
          data: null as Record<string, unknown> | null,
        }

        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTS_PAYABLE}/first-authorization-tax-settlement-generation/${id}`
          )
          .then((response) => {
            const { data, message, success } = response.data

            responseData.data = data || null

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

        return responseData
      },

      async _authorizeOrRejectFirstAuthorization(
        payload: Record<string, unknown>
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTS_PAYABLE}/first-authorization-tax-settlement-generation`,
            payload
          )
          .then((response) => {
            const { message, success: responseSuccess } = response.data
            success = responseSuccess

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