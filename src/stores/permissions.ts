import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IPermissionListData } from '@/interfaces/global/Permission'
import { defineStore } from 'pinia'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

// Constants
import { URL_PATH_USERS_ROLES_PERMISSIONS } from '@/constants/apis'

export const usePermissionStore = defineStore('permissions', {
  state: () => {
    return {
      permissionListData: [] as IPermissionListData[] | [],
      roleId: null as number | null,
    }
  },
  actions: {
    async getPermissionList(role: number | null): Promise<boolean> {
      this.permissionListData = []
      this.roleId = role ?? null
      const params = {
        'filter[role]': role,
      }
      let success = false
      await executeApi()
        .get(`${URL_PATH_USERS_ROLES_PERMISSIONS}`, {
          params: params,
        })
        .then((response) => {
          success = response.data.success
          this.permissionListData = response.data.data
        })
        .catch((error) => {
          showAlert(showCatchError(error), 'error')
        })

      return success
    },
  },
})
