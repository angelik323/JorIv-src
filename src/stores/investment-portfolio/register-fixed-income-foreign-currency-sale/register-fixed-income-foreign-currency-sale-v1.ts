import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IRegisterFixedIncomeForeignCurrencySalePayload,
  IIrrSaleForTitleRequests,
  IIrrSaleForTitleResponses,
  IComplianceFactorResponse,
  IComplianceFactorRequest,
  IRegisterFixedIncomeForeignCurrencySaleTitle,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterFixedIncomeForeignCurrencySaleStoreV1 = defineStore(
  'register-fixed-income-foreign-currency-sale-store-v1',
  {
    state: () => ({
      version: 'v1' as const,
      currencyDescription: null as string | null,
      paperTypeId: null as number | null,
      numberDays: null as number | null,
      negotiation: 'Operacion Spot' as string | null,
      valoration_trm: null as number | null,
      currencyValue: null as number | null,
    }),
    actions: {
      async _createAction(
        payload: IRegisterFixedIncomeForeignCurrencySalePayload
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-foreign-currency/new`,
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

      async _getIrrSaleValue(
        request: IIrrSaleForTitleRequests
      ): Promise<number | null> {
        this.valoration_trm = null
        return await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-irr-sale/sale-irr`,
            request
          )
          .then((response) => {
            const data: IIrrSaleForTitleResponses = response.data.data
            this.valoration_trm = data.irr_sale_value
            return this.valoration_trm
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _calculateComplianceFactor(
        request: IComplianceFactorRequest
      ): Promise<number | null> {
        return await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/sale-fixed-income-foreign-currency/compliance-factor`,
            request
          )
          .then((response) => {
            if (response.data.success) {
              const data: IComplianceFactorResponse = response.data.data
              return data.compliance_factor
            }
            showAlert(response.data.message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch(() => {
            //showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },
      async _getTitlesList(
        issuerId: number,
        purchasable: 'local_fixed' | 'foreign_fixed'
      ): Promise<IRegisterFixedIncomeForeignCurrencySaleTitle[] | null> {
        return executeApi()
          .get(`${URL_PATH_INVESTMENT_PORTFOLIO}/title-handler/titles-list`, {
            params: {
              'filter[issuers_counterparty_id]': issuerId,
              'filter[purchasable]': purchasable,
            },
          })
          .then((response) => {
            if (response.data.success) {
              return response.data
                .data as IRegisterFixedIncomeForeignCurrencySaleTitle[]
            }
            showAlert(response.data.message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      _setCurrencyDescription(description: string) {
        this.currencyDescription = description
      },

      _setPaperTypeId(paperTypeId: number | null) {
        this.paperTypeId = paperTypeId
      },

      _setNumberDays(numberDays: number | null) {
        this.numberDays = numberDays
      },

      _setNegotiation(negotiation: string) {
        this.negotiation = negotiation
      },

      _setCurrencyValue(value: number | null) {
        this.currencyValue = value
      },
    },
  }
)
