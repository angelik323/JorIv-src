/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  IAuditUserSubmodulesResource,
  IGenericResource,
  ISelectorResources,
  IUserBasicData,
} from '@/interfaces/customs'
import { IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_USERS } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  users: [] as IUserBasicData[],
  users_with_document: [] as IUserBasicData[],
  user_roles: [] as IGenericResource[],
  document_types_user: [] as IResource[],
  user_permissions: [] as IResource[],
  users_trader: [] as IGenericResource[],
  users_label_email: [] as IUserBasicData[],
  user_modules: [] as IGenericResource[],
  user_modules_labels: [] as IGenericResource[],
  user_submodules: [] as IAuditUserSubmodulesResource[],
})

export const useUserResourcesV1 = defineStore('user-resources-v1', {
  state: initialState,
  actions: {
    resetKeys(keys: (keyof ReturnType<typeof initialState>)[]) {
      const initial = initialState()
      const state = this.$state as unknown as Record<string, unknown>
      const initState = initial as Record<string, unknown>

      keys.forEach((key) => {
        state[key] = initState[key]
      })
    },
    assignUserRoles(roles: []) {
      this.user_roles =
        roles?.map((roles: ISelectorResources) => ({
          value: roles.id,
          label: roles.name,
          status_id: roles.status_id,
        })) ?? []
    },
    assignDocumentTypesUser(document_types_user: []) {
      this.document_types_user =
        document_types_user.map((document_types_user: ISelectorResources) => ({
          value: document_types_user.id,
          label:
            document_types_user.abbreviation + ': ' + document_types_user.name,
        })) ?? []
    },
    assignUsers(users: []) {
      ;(this.user_permissions = users ?? []),
        (this.users =
          users.map((users: IUserBasicData) => ({
            ...users,
            value: users.id,
            label: `${users.name} ${users.last_name}`,
          })) ?? [])

      this.users_with_document =
        users.map((user: IUserBasicData) => ({
          ...user,
          value: user.id,
          label: `${user.document} - ${user.name} ${user.last_name}`,
          label_display_name: `${user.document} - ${user.name.split(' ')[0]} ${
            user.last_name.split(' ')[0]
          }`,
        })) || []

      this.users_label_email =
        users.map((user: IUserBasicData) => ({
          ...user,
          value: user.id,
          label: user.email,
        })) || []
    },
    assignUsersTrader(users_trader: []) {
      this.users_trader = users_trader.map(
        (users_trader: ISelectorResources) => ({
          value: users_trader.id,
          label: users_trader.name,
          description: users_trader.document,
        })
      )
    },
    assignUsersModules(module_app: []) {
      this.user_modules = module_app.map((module_app: ISelectorResources) => ({
        value: module_app.id,
        label: module_app.description,
      }))

      this.user_modules_labels = module_app.map(
        (module_app: ISelectorResources) => ({
          value: module_app.description,
          label: module_app.description,
        })
      )
    },
    assignUsersSubmodules(submodule_app: IAuditUserSubmodulesResource[]) {
      this.user_submodules = submodule_app.map((submodule_app) => ({
        ...submodule_app,
        id: submodule_app.id,
        description: submodule_app.description,
        name: submodule_app.name,
        value: submodule_app.id,
        label: submodule_app.description,
      }))
    },
    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (value: any, key: string | undefined) => void
      > = {
        roles: this.assignUserRoles,
        user_roles: this.assignUserRoles,
        document_types_user: this.assignDocumentTypesUser,
        users: this.assignUsers,
        users_trader: this.assignUsersTrader,
        module_app: this.assignUsersModules,
        submodules_app: this.assignUsersSubmodules,
      }

      await executeApi()
        .get(`${URL_PATH_USERS}/select-tables${params}`)
        .then((response) => {
          if (!response.status) return
          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              customHandlers[key](value, key)
            } else if (key in this.$state) {
              ;(this as any)[key] = value
            }
          })
        })
        .catch((e) => {
          const error = e as IErrors
          showAlert(showCatchError(error), 'error')
        })
    },
  },
})
