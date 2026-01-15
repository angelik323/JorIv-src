// Core - Pinia - API
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'

// Interfaces - Constants
import { HandlerFn } from '@/interfaces/customs/resources'
import { URL_PATH_SEIZURES } from '@/constants/apis'
import { IErrors } from '@/interfaces/global'

// Composables
import { useAlert, useShowError } from '@/composables'
import {
  ICourtResource,
  IManagementAreaResource,
  IProcessTypeResource,
  ISeizureAssetsProductsTypeResource,
  ISeizureProcedureTypeResource,
  ISeizureStatusResource,
  ITypeDefendantResource,
} from '@/interfaces/customs/resources/Seizures'

const { showCatchError } = useShowError()
const { showAlert } = useAlert()

const initialState = () => ({
  version: 'v1',
  seizure_assets_products_types: [] as ISeizureAssetsProductsTypeResource[],
  management_areas: [] as IManagementAreaResource[],
  courst: [] as ICourtResource[],
  process_types: [] as IProcessTypeResource[],
  type_defendants: [] as ITypeDefendantResource[],
  seizure_status: [] as ISeizureStatusResource[],
  procedures_type: [] as ISeizureProcedureTypeResource[],
})

export const useSeizuresResourcesV1 = defineStore('seizures-resources-v1', {
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

    assignSeizureAssetsProductsTypes(value: unknown, _key?: string) {
      const items = value as ISeizureAssetsProductsTypeResource[]
      this.seizure_assets_products_types = items.map((item) => ({
        ...item,
        label: item.description,
        value: item.id,
      }))
    },
    assignManagementAreas(value: unknown, _key?: string) {
      const items = value as IManagementAreaResource[]
      this.management_areas = items.map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    },
    assignCourts(value: unknown, _key?: string) {
      const items = value as ICourtResource[]
      this.courst = items.map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    },
    assignProcessType(value: unknown, _key?: string): void {
      const items = value as IProcessTypeResource[]
      this.process_types = items.map((item: IProcessTypeResource) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    },
    assignTypeDefendants(value: unknown) {
      const items = value as ITypeDefendantResource[]
      this.type_defendants = items.map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }))
    },
    assignSeizureStatus(value: unknown) {
      const items = value as ISeizureStatusResource[]
      this.seizure_status = items.map((item) => ({
        ...item,
        label: item.status,
        value: item.id,
      }))
    },
    assignProceduresType(value: unknown) {
      const items = value as ISeizureProcedureTypeResource[]
      this.procedures_type = items.map((item) => ({
        ...item,
        label: item.description,
        value: item.id,
      }))
    },

    async getResources(params: string) {
      const customHandlers: Record<string, HandlerFn> = {
        seizure_assets_products_types: this.assignSeizureAssetsProductsTypes,
        management_areas: this.assignManagementAreas,
        courst: this.assignCourts,
        process_types: this.assignProcessType,
        type_defendants: this.assignTypeDefendants,
        seizure_status: this.assignSeizureStatus,
        procedures_type: this.assignProceduresType,
      }

      await executeApi()
        .get(`${URL_PATH_SEIZURES}/select-tables${params}`)
        .then((response) => {
          if (!response.status) return
          const state = this.$state as unknown as Record<string, unknown>
          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              customHandlers[key](value, key)
            } else if (key in this.$state) {
              state[key] = value
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
