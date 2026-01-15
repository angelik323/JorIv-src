import { IPermissionListData } from '@/interfaces/global/Permission'
import { defineStore, storeToRefs } from 'pinia'
import { useUserStore } from '@/stores'

export const usePermissionFormStore = defineStore('permission-form', {
  state: () => {
    return {
      permissionList: [] as IPermissionListData[] | [],
      permissions: [] as string[] | [],
      filteredItems: [] as IPermissionListData[] | [],
      table_list_permission: [] as any[] | [],
    }
  },
  actions: {
    _setPermissionListData(state: IPermissionListData[] | []) {
      this.permissionList = []
      if (state) {
        this.permissionList = state
        this.filteredItems = this.permissionList
      }
    },
    _setPermissionsData(state: string[] | null) {
      this.permissions = []
      if (state) this.permissions = state
    },
    _loadPermissionsData() {
      const { userData } = storeToRefs(useUserStore())
      if (userData.value?.permissions) {
        this.permissions = userData.value.permissions
          .filter((permission) => permission.status_id === 1)
          .map((permission) => permission.name)
      }
    },

    _setTableListPermissionChecked(state: any[] | []) {
      this.table_list_permission = []
      if (state) {
        this.table_list_permission = state
      }
    },
  },
})
