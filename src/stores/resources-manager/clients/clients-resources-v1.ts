/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { IErrors } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_RESOURCES } from '@/constants/apis'
import {
  IGenericResource,
} from '@/interfaces/customs'
import { ICountry } from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  countries: [] as IGenericResource[],
  fiscal_responsability: [] as IGenericResource[],
  nationalities: [] as IGenericResource[],
  third_party_tin_options: [] as IGenericResource[],
})

export const useClientsResourcesV1 = defineStore(
  'clients-resources-v1',
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

      assignCountries(data: ICountry[]) {
        this.countries = data.map((item) => ({
          label: item.name,
          value: item.id,
          nationality: item.nationality,
        }))

        this.nationalities = data.map((item) => ({
          label: item.nationality,
          value: item.id,
        }))
      },
      async getResources(params: string) {
        const customHandlers: Record<
          string,
          (value: any, key: string | undefined) => void
        > = {
          countries: this.assignCountries
        }

        await executeApi()
          .get(`${URL_PATH_RESOURCES}${params}`)
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
