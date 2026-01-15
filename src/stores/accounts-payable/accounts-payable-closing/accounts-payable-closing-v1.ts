import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  URL_PATH_ACCOUNTS_PAYABLE,
  TRUST_BUSINESS_API_URL,
} from '@/constants/apis'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
import { IErrors } from '@/interfaces/global'

import {
  IAccountsPayableClosing,
  IAccountsPayableClosingCreatePayload,
  IAccountsPayableClosingBusiness,
  IAccountsPayableClosingBusinessFilters,
  IAccountsPayableClosingForm,
  IAccountsPayableClosingApiResponse,
  IAccountsPayableClosingExecuteItem,
  IAccountsPayableClosingReportItem,
} from '@/interfaces/customs/accounts-payable/AccountsPayableClosing'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_ACCOUNTS_PAYABLE}/closing-accounts-payable`

export const useAccountsPayableClosingStoreV1 = defineStore(
  'accounts-payable-closing-v1',
  {
    state: () => ({
      version: 'v1',
      closing_list: [] as IAccountsPayableClosing[],
      closing_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      business_list: [] as IAccountsPayableClosingBusiness[],
      closing_detail_list: [] as IAccountsPayableClosing[],
      confirmation_data: null as {
        form: IAccountsPayableClosingForm
        selectedBusinesses: IAccountsPayableClosingBusiness[]
      } | null,
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.closing_list = items.map(
              (item: IAccountsPayableClosing, index: number) => ({
                ...item,
                id: item.id || index + 1,
              })
            )
            this.closing_pages.currentPage = current_page
            this.closing_pages.lastPage = last_page

            return showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _createAction(payload: IAccountsPayableClosingCreatePayload[]) {
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

      async _executeAction(payload: IAccountsPayableClosingExecuteItem[]) {
        let result: IAccountsPayableClosingBusiness[] | null = null
        await executeApi()
          .post(`${URL_PATH}/execute`, payload)
          .then((response) => {
            const isArrayDirect = Array.isArray(response.data)
            const success = isArrayDirect ? true : response.data.success
            const data = isArrayDirect ? response.data : response.data.data
            const message = isArrayDirect
              ? 'Validación realizada exitosamente.'
              : response.data.message

            if (success) {
              result = (data ?? []).map(
                (item: Record<string, unknown>, index: number) => {
                  const status = item.status as
                    | { id: number; name: string }
                    | undefined
                  const statusId = status?.id || (item.status_id as number)
                  const statusName =
                    status?.name || (item.status_name as string)

                  const businessName =
                    (item.business_name as string) ||
                    (item.business_description as string) ||
                    ''

                  return {
                    ...item,
                    id:
                      (item.id as number) ||
                      (item.business_trust_id as number) ||
                      index + 1,
                    status_id: statusId,
                    status_name: statusName,
                    business_name: businessName,
                    code:
                      (item.code as string) ||
                      `${item.business_code} - ${businessName}`,
                  } as IAccountsPayableClosingBusiness
                }
              )
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return result
      },

      async _reportAction(payload: IAccountsPayableClosingReportItem[]) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/report`, payload)
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

      async _businessListAction(
        params: IAccountsPayableClosingBusinessFilters
      ) {
        this._resetBusinessList()

        const {
          business_trust_code_since,
          business_trust_code_until,
          business_trust_id,
          closing_mode,
        } = params

        const queryParams = new URLSearchParams()
        queryParams.append('keys[]', 'accounts_payables')
        queryParams.append(
          'filter[business_trust_from_code]',
          String(business_trust_code_since)
        )
        queryParams.append(
          'filter[business_trust_to_code]',
          String(business_trust_code_until)
        )
        queryParams.append('filter[status_id]', '57,59')
        queryParams.append('filter[closing]', closing_mode)

        if (business_trust_id) {
          queryParams.append(
            'filter[business_trust_id]',
            String(business_trust_id)
          )
        }

        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/utils/select-tables?${queryParams.toString()}`
          )
          .then((response) => {
            const { data = {}, message, success } = response.data
            const accountsPayables = data.accounts_payables || []

            this.business_list = (accountsPayables ?? []).map(
              (item: IAccountsPayableClosingApiResponse, index: number) => {
                const businessTrust = item.business_trust
                const businessCode =
                  businessTrust?.business_code ||
                  item.business_code?.toString() ||
                  ''
                const businessName =
                  businessTrust?.name || item.business_name || item.name || ''
                const businessTrustId =
                  businessTrust?.id || item.business_trust_id || 0

                return {
                  ...item,
                  id: item.id || businessTrustId || index + 1,
                  business_trust_id: businessTrustId,
                  business_code: Number(businessCode) || 0,
                  business_name: businessName,
                  code: `${businessCode} - ${businessName}`,
                  last_closure_date_business:
                    item.last_closing_date ||
                    item.last_closure_date_business ||
                    '',
                  closure_type: item.closing || item.closure_type || '',
                  period: item.validity?.toString() || item.period || '',
                  action_type: item.action_type || '',
                } as IAccountsPayableClosingBusiness
              }
            )

            if (message) {
              showAlert(
                message,
                success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearData() {
        this.closing_list = []
        this.closing_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },

      _resetBusinessList() {
        this.business_list = []
      },

      async _getDetailAction(
        business_trust_id: string | number,
        filters: Record<string, string | number> = {}
      ) {
        this._clearDetailData()

        await executeApi()
          .get(`${URL_PATH}/show-traceability`, {
            params: {
              ...filters,
              'filter[business_trust_id]': business_trust_id,
            },
          })
          .then((response) => {
            const { data = [], message, success } = response.data

            this.closing_detail_list = (data ?? []).map(
              (item: IAccountsPayableClosing, index: number) => ({
                ...item,
                id: item.id || index + 1,
              })
            )

            if (message) {
              return showAlert(
                message,
                success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _clearDetailData() {
        this.closing_detail_list = []
      },

      _setConfirmationData(
        form: IAccountsPayableClosingForm,
        selectedBusinesses: IAccountsPayableClosingBusiness[]
      ) {
        this.confirmation_data = {
          form: { ...form },
          selectedBusinesses: [...selectedBusinesses],
        }
      },

      _clearConfirmationData() {
        this.confirmation_data = null
      },

      async _downloadErrorReport(business_trust_id?: number | string) {
        try {
          const payload = business_trust_id
            ? { 'filter[business_trust_id]': business_trust_id }
            : {}

          const response = await executeApi().post(
            `${URL_PATH}/report/excel`,
            payload,
            {
              responseType: 'arraybuffer',
            }
          )

          return response.data
        } catch (error) {
          const errorData = error as IErrors
          showAlert(
            showCatchError(errorData),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
          return null
        }
      },
    },
  }
)
