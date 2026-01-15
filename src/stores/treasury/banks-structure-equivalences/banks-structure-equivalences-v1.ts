import { useAlert, useShowError } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'

import { defineStore } from 'pinia'

import {
  IBankStructureEquivalence,
  IBankStructureEquivalenceResponse,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useBankStructureEquivalencesStoreV1 = defineStore(
  'bank-structure-equivalences-v1',
  {
    state: () => ({
      version: 'v1',
      equivalence_list: [] as IBankStructureEquivalence[],
      equivalence_pages: {
        currentPage: 1,
        lastPage: 1,
      },
      equivalence_request: null as IBankStructureEquivalenceResponse | null,
      equivalence_form: null as IBankStructureEquivalence | null,
    }),

    actions: {
      async _getList(params: string, show_alert = true) {
        this._clearData()

        await executeApi()
          .get(`${URL_PATH_TREASURIES}/bank-structure-equivalences?${params}`)
          .then((response) => {
            const data = response.data

            if (response.data.success) {
              const dataObj: {
                [key: string]: { data: IBankStructureEquivalence[] }
              } = data.data || {}

              const dataArray: IBankStructureEquivalence[] = []

              Object.values(dataObj).forEach((entry) => {
                if (entry?.data && Array.isArray(entry.data)) {
                  dataArray.push(...entry.data)
                }
              })

              this.equivalence_list = dataArray
              this.equivalence_pages.currentPage =
                response.data.current_page ?? 1
              this.equivalence_pages.lastPage = response.data.last_page ?? 1
            }

            if (show_alert) {
              showAlert(
                response.data.message,
                response.data.success ? 'success' : 'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getById(id: number) {
        let result: IBankStructureEquivalence = {} as IBankStructureEquivalence

        await executeApi()
          .get(`${URL_PATH_TREASURIES}/bank-structure-equivalences/${id}`)
          .then((response) => {
            const data = response.data.data

            if (response.data.success && data) {
              result = data
              this.equivalence_request = { ...data }
            }

            showAlert(
              response.data.message,
              response.data.success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })

        return result
      },

      async _createAction(payload: IBankStructureEquivalence) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_TREASURIES}/bank-structure-equivalences`, payload)
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

      async _updateAction(payload: IBankStructureEquivalence) {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_TREASURIES}/bank-structure-equivalences/${payload.id}`,
            payload
          )
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

      async _deleteAction(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_TREASURIES}/bank-structure-equivalences/${id}`)
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

      _clearData() {
        this.equivalence_list = []
        this.equivalence_request = null
        this.equivalence_pages = {
          currentPage: 0,
          lastPage: 0,
        }
        this.equivalence_form = null
      },
    },
  }
)
