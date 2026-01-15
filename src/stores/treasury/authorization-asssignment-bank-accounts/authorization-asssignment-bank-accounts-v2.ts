// Pinia - Axios
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IAuthorizationAssignmentBankAccountsFormModel,
  IAuthorizationAssignmentBankAccountsItem,
  IAuthorizationAssignmentBankAccountsPayload,
  IAuthorizationAssignmentBankAccountsApiResponseItem,
  IAuthorizationAssignmentBankAccountsRejectPayload,
  IAuthorizationAssignmentBankAccountsRejectArrayPayload,
} from '@/interfaces/customs/treasury/authorizationAssignmentBankAccounts'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError, useUtils } from '@/composables'

// Constants
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAuthorizationAssignmentBankAccountsStoreV2 = defineStore(
  'authorization-assignment-bank-accounts-store-v2',
  {
    state: () => ({
      authorization_assignment_bank_accounts: {
        currentPage: 0,
        lastPage: 0,
      },
      authorization_assignment_bank_accounts_list:
        [] as IAuthorizationAssignmentBankAccountsItem[],
      authorization_assignment_bank_accounts_list_description:
        [] as IAuthorizationAssignmentBankAccountsFormModel[],
      request_bank_id: null as number | null,
      status_id: null as number | null,
      data_selection: [] as IAuthorizationAssignmentBankAccountsItem[],
      error: {
        recordId: [] as number[],
        recordType: '' as string,
        hasErrors: false as boolean,
      },
    }),

    actions: {
      async _getAuthorizationAssignmentBankAccountsList(params: string) {
        this._clearData()
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/bank-account-grantor-requests?${params}`)
          .then((response) => {
            const dataArray = response.data?.data ?? []

            if (dataArray.length > 0) {
              this.status_id = response.data?.data[0]?.status_id ?? null
              this.authorization_assignment_bank_accounts_list =
                dataArray.reduce(
                  (
                    allBankAccounts: IAuthorizationAssignmentBankAccountsItem[],
                    item: IAuthorizationAssignmentBankAccountsApiResponseItem
                  ) => {
                    const bankAccountsWithStatus = (
                      item.bank_accounts ?? []
                    ).map(
                      (
                        bankAccount: Omit<
                          IAuthorizationAssignmentBankAccountsItem,
                          'state' | 'parent_id'
                        >
                      ) => ({
                        ...bankAccount,
                        state: item.status_id,
                        parent_id: item.id,
                      })
                    )
                    return allBankAccounts.concat(bankAccountsWithStatus)
                  },
                  []
                )

              this.authorization_assignment_bank_accounts_list_description =
                dataArray.reduce(
                  (
                    allDescriptions: IAuthorizationAssignmentBankAccountsFormModel[],
                    item: IAuthorizationAssignmentBankAccountsApiResponseItem
                  ) => {
                    return allDescriptions.concat(
                      item.description ? [item.description] : []
                    )
                  },
                  []
                )

              this.request_bank_id = dataArray[0]?.id ?? null
            }

            this.authorization_assignment_bank_accounts.currentPage =
              response.data?.current_page ?? 1
            this.authorization_assignment_bank_accounts.lastPage =
              response.data?.last_page ?? 1

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
      },

      async _authorizationAssignmentBankAccountsList(
        payload:
          | IAuthorizationAssignmentBankAccountsPayload
          | {
              approvals: Array<{
                bank_account_grantor_request_id: number
                requests: number[]
              }>
            }
      ): Promise<boolean> {
        let success = false
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/bank-account-assignment-approvals/approve`,
            payload
          )
          .then((response) => {
            success = response.data.success
            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            if (!success) {
              this.error = {
                recordId:
                  'requests' in payload
                    ? payload.requests || []
                    : payload.approvals?.flatMap((a) => a.requests) || [],
                recordType: 'authorization-assignment',
                hasErrors: true,
              }
            } else {
              this.error = {
                recordId: [],
                recordType: '',
                hasErrors: false,
              }
            }
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _rejectAuthorizationAssignmentBankAccountsList(
        payload:
          | IAuthorizationAssignmentBankAccountsRejectPayload
          | IAuthorizationAssignmentBankAccountsRejectArrayPayload
          | Array<{
              bank_account_grantor_request_id: number
              rejections: Array<{ bank_account_id: number; reason: string }>
            }>
      ): Promise<boolean> {
        let success = false
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/bank-account-assignment-approvals/reject`,
            payload
          )
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

      async _errorAuthorizationAssignmentBankAccountsList(
        parentIds: number[]
      ): Promise<boolean> {
        let success = false
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/bank-account-assignment-approvals/error-logs`,
            {
              bank_account_grantor_request_id: parentIds,
            },
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type:
                response.headers['content-type'] || 'text/plain;charset=utf-8',
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)

            success = true
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      _setDataSelection(
        data_to_set: IAuthorizationAssignmentBankAccountsItem[] | null
      ) {
        this.data_selection = data_to_set ? [...data_to_set] : []
      },

      _hasErrors(): boolean {
        return this.error.hasErrors
      },

      _clearData() {
        this.authorization_assignment_bank_accounts_list = []
        this.authorization_assignment_bank_accounts_list_description = []
        this.request_bank_id = null
        this.status_id = null
        this.data_selection = []
        this.authorization_assignment_bank_accounts = {
          currentPage: 0,
          lastPage: 0,
        }
        this.error = {
          recordId: [],
          recordType: '',
          hasErrors: false,
        }
      },
    },
  }
)
