/* eslint-disable @typescript-eslint/no-explicit-any */

// Pinia - Core
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import { IErrors } from '@/interfaces/global/errorMessage'
import { IGenericResource } from '@/interfaces/customs'
import { URL_PATH_AUDIT } from '@/constants/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

const initialState = () => ({
  version: 'v1',
  authentication_type: [] as IGenericResource[],
})

export const useAuditResourcesV1 = defineStore('audit-resources-v1', {
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
    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (values: never[], key: string | undefined) => void
      > = {}

      await executeApi()
        .get(`${URL_PATH_AUDIT}/select-tables${params}`)
        .then((response) => {
          if (!response.status) return
          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              const arrValue = Array.isArray(value) ? (value as never[]) : []
              customHandlers[key](arrValue, key)
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
