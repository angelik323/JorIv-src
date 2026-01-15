import { URL_PATH_INVESTMENT_PORTFOLIO } from '@/constants/apis'
import { useAlert, useShowError } from '@/composables'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

import {
  IQuotasIssuingPermitsRequest,
  IQuotasIssuingPermitsResponse,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useQuotasIssuingPermitsStoreV1 = defineStore(
  'quotas-issuing-permits-store-v1',
  {
    state: () => ({
      version: 'v1',
      quotas_issuing_permits_list: [] as IQuotasIssuingPermitsResponse[],
      quotas_issuing_permits_pages: {
        currentPage: 1,
        lastPage: 1,
      },
    }),
    actions: {
      async _listAction(params: string) {
        this._clearData()

        await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/list?${params}`
          )
          .then((response) => {
            const data = response.data

            if (response.data.success) {
              this.quotas_issuing_permits_list = data.data.data ?? []
              this.quotas_issuing_permits_pages.currentPage =
                data.current_page ?? 1
              this.quotas_issuing_permits_pages.lastPage = data.last_page ?? 1
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

      async _showAction(id: string) {
        return await executeApi()
          .get(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/show/${id}`
          )
          .then((response) => {
            if (response.data.success) {
              return response.data.data
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
            return null
          })
      },

      async _createAction(payload: IQuotasIssuingPermitsRequest) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/new`,
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

      async _updateAction(id: string, payload: IQuotasIssuingPermitsRequest) {
        let success = false

        await executeApi()
          .put(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/update/${id}`,
            payload
          )
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

        return success
      },

      async _deleteAction(id: number) {
        await executeApi()
          .delete(
            `${URL_PATH_INVESTMENT_PORTFOLIO}/quotas-issuing-permits/destroy/${id}`
          )
          .then((response) => {
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

      _clearData() {
        this.quotas_issuing_permits_list = []
        this.quotas_issuing_permits_pages = {
          currentPage: 1,
          lastPage: 1,
        }
      },
    },
  }
)
