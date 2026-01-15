/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  IGenericResource,
  IScheduleResources,
  ISelectorResources,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_SCHEDULES } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = (): IScheduleResources => ({
  version: 'v1',
  users_by_name: [],
  business: [],
  role: [],
  notifications_modules: [],
  notifications_statuses: [] as IGenericResource[],
  users: [] as IGenericResource[],
  users_to_notify: [] as IGenericResource[],
})

export const useScheduleResourcesV1 = defineStore('schedule-resources-v1', {
  state: initialState,
  actions: {
    resetKeys<K extends keyof IScheduleResources>(keys: K[]) {
      const defaultState = initialState()
      keys.forEach((key) => {
        this.$state[key] = defaultState[key]
      })
    },
    assignMapIdName(resources: [], key: string | undefined) {
      if (!key) return
      ;(this as any)[key] =
        resources.map((item: ISelectorResources) => ({
          id: item.id,
          name: item.name,
        })) || []
    },
    assignMapNameEmail(users_by_name: []) {
      this.users_by_name = users_by_name.map((item: ISelectorResources) => ({
        id: item.id,
        name: `${item.name} - ${item.email}`,
      }))

      this.users = users_by_name.map((item: ISelectorResources) => ({
        value: item.id,
        label: `${item.name} - ${item.email}`,
      }))

      this.users_to_notify = users_by_name.map((item: ISelectorResources) => ({
        value: item.id,
        label: `${item.document} - ${item.name} ${item.last_name}`,
      }))
    },
    assignRoles(roles: []) {
      this.role = roles.map((item: ISelectorResources) => ({
        id: item.id,
        name: item.name,
      }))
    },
    assignStatus(notifications_statuses: []) {
      this.notifications_statuses = notifications_statuses.map(
        (item: ISelectorResources) => ({
          value: item.id,
          label: item.status,
        })
      )
    },
    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (value: any, key: string | undefined) => void
      > = {
        users_by_name: this.assignMapNameEmail,
        business: this.assignMapIdName,
        roles: this.assignRoles,
        notifications_statuses: this.assignStatus,
      }

      await executeApi()
        .get(`${URL_PATH_SCHEDULES}/select-tables${params}`)
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
  persist: true,
})
