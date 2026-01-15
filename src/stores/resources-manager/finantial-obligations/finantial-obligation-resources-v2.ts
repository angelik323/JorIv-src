/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_FINANCIAL_OBLIGATION } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v2',
  periodicities: [] as IResource[],
  calculation_methods: [] as IResource[],
  base_calculations: [] as IResource[],
  quota_types: [] as IResource[],
  amortization_types: [] as IResource[],
  register_statuses: [] as IResource[],
  factors: [] as IResource[],
  credit_types: [] as IResource[],
  obligation_statuses: [] as IResource[],
})

export const useFinantialObligationResourcesV2 = defineStore(
  'finantial-obligation-resources-v2',
  {
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

      assignPeriodicities(periodicities: []) {
        this.periodicities = periodicities.map(
          (item: { label?: string; value?: number; id?: number; name?: string }) => ({
            label: item.label ?? item.name ?? '',
            value: item.value ?? item.id ?? 0,
          })
        )
      },

      assignRegisterStatuses(register_statuses: []) {
        this.register_statuses = register_statuses.map(
          (item: { label?: string; value?: string; id?: number; name?: string }) => ({
            label: item.label ?? item.name ?? '',
            value: item.value ?? item.id ?? '',
          })
        )
      },

      assignFactors(factors: []) {
        this.factors = factors.map(
          (item: { label?: string; value?: number; id?: number; name?: string }) => ({
            label: item.label ?? item.name ?? '',
            value: item.value ?? item.id ?? 0,
          })
        )
      },

      assignCreditTypes(credit_types: []) {
        this.credit_types = credit_types.map(
          (item: { label?: string; value?: number; id?: number; name?: string }) => ({
            label: item.label ?? item.name ?? '',
            value: item.value ?? item.id ?? 0,
          })
        )
      },

      assignObligationStatuses(obligation_statuses: []) {
        this.obligation_statuses = obligation_statuses.map(
          (item: { label?: string; value?: number; id?: number; name?: string }) => ({
            label: item.label ?? item.name ?? '',
            value: item.value ?? item.id ?? 0,
          })
        )
      },

      async getResources(params: string) {
        const customHandlers: Record<
          string,
          (value: any, key: string | undefined) => void
        > = {
          periodicities: this.assignPeriodicities,
          register_statuses: this.assignRegisterStatuses,
          factors: this.assignFactors,
          credit_types: this.assignCreditTypes,
          obligation_statuses: this.assignObligationStatuses,
        }

        await executeApi()
          .get(`${URL_PATH_FINANCIAL_OBLIGATION}/select-tables-v2${params}`)
          .then((response) => {
            if (!response.status) return
            Object.entries(response.data.data).forEach(([key, value]) => {
              if (
                !value ||
                typeof value === 'string' ||
                value instanceof String
              )
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
  }
)
