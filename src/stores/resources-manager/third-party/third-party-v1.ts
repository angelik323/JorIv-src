/* eslint-disable @typescript-eslint/no-explicit-any */
import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import { defineStore } from 'pinia'

import { THIRD_PARTY_API_URL } from '@/constants/apis'
import {
  IThirdPartyResource,
  IThirdPartyResourceGeneric,
} from '@/interfaces/customs/resources/ThirdParty'
import { IGenericResource, ISelectorResources } from '@/interfaces/customs'
import { IErrors, IResource } from '@/interfaces/global'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  third_parties: [] as IThirdPartyResourceGeneric[],
  document_types_third_party_fideicomiso: [] as IResource[],
  ciius: [] as IGenericResource[],
  cities: [] as IGenericResource[],
  indirect_third_party_request_types: [] as IGenericResource[],
  document_types: [] as IGenericResource[],
  third_parties_beneficiary: [] as IThirdPartyResourceGeneric[],
})

export const useThirdPartyV1 = defineStore('third-party-resources-v1', {
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

    assignDocumentTypes(data: ISelectorResources[]) {
      this.document_types_third_party_fideicomiso = data.map((type) => ({
        label: type.name,
        value: type.id,
      }))
    },

    assignThirdParty(thirds_parties: IThirdPartyResource[]) {
      this.third_parties = thirds_parties.map((item) => {
        const name = item.natural_person
          ? item.natural_person?.full_name ?? ''
          : item.legal_person?.business_name ?? ''

        const label = [
          item.document_type?.abbreviation ?? '',
          item.document ?? '',
          name,
        ]
          .filter(Boolean)
          .join(' - ')

        return {
          ...item,
          value: item.id,
          label: label ?? '',
          document: item.document ?? '',
          document_type: item.document_type ?? '',
          name: name ?? '',
        }
      })
    },

    assignCiius(ciius: []) {
      this.ciius =
        ciius.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.code} - ${item.description}`,
        })) ?? []
    },

    assignCities(cities: []) {
      this.cities =
        cities.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? '',
          label: `${item.code} - ${item.name}`,
        })) ?? []
    },

    assignThirdPartyDocumentTypes(document_types: []) {
      this.document_types = document_types.map((item: IGenericResource) => ({
        ...item,
        value: item.id ?? '',
        label: item.name ?? '',
      }))
    },

    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (value: any, key: string | undefined) => void
      > = {
        'third-parties': this.assignThirdParty,
        third_parties: this.assignThirdParty,
        ciius: this.assignCiius,
        cities: this.assignCities,
        document_types_third_party_fideicomiso: this.assignDocumentTypes,
        document_types: this.assignThirdPartyDocumentTypes,
      }

      await executeApi()
        .get(`${THIRD_PARTY_API_URL}select-tables${params}`)
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
