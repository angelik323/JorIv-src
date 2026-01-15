import { defineStore } from 'pinia'

// Interfaces & types
import {
  IGenericResource,
  ISelectorResources,
  ITaxTypesResource,
} from '@/interfaces/customs'
import { IErrors } from '@/interfaces/global'

// Http client
import { executeApi } from '@/apis'

// Constants
import { URL_PATH_TAX_RESOURCES } from '@/constants/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  signs: [] as IGenericResource[],
  scopes: [] as IGenericResource[],
  usages: [] as IGenericResource[],
  tax_types: [] as ITaxTypesResource[],
  jurisdictions: [] as IGenericResource[],
  dian_tax_types: [] as IGenericResource[],
})

export const useTaxResourcesV1 = defineStore('tax-resources-v1', {
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

    assignTaxTypes(data: ITaxTypesResource[]) {
      this.tax_types =
        data?.map((type: ITaxTypesResource) => ({
          ...type,
          value: type.id ?? '',
          label: type.name ?? '',
        })) ?? []
    },

    assignJurisdictions(data: ISelectorResources[]) {
      this.jurisdictions =
        data?.map((type: ISelectorResources) => ({
          value: type.id,
          label: type.name,
        })) ?? []
    },

    assignDianTaxTypes(data: ISelectorResources[]) {
      this.dian_tax_types =
        data?.map((type: ISelectorResources) => ({
          value: type.id,
          label: type.name,
        })) ?? []
    },

    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (values: never[], key: string | undefined) => void
      > = {
        tax_types: this.assignTaxTypes,
        jurisdictions: this.assignJurisdictions,
        dian_tax_types: this.assignDianTaxTypes,
      }
      await executeApi()
        .get(`${URL_PATH_TAX_RESOURCES}${params}`)
        .then((response) => {
          if (!response.status) return
          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              const arrValue = Array.isArray(value) ? (value as never[]) : []
              customHandlers[key](arrValue, key)
            } else if (key in this.$state) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
