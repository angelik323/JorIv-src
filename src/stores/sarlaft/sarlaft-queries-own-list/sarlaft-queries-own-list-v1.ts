import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces
import { IErrors } from '@/interfaces/global/errorMessage'
import { ISarlaftQueriesOwnList } from '@/interfaces/customs/sarlaft/QueriesOwnList'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_SARLAFT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_SARLAFT}/own-list`

export const useSarlaftQueriesOwnListStoreV1 = defineStore(
  'sarlaft-queries-own-list-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),

    actions: {
      async _getConsultOwnList(params: object): Promise<{
        data: ISarlaftQueriesOwnList[]
        pages: { currentPage: number; lastPage: number }
      }> {
        let response_data: ISarlaftQueriesOwnList[] = []
        let response_pages = { currentPage: 1, lastPage: 1 }
        await executeApi()
          .get(`${URL_PATH}/consult-listings`, { params })
          .then((response) => {
            if (!response.status) return
            showAlert(
              response?.data?.message,
              'success',
              undefined,
              TIMEOUT_ALERT
            )

            response_data = response?.data?.data?.data ?? []
            response_pages = {
              currentPage: response?.data?.data?.current_page ?? 1,
              lastPage: response?.data?.data?.last_page ?? 1,
            }
          })
          .catch((error) => {
            showAlert(
              showCatchError(error as IErrors),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
            return error
          })
        return { data: response_data, pages: response_pages }
      },
      async _getAllOwnList(): Promise<{
        data: ISarlaftQueriesOwnList[]
        pages: { currentPage: number; lastPage: number }
      }> {
        let response_data: ISarlaftQueriesOwnList[] = []
        let response_pages = { currentPage: 1, lastPage: 1 }
        await executeApi()
          .get(`${URL_PATH}`)
          .then((response) => {
            if (!response.status) return
            showAlert(
              response?.data?.message,
              'success',
              undefined,
              TIMEOUT_ALERT
            )
            response_data = response?.data?.data ?? []
            response_pages = {
              currentPage: response?.data?.data?.current_page ?? 1,
              lastPage: response?.data?.data?.last_page ?? 1,
            }
          })
          .catch((error) => {
            showAlert(
              showCatchError(error as IErrors),
              'error',
              undefined,
              TIMEOUT_ALERT
            )
            return error
          })

        return { data: response_data, pages: response_pages }
      },
    },
  }
)
