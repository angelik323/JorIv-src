// Vue - pinia
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces - Constants
import { IConsultIndividualListPreventionList } from '@/interfaces/customs/sarlaft/ConsultIndividualListPrevention'
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

const URL_PATH = `${URL_PATH_SARLAFT}/prevention-list`

export const useConsultIndividualListPreventionListStoreV1 = defineStore(
  'consult-individual-list-prevention-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _listAction(params: Record<string, string | number>) {
        let responseList: IConsultIndividualListPreventionList[] = []

        await executeApi()
          .post(`${URL_PATH}/consult-listings`, { ...params })
          .then((response) => {
            const { success, message, data } = response.data

            if (success) responseList = Array.isArray(data) ? data : [data]

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
    },
  }
)
