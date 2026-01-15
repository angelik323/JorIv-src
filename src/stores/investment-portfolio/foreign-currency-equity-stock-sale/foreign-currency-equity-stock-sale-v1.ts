import {
  IForeignCurrencyEquityStockSale,
  IEmitterForeignFormData,
  IComplianceForeignFormData,
  IBasicDataForeignFormData,
} from '@/interfaces/customs'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useForeignCurrencyEquityStockSaleStoreV1 = defineStore(
  'foreign-currency-equity-stock-sale-store-v1',
  {
    state: () => ({
      data_foreign_currency_equity_stock_sale:
        {} as IForeignCurrencyEquityStockSale,
      basicData: {} as IBasicDataForeignFormData,
      emitterData: {} as IEmitterForeignFormData,
      complianceData: {} as IComplianceForeignFormData,
      headerPropsDefault: {
        title: 'Venta renta variable acciones moneda extranjera',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Portafolio de inversiones',
          },
          {
            label: 'Venta renta variable acciones moneda extranjera',
            route: 'RegisterSharePurchaseLocalCurrencyCreate',
          },
        ],
      },
    }),
    getters: {
      getBasicData: (state) => state.basicData,
      getEmitterData: (state) => state.emitterData,
      getComplianceData: (state) => state.complianceData,
      buildPayload: (state): IForeignCurrencyEquityStockSale => ({
        ...state.basicData,
        issuer: [state.emitterData],
        compliance_units: [
          {
            ...state.complianceData,
            origin_currency: Number(state.complianceData.origin_currency),
          },
        ],
      }),
    },
    actions: {
      async _createAction(payload: IForeignCurrencyEquityStockSale) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/variable-income-shares-currency-foreign/new`,
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
      _setDataForeignCurrencyEquityStockSale(
        data: IForeignCurrencyEquityStockSale
      ) {
        this.data_foreign_currency_equity_stock_sale = data
      },

      // Form data management actions
      updateBasicData(data: IBasicDataForeignFormData) {
        this.basicData = { ...this.basicData, ...data }
      },

      updateEmitterData(data: IEmitterForeignFormData) {
        this.emitterData = { ...this.emitterData, ...data }
      },

      updateComplianceData(data: IComplianceForeignFormData) {
        this.complianceData = { ...this.complianceData, ...data }
      },

      resetFormData() {
        this.basicData = {} as IBasicDataForeignFormData
        this.emitterData = {} as IEmitterForeignFormData
        this.complianceData = {} as IComplianceForeignFormData
      },
    },
  }
)
