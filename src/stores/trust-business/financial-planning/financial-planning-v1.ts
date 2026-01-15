// apis
import { executeApi } from '@/apis'

// pinia
import { defineStore } from 'pinia'

// composables
import { useShowError, useAlert, useUtils } from '@/composables'

// interfaces
import { IErrors } from '@/interfaces/global'

import { URL_PATH_FINANCIAL_OBLIGATION } from '@/constants/apis'
import {
  IFinancialInfoById,
  IFinancialPlanForm,
  IFinancialPlanning,
} from '@/interfaces/customs/financial-obligations/AmortizationTables'

const { showCatchError } = useShowError()

const { showAlert } = useAlert()
const { formatCurrencyString } = useUtils()

export const useFinancialPlanningStoreV1 = defineStore(
  'financial-planning-v1',
  {
    state: () => ({
      createAmortizationInfo: null as IFinancialPlanning | null,
      paymentPlanList: [] as IFinancialPlanForm[],
      urlFinancialPlanListXLS: null as string | null,

      paymentPlanPages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _resetFinancialPlanning() {
        this.paymentPlanList = []
        this.paymentPlanPages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
      async _loadFinancialPlanningById(planningId: number) {
        this.createAmortizationInfo = null
        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/payment-plan/get-data-next-quota?financial_obligation_id=${planningId}`
          )
          .then((response) => {
            if (response.status) {
              const financialFormUpdate: IFinancialInfoById = response.data.data
              this.createAmortizationInfo = {
                financialObligationId:
                  financialFormUpdate.financial_obligation_id,
                numberQuota: financialFormUpdate.number_quota,
                initialBalance: financialFormUpdate.initial_balance,
                interestQuota: financialFormUpdate.interest_quota,
                capitalQuota: financialFormUpdate.capital_quota,
                totalQuota: financialFormUpdate.total_quota,
                finalBalance: financialFormUpdate.final_balance,
                paymentDate: financialFormUpdate.payment_date,
                statusQuotaId: financialFormUpdate.status_quota_id ?? 1,
              }
            }
          })

          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
          })
      },

      async _loadFinancialPlanningList(urlId: string) {
        this.paymentPlanList = []
        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/payment-plan/get-quotas-by-obligation?paginate=true&${urlId}`
          )
          .then((response) => {
            const responselist: IFinancialInfoById[] = response.data.data.data

            this.paymentPlanList = responselist
              ? responselist.map((item) => ({
                  financialObligationId: item.financial_obligation_id,
                  numberQuota: item.number_quota,
                  initialBalance: formatCurrencyString(item.initial_balance),
                  interestQuota: formatCurrencyString(item.interest_quota),
                  capitalQuota: formatCurrencyString(item.capital_quota),
                  totalQuota: formatCurrencyString(item.total_quota),
                  finalBalance: formatCurrencyString(item.final_balance),
                  paymentDate: item.payment_date,
                  statusQuotaId: item.status_quota_id ?? 1,
                  statusQuota: item.status_quota,
                }))
              : []

            const urlXLS = response.data.data.route_export

            const currentPage = response.data.data.current_page
            const lastPage = response.data.data.last_page

            this.urlFinancialPlanListXLS = urlXLS

            this.paymentPlanPages = {
              currentPage,
              lastPage,
            }
          })
          .catch((e) => {
            const error = e as IErrors
            this.paymentPlanList = []
            showAlert(showCatchError(error), 'error')
          })
      },

      async _updateAddFinancialPlaningById(infoForm: IFinancialPlanning) {
        const dataSet = {
          financial_obligation_id: infoForm.financialObligationId,
          number_quota: infoForm.numberQuota,
          initial_balance: infoForm.initialBalance,
          interest_quota: infoForm.interestQuota,
          capital_quota: infoForm.capitalQuota,
          total_quota: infoForm.totalQuota,
          final_balance: infoForm.finalBalance,
          payment_date: infoForm.paymentDate,
          status_quota_id: infoForm.statusQuotaId,
        }

        return await executeApi()
          .post(
            `${URL_PATH_FINANCIAL_OBLIGATION}/payment-plan/store-quota`,
            dataSet
          )
          .then((response) => {
            showAlert(response.data.message, 'success')

            return !!response.data.success
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
            return false
          })
      },

      async _updateFinancialPlaningById(infoForm: IFinancialPlanning) {
        const dataSet = {
          financial_obligation_id: infoForm.financialObligationId,
          number_quota: infoForm.numberQuota,
          initial_balance: infoForm.initialBalance,
          interest_quota: infoForm.interestQuota,
          capital_quota: infoForm.capitalQuota,
          total_quota: infoForm.totalQuota,
          final_balance: infoForm.finalBalance,
          payment_date: infoForm.paymentDate,
          status_quota_id: infoForm.statusQuotaId,
        }

        await executeApi()
          .put(
            `${URL_PATH_FINANCIAL_OBLIGATION}/payment-plan/update-quota`,
            dataSet
          )
          .then((response) => {
            showAlert(response.data.message, 'success')

            return !!response.data.success
          })

          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
            return false
          })
      },

      async _createObligationStatus(newStatus: string) {
        await executeApi()
          .post(
            `${URL_PATH_FINANCIAL_OBLIGATION}/obligation-statuses/store-obligation-status`,
            {
              name: newStatus,
            }
          )
          .then((res) => {
            const message = res.data.message
            showAlert(message, 'success')
          })
          .catch((e) => {
            const error = e as IErrors
            this.paymentPlanList = []
            showAlert(showCatchError(error), 'error')
          })
      },

      async _exportFinancialPlanListXLS(gotUrl: string) {
        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/payment-plan/export?${gotUrl}`,
            {
              responseType: 'blob',
            }
          )
          .then((response) => {
            const blob = new Blob([response.data], {
              type: response.headers['content-type'],
            })

            const fileName = useUtils().getNameBlob(response)
            useUtils().downloadBlobXlxx(blob, fileName)
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error')
          })
      },
    },
  }
)
