import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

import { IErrors } from '@/interfaces/global'
import { IPaginated, IPaginatedFiltersFormat } from '@/interfaces/customs'
import {
  IAuditDatabaseActivityLogsListItem,
  IAuditDatabaseLogsUpdateHasLogsPayload,
} from '@/interfaces/customs/audit/AuditDatabaseLogs'

import { useAlert, useShowError } from '@/composables'

import { URL_PATH_AUDIT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH_MODULES_APP = `${URL_PATH_AUDIT}/modules-app`
const URL_PATH_ACTIVITY_LOGS = `${URL_PATH_AUDIT}/activity-logs`

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

export const useDatabaseLogsStoreV1 = defineStore(
  'audit-database-logs-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _updateHasLogs(
        payload: IAuditDatabaseLogsUpdateHasLogsPayload
      ): Promise<boolean> {
        return await executeApi()
          .post(`${URL_PATH_MODULES_APP}/has-logs-permissions`, { ...payload })
          .then((res) => {
            const { message, success } = res.data
            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return success
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
            return false
          })
      },

      async _getActivityLogsList(
        filters: IPaginatedFiltersFormat
      ): Promise<IPaginated<IAuditDatabaseActivityLogsListItem>> {
        return await executeApi()
          .get(`${URL_PATH_ACTIVITY_LOGS}`, {
            params: { ...filters, paginate: true },
          })
          .then((res) => {
            const { data, message, success } = res.data

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )

            return {
              list: data.data,
              pages: {
                currentPage: data.current_page,
                lastPage: data.last_page,
              },
            }
          })
          .catch((err) => {
            const error = err as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)

            return {
              list: [],
              pages: {
                currentPage: 0,
                lastPage: 0,
              },
            }
          })
      },
    },
  }
)
