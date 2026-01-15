import { defineStore } from 'pinia'

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { IErrors } from '@/interfaces/global'
import {
  ITreasuryClosingExecutionItem,
  ITreasuryClosingExecutionPayload,
  ITreasuryClosingItem,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const URL_PATH = `${URL_PATH_TREASURIES}/treasury-closing`

export const useTreasuryClosingStoreV1 = defineStore(
  'treasury-closing-store-v1',
  {
    state: () => ({
      treasury_closing_list: [] as ITreasuryClosingItem[],
      treasury_closing_execution_list: [] as ITreasuryClosingExecutionItem[],
      treasury_closing_execution_id: null as number | null,
      treasury_closing_execution_ended: false as boolean,
      treasury_closing_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      treasury_closing_execution_pages: {
        currentPage: 0,
        lastPage: 0,
      },
    }),
    actions: {
      async _getTreasuryClosingList(params: Record<string, string | number>) {
        await executeApi()
          .get(`${URL_PATH}`, {
            params: { paginate: 1, ...params },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.treasury_closing_list = items

            this.treasury_closing_pages = {
              currentPage: current_page,
              lastPage: last_page,
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
      },

      async _executeTreasuryClosing(payload: ITreasuryClosingExecutionPayload) {
        await executeApi()
          .post(`${URL_PATH}`, payload)
          .then((response) => {
            const {
              data: execution_response_data,
              message,
              success,
            } = response.data

            this.treasury_closing_execution_id =
              payload.procces === 'Generar cierre'
                ? execution_response_data.id
                : null

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
      },

      async _getTreasuryClosingExecutionLogs(
        params: Record<string, string | number | null>
      ) {
        await executeApi()
          .get(`${URL_PATH}/logs`, {
            params: { paginate: 1, ...params },
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            this.treasury_closing_execution_list = items

            this.treasury_closing_execution_pages = {
              currentPage: current_page,
              lastPage: last_page,
            }

            if (this.treasury_closing_execution_list.length > 0) {
              this.treasury_closing_execution_ended =
                this.treasury_closing_execution_list[
                  this.treasury_closing_execution_list.length - 1
                ]?.status?.status === 'Completado'
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
      },

      async _getMinimumDate(params: string) {
        return executeApi()
          .get(`${URL_PATH}/minimum-date?${params}`)
          .then((response) => {
            const { data = null } = response.data
            return data
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return null
          })
      },

      _resetExecutionKeys() {
        this.treasury_closing_execution_id = null
      },
    },
  }
)
