// pinia
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'

// interfaces
import {
  IChangeTrustStatus,
  IChangeTrustStatusRequest,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useChangeTrustStatusStoreV1 = defineStore(
  'change-trust-status-v1',
  {
    state: () => ({
      version: 'v1',
      change_trust_status_list: [] as IChangeTrustStatus[],
      change_trust_status_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      data_information_form: null as IChangeTrustStatusRequest | null,
      change_trust_status_request: null as IChangeTrustStatusRequest | null,
    }),
    actions: {
      async _getListAction(params: string) {
        await executeApi()
          .get(
            `${TRUST_BUSINESS_API_URL}/manage/status/list?paginate=1&rows=${params}`
          )
          .then((response) => {
            if (response.data.success) {
              this.change_trust_status_list = response.data?.data?.data ?? []
              this.change_trust_status_pages = {
                currentPage: response.data?.data?.current_page ?? 0,
                lastPage: response.data?.data?.last_page ?? 0,
              }
            }

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
      },

      async _getByIdChangeTrustStatus(id: number) {
        await executeApi()
          .get(`${TRUST_BUSINESS_API_URL}/manage/status/${id}`)
          .then((response) => {
            if (response.data.success) {
              this.change_trust_status_request = response.data?.data
            }

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
      },
      async _updateChangeTrustStatus(
        data: IChangeTrustStatusRequest | null,
        id: number
      ) {
        let success = false
        this.change_trust_status_request = null

        await executeApi()
          .post(`${TRUST_BUSINESS_API_URL}/manage/status/${id}`, {
            observation: data?.observation,
            status_id: data?.status_id,
          })
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

      _setDataInformationForm(data_to_set: IChangeTrustStatusRequest | null) {
        this.data_information_form = data_to_set ? { ...data_to_set } : null
      },
    },
  }
)
