import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces
import {
  ITrustCommissionCollectionItemList,
  IApplyCollection,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_BILLING } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useTrustCommissionCollectionStoreV1 = defineStore(
  'trust-commission-collection-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _getTrustCommissionCollectionList(
        params: Record<string, string | number | boolean>
      ) {
        let responseList = {
          list: [] as ITrustCommissionCollectionItemList[],
          pages: { currentPage: 0, lastPage: 0 },
        }

        await executeApi()
          .get(`${URL_PATH_BILLING}/collection-trust-commission`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            responseList = {
              list: items,
              pages: { currentPage: current_page, lastPage: last_page },
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return responseList
      },

      async _applyCollection(data: Partial<IApplyCollection>) {
        let success = false

        await executeApi()
          .post(
            `${URL_PATH_BILLING}/collection-trust-commission/apply-collection`,
            data
          )
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },
    },
  }
)
