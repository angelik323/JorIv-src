// Vue - Vue Router - Pinia - Quasar
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  IParticipationTypeRegistrationCreatePayload,
  IParticipationTypeRegistrationModel,
  IParticipationTypeRegistration,
} from '@/interfaces/customs/fics/ParticipationTypeRegistration'

// Utils
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_FICS } from '@/constants/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

export const useParticipationTypeRegistrationStoreV1 = defineStore(
  'participation-type-registration-store-v1',
  {
    state: () => ({
      version: 'v1',
      participation_type_registration_list:
        [] as IParticipationTypeRegistration[],
      participation_type_registration_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),

    actions: {
      async _getListAction(params: string = '') {
        this._cleanData()

        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .get(
            `${URL_PATH_FICS}/participation-types?paginate=1${
              params ? '&' + params : ''
            }`
          )
          .then((response) => {
            const {
              data: { data: items = [], current_page = 1, last_page = 1 },
              message,
              success,
            } = response.data

            if (success) {
              this.participation_type_registration_list = (
                (items ?? []) as IParticipationTypeRegistration[]
              ).sort((a, b) => b.id! - a.id!)

              this.participation_type_registration_pages = {
                currentPage: current_page,
                lastPage: last_page,
              }
            }

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

      _cleanData() {
        this.participation_type_registration_list = []
        this.participation_type_registration_pages = {
          currentPage: 0,
          lastPage: 0,
        }
      },

      async _create(payload: IParticipationTypeRegistrationCreatePayload) {
        let isSuccess = false
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .post(`${URL_PATH_FICS}/participation-types`, payload)
          .then((response) => {
            const { message, success } = response.data
            isSuccess = success

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

        return isSuccess
      },

      async _update(
        id: number,
        payload: Partial<IParticipationTypeRegistrationModel>
      ) {
        let isSuccess = false
        const { showAlert } = useAlert()
        const { showCatchError } = useShowError()

        await executeApi()
          .put(`${URL_PATH_FICS}/participation-types/${id}`, payload)
          .then((response) => {
            const { message, success } = response.data

            isSuccess = response.data.success
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

        return isSuccess
      },
    },
  }
)
