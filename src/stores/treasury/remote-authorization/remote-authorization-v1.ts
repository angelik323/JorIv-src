import { defineStore } from 'pinia'
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { URL_PATH_TREASURIES } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'
import {
  IRemoteAuthorizationItem,
  RemoteAuthStatus,
  RemoteAuthModule,
  RemoteAuthProcess,
  StatsGeneral,
  StatsByModule,
} from '@/interfaces/customs'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

export const useRemoteAuthorizationStoreV1 = defineStore(
  'remote-authorization-store-v1',
  {
    state: () => ({
      version: 'v1',
      authorization_list: [] as IRemoteAuthorizationItem[],
      authorization_pages: {
        currentPage: 0,
        lastPage: 0,
      },
      statuses: [] as RemoteAuthStatus[],
      modules: [] as RemoteAuthModule[],
      processes: [] as RemoteAuthProcess[],
      stats_general: null as StatsGeneral | null,
      stats_by_module: [] as StatsByModule,
      pending_list: [] as IRemoteAuthorizationItem[],
      pending_pages: { currentPage: 0, lastPage: 0 },
    }),

    actions: {
      async _getListAction(params: Record<string, string | number>) {
        this._cleanDataList()
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/remote-authorizations`, {
            params: { ...params, paginate: 1 },
          })
          .then((res) => {
            const data = res.data as {
              success: boolean
              message?: string
              data?: {
                data: IRemoteAuthorizationItem[]
                current_page: number
                last_page: number
              }
            }

            if (data.success) {
              const p = data.data
              this.authorization_list = p?.data ?? []
              this.authorization_pages = {
                currentPage: p?.current_page ?? 1,
                lastPage: p?.last_page ?? 1,
              }
              showAlert(
                data.message ?? 'Listado actualizado',
                'success',
                undefined,
                TIMEOUT_ALERT
              )
            } else {
              showAlert(
                data.message ?? 'No fue posible obtener el listado',
                'error',
                undefined,
                TIMEOUT_ALERT
              )
            }
          })
          .catch((error) => {
            showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
          })
      },

      async _get(id: number) {
        let item: IRemoteAuthorizationItem | null = null
        await executeApi()
          .get(`${URL_PATH_TREASURIES}/remote-authorizations/${id}/view`)
          .then((res) => {
            const data = res.data as {
              success: boolean
              message?: string
              data?: IRemoteAuthorizationItem | null
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

      async _update(id: number, payload: Partial<IRemoteAuthorizationItem>) {
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
              data?: RemoteAuthStatus[]
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
              data?: RemoteAuthModule[]
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
              data?: RemoteAuthProcess[]
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
              data?: StatsGeneral | null
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
            const data = res.data as { success: boolean; data?: StatsByModule }
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
                data: IRemoteAuthorizationItem[]
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

      _cleanDataList() {
        this.authorization_list = []
        this.authorization_pages = { currentPage: 0, lastPage: 0 }
      },

      _cleanAll() {
        this._cleanDataList()
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
