import {
  IAccountingRestatementPayload,
  IAccountRestatementPending,
  IOperatingAccountList,
} from '@/interfaces/customs'
import { defineStore } from 'pinia'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import { executeApi } from '@/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { useAlert, useShowError } from '@/composables'

const URL_PATH = `${URL_PATH_ACCOUNTING}/account-reexpression`
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  operating_accounts: [] as IOperatingAccountList[],
  accounting_restatement_list: [] as IOperatingAccountList[],
  accounting_restatement_pages: {
    currentPage: 0,
    lastPage: 0,
  },
  accounting_validate_statement: {
    terms: false,
    execute: true,
    processInformation: true,
  },
  prePayload_data: {} as IAccountingRestatementPayload,
  flagChargeInformation: false as boolean,
  accounting_restatement_pending: [] as IAccountRestatementPending[],
})

const showAlertMessage = (
  message: string,
  type: 'success' | 'error',
  timeout: number = TIMEOUT_ALERT
) => {
  showAlert(message, type, undefined, timeout)
}

export const useAccountingRestatementV1 = defineStore(
  'accounting-restatement-v1',
  {
    state: initialState,

    actions: {
      async _getOperatingAccounts(
        structure_id: number,
        receipt_type_id?: number,
        sub_receipt_type_id?: number
      ) {
        const params = new URLSearchParams({
          'filter[structure_id]': structure_id.toString(),
        })
        if (receipt_type_id !== undefined && receipt_type_id !== null) {
          params.append('filter[receipt_type_id]', receipt_type_id.toString())
        }
        if (sub_receipt_type_id !== undefined && sub_receipt_type_id !== null) {
          params.append(
            'filter[sub_receipt_type_id]',
            sub_receipt_type_id.toString()
          )
        }
        await executeApi()
          .get(`${URL_PATH}/operative-accounts?${params.toString()}`)
          .then((response) => {
            if (response.data.success) {
              this.operating_accounts = response.data.data ?? []
              this.flagChargeInformation = false
            } else {
              this.operating_accounts = []
              this.flagChargeInformation = true
            }
            showAlertMessage(
              response.data.message,
              response.data.success ? 'success' : 'error'
            )
          })
          .catch((error) => {
            showAlertMessage(showCatchError(error), 'error')
          })
      },
      async _getAccountingInformationTable(params: string = '') {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/account-reexpression/list?paginate=1${params}`
          )
          .then((response) => {
            this.accounting_restatement_list = response.data?.data?.data ?? []
          })
          .catch((error) => {
            showAlertMessage(showCatchError(error), 'error')
          })
      },
      async executeValidateRestatement(payload: IAccountingRestatementPayload) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/validate`, payload)
          .then((response) => {
            if (response.data.success) {
              success = response.data.success
              this._setStatementValidate(response.data.data)
              showAlertMessage(response.data.message, 'success')
            }
            this.accounting_restatement_pending = response.data.data
            showAlertMessage(response.data.message, 'success')
          })
          .catch((error) => {
            if (
              error.response &&
              error.response.data &&
              error.response.data.data
            ) {
              this.accounting_restatement_pending = error.response.data.data
              const message = error.response.data.message
              showAlertMessage(message, 'error', 10000)
            }
          })
        return success
      },

      async _createRestatement(payload: IAccountingRestatementPayload[]) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            if (response.data.success) {
              success = response.data.success
              showAlertMessage(response.data.message, 'success')
            }
          })
          .catch((error) => {
            showAlertMessage(showCatchError(error), 'error')
          })
        return success
      },

      _setStatementValidate({
        terms,
        execute,
        processInformation,
      }: {
        terms: boolean
        execute: boolean
        processInformation: boolean
      }) {
        this.accounting_validate_statement = {
          terms,
          execute,
          processInformation,
        }
      },
      _setPrePayload(payload: IAccountingRestatementPayload) {
        this.prePayload_data = payload
      },
    },
  }
)
