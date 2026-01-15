import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IBasicDataRegisterCancellationParticipationFics,
  IOperationDataRegisterCancellationParticipationFics,
  IRegisterCancellationParticipationFics,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRegisterCancellationParticipationFicsStoreV1 = defineStore(
  'register-cancellation-participation-fics-local-store-v1',
  {
    state: () => ({
      data_register_cancellation_participation_fics:
        {} as IRegisterCancellationParticipationFics,
      basicData: {} as IBasicDataRegisterCancellationParticipationFics,
      operationData: {} as IOperationDataRegisterCancellationParticipationFics,
      headerPropsDefault: {
        title: 'Registro cancelación participación FIC’s',
        breadcrumbs: [
          {
            label: 'Inicio',
            route: 'HomeView',
          },
          {
            label: 'Portafolio de inversiones',
          },
          {
            label: 'Registro cancelación participación FIC’s',
            route: 'RegisterCancellationParticipationFicsCreate',
          },
        ],
      },
    }),
    getters: {
      getBasicData: (state) => state.basicData,
      getOperationData: (state) => state.operationData,
      buildPayload: (state): IRegisterCancellationParticipationFics => ({
        ...state.basicData,
        data_operation: { ...state.operationData },
      }),
    },
    actions: {
      async _createAction(payload: IRegisterCancellationParticipationFics) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/fic-participations-cancellation-local-currency/new`,
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
      _updateBasicData(data: IBasicDataRegisterCancellationParticipationFics) {
        this.basicData = { ...this.basicData, ...data }
      },
      _updateOperationData(
        data: IOperationDataRegisterCancellationParticipationFics
      ) {
        this.operationData = { ...this.operationData, ...data }
      },
      _resetFormData() {
        this.basicData = {} as IBasicDataRegisterCancellationParticipationFics
        this.operationData =
          {} as IOperationDataRegisterCancellationParticipationFics
      },
    },
  }
)
