// pinia
import { defineStore } from 'pinia'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { TRUST_BUSINESS_API_URL } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'
import {
  IExtendTrustInterface,
  IExtendTrustCreate,
  IExtendTrustResponse,
} from '@/interfaces/customs'

export const useExtendTrustStorev1 = defineStore('extend-trust-v1', {
  state: () => ({
    version: 'v1',
    extend_trust_list: [] as IExtendTrustInterface[],
    extend_trust_pages: {
      currentPage: 0,
      lastPage: 0,
    },
    data_information_form: null as IExtendTrustResponse | null,
    extend_trust_request: null as IExtendTrustResponse | null,
  }),
  actions: {
    async _getListAction(params: string) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/manage/extend/list?paginate=1${params}`)
        .then((response) => {
          if (response.data.success) {
            this.extend_trust_list = response.data?.data?.data ?? []
            this.extend_trust_pages = {
              currentPage: response.data?.data?.current_page ?? 0,
              lastPage: response.data?.data?.last_page ?? 0,
            }
          }

          return useAlert().showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
    },

    async _getExtendById(id: number) {
      await executeApi()
        .get(`${TRUST_BUSINESS_API_URL}/manage/extend/${id}`)
        .then((response) => {
          if (response.data.success) {
            this.extend_trust_request = response.data?.data ?? null
          }

          return useAlert().showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
    },

    async _createExtendTrustAction(data: IExtendTrustCreate, action: string) {
      let success = false

      await executeApi()
        .post(`${TRUST_BUSINESS_API_URL}/manage/extend/${data.id}`, {
          ...data,
          action: action,
        })
        .then((response) => {
          success = response.data.success
          return useAlert().showAlert(
            response.data.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          success = false
          useAlert().showAlert(
            useShowError().showCatchError(error),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
      return success
    },

    _setDataInformationForm(data: IExtendTrustResponse | null) {
      this.data_information_form = data
    },

    _clearData() {
      this.extend_trust_list = []
      this.data_information_form = null
      this.extend_trust_request = null
      this.extend_trust_pages = {
        currentPage: 0,
        lastPage: 0,
      }
    },
  },
})
