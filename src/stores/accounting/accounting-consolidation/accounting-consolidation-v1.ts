import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'
import { URL_PATH_ACCOUNTING } from '@/constants/apis'
import {
  IAccountingConsolidation,
  IAccountingConsolidationDetail,
} from '@/interfaces/customs'

const TIMEOUT_ALERT = 3000
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useAccountingConsolidation = defineStore(
  'accounting-consolidation-v1',
  {
    state: () => ({
      data_accounting_consolidation_list: [] as IAccountingConsolidation[],
      data_accounting_business: [] as IAccountingConsolidation[],
      data_accounting_consolidation_form_create:
        [] as IAccountingConsolidation[],
      data_search_id: null as Number | String | null,
      accounting_consolidation_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_accounting_consolidation_view: {} as IAccountingConsolidationDetail,
    }),
    actions: {
      async _getAccountingConsolidationList(params?: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/consolidation-accounting/list?paginate=1${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_accounting_consolidation_list =
                response.data?.data.data ?? []
              this.accounting_consolidation_pages.currentPage =
                response.data?.data.current_page ?? 0
              this.accounting_consolidation_pages.lastPage =
                response.data?.data.last_page ?? 0
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
      async _getBussinesAccounting(params?: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/consolidation-accounting/get-business?${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_accounting_business = response.data?.data ?? []
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
      async _getAccountingBussinessById(params: string) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/consolidation-accounting/get-business?filter[search]=${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_accounting_consolidation_form_create =
                response.data?.data ?? []
              this.data_accounting_consolidation_view =
                response.data?.data?.[0] ?? {}
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
      async _createAccountingConsolidation(payload: {
        business_trust_id: String | Number | null
      }) {
        let success = false
        await executeApi()
          .post(
            `${URL_PATH_ACCOUNTING}/consolidation-accounting/execute`,
            payload
          )
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
      async _getAccountingConsolidationDetails(params: string | number) {
        await executeApi()
          .get(
            `${URL_PATH_ACCOUNTING}/consolidation-accounting/details/${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.data_accounting_consolidation_view = response.data?.data[0]
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
      _setDataSearch(id: number | string) {
        this.data_search_id = id
      },

      _setAccountingBussinessRequest(
        data: IAccountingConsolidationDetail | null
      ) {
        this.data_accounting_consolidation_view = data
          ? { ...data }
          : ({} as IAccountingConsolidationDetail)
      },
    },
  }
)
