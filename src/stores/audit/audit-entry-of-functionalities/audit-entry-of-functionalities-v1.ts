import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IErrors } from '@/interfaces/global'
import {
  IPaginated,
  INullableFiltersFormat,
  IPaginatedFiltersFormat,
} from '@/interfaces/customs'
import {
  IAuditEntryFunctionalitiesModule,
  IAuditEntryFunctionalitiesUpdateConfidencialPayload,
  IAuditEntryOfFunctionalitiesList,
} from '@/interfaces/customs/audit/AuditEntryOfFunctionalities'
import { URL_PATH_AUDIT } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const URL_PATH_AUDIT_LOGS = `${URL_PATH_AUDIT}/audit-logs`
const URL_PATH_MODULES_APP = `${URL_PATH_AUDIT}/modules-app`

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

export const useAuditEntryOfFunctionalitiesStoreV1 = defineStore(
  'audit-entry-of-functionalities-store-v1',
  {
    state: () => ({
      version: 'v1',
    }),
    actions: {
      async _listAction(
        filters: INullableFiltersFormat
      ): Promise<IPaginated<IAuditEntryOfFunctionalitiesList>> {
        return await executeApi()
          .get(`${URL_PATH_AUDIT_LOGS}`, {
            params: { ...filters, paginate: 1 },
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

      async _getModulesListAction(
        filters: IPaginatedFiltersFormat,
        to_activity?: boolean
      ): Promise<IPaginated<IAuditEntryFunctionalitiesModule>> {
        return await executeApi()
          .get(`${URL_PATH_MODULES_APP}`, {
            params: {
              ...filters,
              paginate: true,
              'filter[to_activity]': to_activity ?? false,
            },
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

      async _updateConfidential(
        payload: IAuditEntryFunctionalitiesUpdateConfidencialPayload
      ): Promise<boolean> {
        return await executeApi()
          .post(`${URL_PATH_MODULES_APP}/confidential-permissions`, {
            ...payload,
          })
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
    },
  }
)
