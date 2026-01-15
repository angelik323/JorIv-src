import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import { useAlert, useShowError } from '@/composables'

import {
  ITreasureCancellations,
  ITreasureCancellationsAnnulate,
} from '@/interfaces/customs'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/treasury-cancellation`

export const useTreasuryCancellationsStoreV1 = defineStore(
  'treasury-cancellations-store-v1',
  {
    state: () => ({
      version: 'v1',
      treasury_cancellations_list: [] as ITreasureCancellations[],
      treasury_cancellation_selected: null as ITreasureCancellations | null,
    }),
    actions: {
      async _listAction(params: string) {
        this.treasury_cancellations_list = []

        await executeApi()
          .get(`${URL_PATH}/all?${params}`)
          .then((response) => {
            const data = response.data

            if (response.data.success) {
              if (response.data.data.current_page) {
                this.treasury_cancellations_list = data.data.data ?? []
              } else {
                this.treasury_cancellations_list = data.data ?? []
              }
            }

            return showAlert(
              data.message,
              data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _showAction(id: string, params: string) {
        return await executeApi()
          .get(`${URL_PATH}/show/${id}?${params}`)
          .then((response) => {
            if (response.data.success) return response.data.data

            return showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      async _createAction(payload: ITreasureCancellationsAnnulate) {
        let success = false

        await executeApi()
          .post(`${URL_PATH}/annulate/${payload.id}`, payload)
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

      async _deleteChecksAction(payload: {}) {
        let success = false
        await executeApi()
          .post(`${URL_PATH}/annulate-inexistent-checks`, payload)
          .then((response) => {
            success = response.data.success

            showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _setTreasuryCancellationSelected() {
        this.treasury_cancellation_selected =
          this.treasury_cancellations_list.length > 0
            ? this.treasury_cancellations_list[0]
            : null
      },
    },
  }
)
