import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Interfaces - Constants
import { IErrors } from '@/interfaces/global/errorMessage'
import { IGenericResource } from '@/interfaces/customs'
import { ICountryGafi } from '@/interfaces/customs/sarlaft/SarlaftParameterization'
import { URL_PATH_SARLAFT } from '@/constants/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

const initialState = () => ({
  version: 'v1',
  list_type_identification: [] as IGenericResource[],
  finding_list_origin_modules: [] as IGenericResource[],
  list_parameterized_cities: [] as ICountryGafi[],
})

export const useSarlaftResourcesV1 = defineStore('sarlaft-resources-v1', {
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
        (value: unknown, key: string | undefined) => void
      > = {}

      await executeApi()
        .get(`${URL_PATH_SARLAFT}/select-tables${params}`)
        .then((response) => {
          if (!response.status) return
          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              customHandlers[key](value, key)
            } else if (key in this.$state) {
              ;(this.$state as unknown as Record<string, unknown>)[key] = value
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
