import { executeApi } from '@/apis'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlert } from '@/composables/useAlert'
import { useShowError } from '@/composables/useShowError'
import { IErrors } from '@/interfaces/global/errorMessage'
import {
  IRoles,
  IRolesList,
  IRolesCount,
  IFormDataRole,
  IJsonOptionsInactive,
  IPermissionRole,
} from '@/interfaces/customs'
import { defineStore } from 'pinia'
import { useUtils } from '@/composables'
const { openMainLoader } = useMainLoader()
const { showAlert } = useAlert()
const { showCatchError } = useShowError()

// Constants
import { URL_PATH_USERS_ROLES } from '@/constants/apis'

const CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
}
const TIMEOUT_ALERT = 3000

export const useRolesModule = defineStore('roles', {
  state: () => ({
    roles: null as IRoles | null,
    rolesList: [] as IRolesList[] | [],
    rolesCount: null as IRolesCount | null,
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    urlExportXlsx: null as string | null,
    firtsTime: 0,
    validateForm: true,
    formDataRole: {
      name: null,
      description: null,
      priority_level: null,
      authorization_level_id: null,
      permissions: [] as IPermissionRole | any,
      is_schedule_restricted: false,
      schedule_start_hour: null,
      schedule_end_hour: null,
      has_expiration: null,
      expired_months: null,
      requires_mfa: false,
      mfa_duration_months: null,
      has_password_policy: false,
      password_expiration_days: null,
    } as IFormDataRole | null,
  }),

  actions: {
    async _getList(params: string = '') {
      await executeApi()
        .get(`${URL_PATH_USERS_ROLES}${params}`)
        .then((response) => {
          if (response.data.success) {
            this.rolesList = response.data?.data?.paginate?.data ?? []
            this.rolesCount = response.data?.data?.cards ?? []
            this.pages.currentPage =
              response.data?.data?.paginate?.current_page ?? 0
            this.pages.lastPage = response.data?.data?.paginate?.last_page ?? 0
            this.urlExportXlsx =
              response.data?.data?.paginate?.route_export ?? ''
          }

          showAlert(
            response.data?.message,
            response.data.success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _createRegister(dataRequest: IFormDataRole) {
      let success = false
      await executeApi()
        .post(URL_PATH_USERS_ROLES, dataRequest, CONFIG)
        .then((response) => {
          success = response.data.success

          showAlert(
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

    async _updateRegister(id: number | string | string[], bodyRequest: IRoles) {
      let success = false
      await executeApi()
        .put(`${URL_PATH_USERS_ROLES}/${id}`, bodyRequest, CONFIG)
        .then((response) => {
          success = response.data.success
          showAlert(
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

    async _getRegister(id: number | string | string[]) {
      this.formDataRole = null
      await executeApi()
        .get(`${URL_PATH_USERS_ROLES}/${id}`)
        .then((response) => {
          this.formDataRole = response.data.data
          if (this.formDataRole) {
            this.formDataRole.permissions = response.data.data.permissions?.map(
              (e: IPermissionRole) => ({
                ...e,
                children: e.children.map((i) =>
                  i.status === 'Permitido' ? { ...i, isChecked: true } : i
                ),
              })
            )
          }

          showAlert(response.data.message, 'success', undefined, TIMEOUT_ALERT)
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    async _changeStatusRegister(
      id: number | string | null,
      jsonOptionsInactive: IJsonOptionsInactive | null
    ) {
      openMainLoader(true)
      try {
        const response = await executeApi().put(
          `${URL_PATH_USERS_ROLES}/change-status/${id}`,
          jsonOptionsInactive
        )
        showAlert(response.data.message, 'success', undefined, TIMEOUT_ALERT)
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
      } finally {
        openMainLoader(false)
      }
    },

    async _deleteRegister(id: number | string | null) {
      openMainLoader(true)
      try {
        const response = await executeApi().delete(
          `${URL_PATH_USERS_ROLES}/${id}`
        )
        this.roles = response.data.data
        showAlert(response.data.message, 'success', undefined, TIMEOUT_ALERT)
      } catch (e) {
        const error = e as IErrors
        showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
      } finally {
        openMainLoader(false)
      }
    },

    async _downloadRegisters(params: string) {
      await executeApi()
        .get(`${URL_PATH_USERS_ROLES}/export?${params}`, {
          responseType: 'arraybuffer',
        })
        .then((response) => {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          })

          const name = useUtils().getNameBlob(response)
          useUtils().downloadBlobXlxx(blob, name)
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error', undefined, TIMEOUT_ALERT)
        })
    },

    // Store Methods
    _setStoreRolesInfo(state: IRolesList[]) {
      this.rolesList = state
    },

    _setStoreFirtsTime() {
      this.firtsTime = this.firtsTime + 1
    },

    _setStoreFormDataRole(dataRole: IFormDataRole | null) {
      this.formDataRole = dataRole
    },

    _setStorePermissionsDataRole(permission: string[]) {
      if (this.formDataRole) {
        this.formDataRole.permissions = permission
      }
    },

    _setUrlExportXlsx(value: null) {
      this.urlExportXlsx = value
    },

    _setStoreValidateForm(value: boolean) {
      this.validateForm = value
    },
  },
})
