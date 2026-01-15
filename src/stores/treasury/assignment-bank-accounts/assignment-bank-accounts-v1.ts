// Pinia - Axios
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IAssignmentBankAccountsItem,
  IMovementCode,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

export const useAssignmentBankAccountsStoreV1 = defineStore(
  'assignment-bank-accounts-store-v1',
  {
    state: () => ({
      assignment_bank_accounts: {
        currentPage: 0,
        lastPage: 0,
      },
      assignment_bank_accounts_list: [] as IAssignmentBankAccountsItem[],
      assignment_bank_accounts_movement_codes_list: [] as IMovementCode[],
    }),

    actions: {
      async _getAssignmentBankAccountsList(
        businessTrustId: string,
        grantorDate: string,
        params: string
      ) {
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/bank-account-grantor-requests/get-bank-account/${businessTrustId}/${grantorDate}?paginate=1${params}`
          )
          .then((response) => {
            const data = response.data?.data?.data
            this.assignment_bank_accounts_list = Array.isArray(data) ? data : []
            this.assignment_bank_accounts.currentPage =
              response.data?.data?.current_page ?? 1
            this.assignment_bank_accounts.lastPage =
              response.data?.data?.last_page ?? 1
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            this.assignment_bank_accounts_list = []
          })
      },

      _clearAssignmentBankAccountsList() {
        this.assignment_bank_accounts_list = []
        this.assignment_bank_accounts.currentPage = 0
        this.assignment_bank_accounts.lastPage = 0
      },

      async _getMovementCodeList(params: string) {
        this.assignment_bank_accounts_movement_codes_list = []
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/treasury-movement-codes?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.assignment_bank_accounts_movement_codes_list =
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

      async _createAssignmentBankAccountsList(
        payload: object
      ): Promise<boolean> {
        let success = false
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH_TREASURIES}/bank-account-grantor-requests`, payload)
          .then((response) => {
            success = response.data.success
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
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
