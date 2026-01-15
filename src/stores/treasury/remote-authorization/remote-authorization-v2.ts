import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IRemoteAuthorizationItemV2,
  RemoteAuthModuleV2,
  RemoteAuthProcessV2,
  RemoteAuthStatusV2,
  StatsByModuleV2,
  StatsGeneralV2,
} from '@/interfaces/customs/treasury/RemotoAuthorizationV2'
import { IPaginated } from '@/interfaces/customs/IPages'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRemoteAuthorizationStoreV2 = defineStore(
  'remote-authorization-store-v2',
  {
    state: () => ({
      version: 'v2',
      statuses: [] as RemoteAuthStatusV2[],
      modules: [] as RemoteAuthModuleV2[],
      processes: [] as RemoteAuthProcessV2[],
      stats_general: null as StatsGeneralV2 | null,
      stats_by_module: [] as StatsByModuleV2[],
      pending_list: [] as IRemoteAuthorizationItemV2[],
      pending_pages: { currentPage: 0, lastPage: 0 },
    }),

    actions: {
      async _getListAction(
        params: Record<string, string | number>
      ): Promise<IPaginated<IRemoteAuthorizationItemV2> | null> {
        let paginatorResponse: IPaginated<IRemoteAuthorizationItemV2> | null =
          null
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/remote-authorizations`, {
            params: { ...params, paginate: 1 },
          })
          .then((response) => {
            const {
              data: { data = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            paginatorResponse = {
              list: data,
              pages: {
                currentPage: current_page || 1,
                lastPage: last_page || 1,
              },
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
        return paginatorResponse
      },

      async _get(id: number) {
        let item: IRemoteAuthorizationItemV2 | null = null
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/remote-authorizations/${id}/view`)
          .then((res) => {
            const data = res.data as {
              success: boolean
              message?: string
              data?: IRemoteAuthorizationItemV2 | null
            }
            if (data.success) {
              item = data.data ?? null
            } else {
              showAlert(
                data.message ?? 'No fue posible obtener el detalle',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return item
      },

      async _update(id: number, payload: Partial<IRemoteAuthorizationItemV2>) {
        let ok = false
        await executeApi()
          .put(`${URL_PATH_TREASURIES}/remote-authorizations/${id}`, payload)
          .then((res) => {
            const data = res.data as { success: boolean; message?: string }
            ok = !!data.success
            showAlert(
              data.message ??
                (ok
                  ? 'Actualizado correctamente'
                  : 'No fue posible actualizar'),
              ok ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return ok
      },

      async _authorize(id: number) {
        let ok = false
        await executeApi()
          .post(`/api/v1/remote-authorizations/${id}/authorize`)
          .then((res) => {
            const data = res.data as { success: boolean; message?: string }
            ok = !!data.success
            showAlert(
              data.message ?? (ok ? 'Autorizado' : 'No fue posible autorizar'),
              ok ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return ok
      },

      async _reject(id: number) {
        let ok = false
        await executeApi()
          .post(`${URL_PATH_TREASURIES}/remote-authorizations/${id}/reject`)
          .then((res) => {
            const data = res.data as { success: boolean; message?: string }
            ok = !!data.success
            showAlert(
              data.message ?? (ok ? 'Rechazado' : 'No fue posible rechazar'),
              ok ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
        return ok
      },

      async _bulkUpdate(
        authorizations: Array<{
          id: number
          is_authorized: boolean
          rejection_reason?: string
        }>
      ): Promise<boolean> {
        let ok = false

        const payload = { authorizations }

        await executeApi()
          .post(
            `${URL_PATH_TREASURIES}/remote-authorizations/bulk-update`,
            payload
          )
          .then((res) => {
            const data = res.data as { success: boolean; message?: string }
            ok = !!data.success

            const authorizedCount = authorizations.filter(
              (auth) => auth.is_authorized
            ).length
            const rejectedCount = authorizations.filter(
              (auth) => !auth.is_authorized
            ).length

            let successMessage = ''
            if (authorizedCount > 0 && rejectedCount > 0) {
              successMessage = `Se procesaron ${authorizedCount} autorizaciones y ${rejectedCount} rechazos exitosamente`
            } else if (authorizedCount > 0) {
              successMessage = `Se autorizaron ${authorizedCount} registros exitosamente`
            } else if (rejectedCount > 0) {
              successMessage = `Se rechazaron ${rejectedCount} registros exitosamente`
            }

            showAlert(
              data.message ??
                (ok ? successMessage : 'No fue posible procesar los registros'),
              ok ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((error) => {
            const errorMessage = error.response?.data?.message
            if (errorMessage) {
              showAlert(errorMessage, 'error', undefined, TIMEOUT_ALERT)
            }
            ok = false
          })
        return ok
      },

      async _getStatuses() {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/remote-authorizations/statuses`)
          .then((res) => {
            const data = res.data as {
              success: boolean
              data?: RemoteAuthStatusV2[]
            }
            if (data.success) this.statuses = data.data ?? []
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getModules() {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/remote-authorizations/modules`)
          .then((res) => {
            const data = res.data as {
              success: boolean
              data?: RemoteAuthModuleV2[]
            }
            if (data.success) this.modules = data.data ?? []
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getProcesses() {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/remote-authorizations/processes`)
          .then((res) => {
            const data = res.data as {
              success: boolean
              data?: RemoteAuthProcessV2[]
            }
            if (data.success) this.processes = data.data ?? []
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getStatsGeneral() {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/remote-authorizations/stats`)
          .then((res) => {
            const data = res.data as {
              success: boolean
              data?: StatsGeneralV2 | null
            }
            if (data.success) this.stats_general = data.data ?? null
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getStatsByModule() {
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/remote-authorizations/stats-by-module`)
          .then((res) => {
            const data = res.data as {
              success: boolean
              data?: StatsByModuleV2[]
            }
            if (data.success) this.stats_by_module = data.data ?? []
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _getPending(params: string = '') {
        this.pending_list = []
        this.pending_pages = { currentPage: 0, lastPage: 0 }

        await executeApi()
          .get(
            `${URL_PATH_TREASURIES}/remote-authorizations/pending?paginate=1${
              params ? '&' + params : ''
            }`
          )
          .then((res) => {
            const data = res.data as {
              success: boolean
              data?: {
                data: IRemoteAuthorizationItemV2[]
                current_page: number
                last_page: number
              }
            }
            if (data.success) {
              const p = data.data
              this.pending_list = p?.data ?? []
              this.pending_pages = {
                currentPage: p?.current_page ?? 1,
                lastPage: p?.last_page ?? 1,
              }
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      _cleanAll() {
        this.statuses = []
        this.modules = []
        this.processes = []
        this.stats_general = null
        this.stats_by_module = []
        this.pending_list = []
        this.pending_pages = { currentPage: 0, lastPage: 0 }
      },
    },
  }
)
