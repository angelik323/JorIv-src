import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IBasicDataRegisterCancellationParticipationFicsForeign,
  IComplianceConditionsDataRegisterCancellationParticipationFicsForeign,
  IOperationDataRegisterCancellationParticipationFicsForeign,
  IRegisterCancellationParticipationFicsForeign,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterCancellationParticipationFicsForeignStoreV1 =
  defineStore('register-cancellation-participation-fics-foreign-store-v1', {
    state: () => ({
      data_register_cancellation_participation_fics_foreign:
        {} as IRegisterCancellationParticipationFicsForeign,
      basicData: {} as IBasicDataRegisterCancellationParticipationFicsForeign,
      operationData:
        {} as IOperationDataRegisterCancellationParticipationFicsForeign,
      complianceData:
        {} as IComplianceConditionsDataRegisterCancellationParticipationFicsForeign,
      headerPropsDefault: {
        title: 'Registro cancelación participación FIC’s moneda extranjera',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Portafolio de inversiones',
          },
          {
            label: 'Registro cancelación participación FIC’s moneda extranjera',
            route: 'RegisterCancellationParticipationFicsForeignCreate',
          },
        ],
      },
      trm: '',
      currency: 0,
      coin_value: '',
      currency_conversion: '0',
      constitution_value_origin_currency: 0,
    }),
    getters: {
      getBasicData: (state) => state.basicData,
      getOperationData: (state) => state.operationData,
      buildPayload: (state): IRegisterCancellationParticipationFicsForeign => ({
        ...state.basicData,
        data_operation: { ...state.operationData },
        compliance: { ...state.complianceData },
      }),
    },
    actions: {
      async _createAction(
        payload: IRegisterCancellationParticipationFicsForeign
      ) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/fic-participations-cancellation-foreign-currency/new`,
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
      _updateBasicData(
        data: IBasicDataRegisterCancellationParticipationFicsForeign
      ) {
        this.basicData = { ...this.basicData, ...data }
      },
      _updateOperationData(
        data: IOperationDataRegisterCancellationParticipationFicsForeign
      ) {
        this.operationData = { ...this.operationData, ...data }
      },
      _setDataCurrency(
        trm: string | '',
        value: number | 0,
        coin_value: string | '',
        currency_conversion: string | '',
        constitution_value_origin_currency: number | 0
      ) {
        this.trm = trm ? trm : ''
        this.currency = value ? value : 0
        this.coin_value = coin_value ? coin_value : ''
        this.currency_conversion = currency_conversion
          ? currency_conversion
          : '0'

        this.constitution_value_origin_currency =
          constitution_value_origin_currency
      },
      _updateComplianceData(
        data: IComplianceConditionsDataRegisterCancellationParticipationFicsForeign
      ) {
        this.complianceData = { ...this.complianceData, ...data }
      },
      _resetFormData() {
        this.basicData =
          {} as IBasicDataRegisterCancellationParticipationFicsForeign
        this.operationData =
          {} as IOperationDataRegisterCancellationParticipationFicsForeign
      },
    },
  })
