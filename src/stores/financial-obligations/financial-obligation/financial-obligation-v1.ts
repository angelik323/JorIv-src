// apis
import { executeApi } from '@/apis'

// pinia
import { defineStore } from 'pinia'

// composables
import { useShowError, useAlert, useUtils } from '@/composables'

// interfaces
import {
  IFinancialObligationList,
  IFinancialObligationPaymentsList,
  IFinancialSelectorOptions,
  IBusinessTrust,
  ICreateFinancialObligation,
  IFinancialObligationInfo,
  IObligationList,
  IPeriodicityType,
  IUpdateFinancialObligation,
  IInfoBasicForm,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

import { URL_PATH_FINANCIAL_OBLIGATION } from '@/constants/apis'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()
const { formatCurrencyString } = useUtils()

export const useFinancialObligationStoreV1 = defineStore(
  'financial-obligation-v1',
  {
    state: () => ({
      // business trust
      businessTrustName: null as string | null,
      businessTrustId: null as number | null,
      businessTrustCode: null as string | null,

      // list
      urlFinancialObligationListXLS: undefined as string | undefined,

      financialObligationLoader: false as boolean,
      financialObligationList: [] as IFinancialObligationList[],

      obligationStatusLoader: false as boolean,

      bankListLoader: false as boolean,

      financialObligationPages: {
        currentPage: 1,
        lastPage: 1,
      },

      //obligation form
      addSelectorValue: undefined as string | undefined,

      bankListObligationLoader: false as boolean,

      creditTypeLoader: false as boolean,
      creditTypeOptions: [] as IFinancialSelectorOptions[],

      paymentFrequencyLoader: false as boolean,
      paymentFrequencyOptions: [] as IPeriodicityType[],

      infoBasicForm: null as IInfoBasicForm | null,

      // edit
      financialObligationLastModification: undefined as string | undefined,

      // view
      obligationPaymentsLoader: false as boolean,
      obligationPaymentsList: [] as IFinancialObligationPaymentsList[],

      financialPages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),

    actions: {
      async _resetFinancialObligationForm() {
        this.infoBasicForm = null
        this.addSelectorValue = undefined
      },

      async _resetFinancialObligationList() {
        this.financialObligationList = []
      },

      async _loadObligationPaymentsId(id: number) {
        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/get-financial-obligation-by-id/${id}`
          )
          .then((response) => {
            const responseView: IFinancialObligationInfo = response.data.data
            const responseMessage: string =
              response.data.message ?? 'Sin definir'

            const setupResponseInfo = {
              businessTrustId: responseView.business_trust.id,
              businessTrustCode: responseView.business_trust.business_code,
              businessTrustName: responseView.business_trust.name,
              bankName: responseView.bank.id,
              creditType: responseView.credit_type.id,
              paymentPeriod: responseView.periodicity_type,
              paymentValue: responseView.amount
                ? Number(responseView.amount)
                : null,
              paymentTerm: responseView.quotas,
              paymentNumber: responseView.obligation_number,
              interestRate: responseView.interest_rate,
              nitNumber: responseView.titular_nit,
              payDay: responseView.payment_day,
              warningDays: responseView.alert_days,
              accountHolder: responseView.titular_name,
            }

            this.financialObligationLastModification =
              responseView.date_updated_obligation?.slice(0, 10) ?? undefined

            this.paymentFrequencyOptions = [
              ...this.paymentFrequencyOptions,
              {
                label: setupResponseInfo.paymentPeriod,
                value: setupResponseInfo.paymentPeriod,
              },
            ]

            this.infoBasicForm = setupResponseInfo

            showAlert(responseMessage, 'success')
          })
          .catch((e) => {
            const error = e as IErrors
            this.obligationPaymentsList = []
            showAlert(showCatchError(error), 'error')
          })
      },

      async _loadFinancialObligationList(params: string) {
        this.financialObligationLoader = true
        this.financialObligationList = []

        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/get-financial-obligations?paginate=true${params}`
          )
          .then((response) => {
            const responseMessage: string =
              response.data.message ?? 'Sin definir'

            const responseList: IObligationList[] = response.data.data.data
              ? response.data.data.data.filter(
                  (item: IObligationList) => item.business_trust !== null
                )
              : []

            const setupResponseList =
              responseList.map((item) => ({
                id: item.id,
                businessCode: item.business_trust.business_code,
                businessName: item.business_trust.name,
                bankName: item.bank?.description ?? 'Sin definir',
                obligationNumber: item.obligation_number,
                outstandingBalance: formatCurrencyString(item.balance),
                status: item.obligation_status.id ?? 0,
                creditValue: formatCurrencyString(item.amount),
                term: item.quotas,
                creditType: item.credit_type.name,
                interestRate: item.interest_rate,
                paymentFrequency: item.periodicity_type,
                paymentDay: item.payment_day,
                alertDays: item.alert_days,
              })) || []

            this.financialObligationList = setupResponseList
            this.urlFinancialObligationListXLS = response.data.data.route_export

            showAlert(responseMessage, 'success')
          })
          .catch((e) => {
            const error = e as IErrors
            this.financialObligationList = []
            showAlert(showCatchError(error), 'error')
          })
          .finally(() => {
            this.financialObligationLoader = false
          })
      },

      async _loadBusinessTrust(params: string) {
        this.businessTrustName = null

        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/get-financial-obligations?${params}`
          )
          .then((response) => {
            const responseName: IBusinessTrust =
              response.data.data[0].business_trust
            const responseMessage: string =
              response.data.message ?? 'Error sin definir'

            this.businessTrustName = responseName.name
            this.businessTrustId = responseName.id
            this.businessTrustCode = responseName.business_code

            showAlert(responseMessage, 'success')
          })
          .catch((e) => {
            const error = e as IErrors
            this.businessTrustName = null

            showAlert(showCatchError(error), 'error')
          })
      },

      async _createFinancialObligation(info: ICreateFinancialObligation) {
        let success = false

        await executeApi()
          .post(`${URL_PATH_FINANCIAL_OBLIGATION}/store-financial-obligation`, {
            ...info,
          })
          .then((response) => {
            success = response.data.success

            const messageResponse = response.data.message

            showAlert(
              messageResponse,
              response.data.success ? 'success' : 'error'
            )
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
          })

        return success
      },

      async _updateFinancialObligation(info: IUpdateFinancialObligation) {
        let success = false

        await executeApi()
          .put(`${URL_PATH_FINANCIAL_OBLIGATION}/update-financial-obligation`, {
            ...info,
          })
          .then((response) => {
            success = response.data.success

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error'
            )
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
          })

        return success
      },

      async _updateCreditType(creditName: string) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_FINANCIAL_OBLIGATION}/credit-types/store-credit-type`,
            {
              name: creditName,
            }
          )
          .then((response) => {
            success = response.data.success

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error'
            )
          })
          .catch((e) => {
            const error = e as IErrors
            showAlert(showCatchError(error), 'error')
          })

        return success
      },

      async _exportObligationListXLS(gotUrl: string) {
        await executeApi()
          .get(
            `${URL_PATH_FINANCIAL_OBLIGATION}/export-financial-obligations?${gotUrl}`,
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
    persist: false,
  }
)
