import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import { IPaginated } from '@/interfaces/customs/IPages'
import { IIndividualRemoteAuthorizationManagementList } from '@/interfaces/customs/sarlaft/IndividualRemoteAuthorizationManagement'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_SARLAFT}/finding-list`

export const useIndividualRemoteAuthorizationManagementStoreV1 = defineStore(
  'individual-remote-authorization-management-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),

    actions: {
      async _getFindingList(params: Record<string, string | number | boolean>) {
        let responseList: IPaginated<IIndividualRemoteAuthorizationManagementList> | null =
          { list: [], pages: { currentPage: 0, lastPage: 0 } }
        await executeApi()
          .get(`${URL_PATH}`, { params: { ...params, paginate: 1 } })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            if (success) {
              responseList = {
                list: items,
                pages: { currentPage: current_page, lastPage: last_page },
              }
            }

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

        return responseList
      },

      async _updateFindingList(
        findingId: number,
        payload: { justification: string; action: boolean }
      ) {
        let success = false
        await executeApi()
          .put(`${URL_PATH}/${findingId}`, payload)
          .then((response) => {
            success = response.data.success
            return showAlert(
              response.data.message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return { success }
      },
    },
  }
)
