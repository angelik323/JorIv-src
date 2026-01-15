/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// Composables
import { useAlert, useShowError } from '@/composables'

// Constants
import { URL_PATH_NORMATIVE } from '@/constants/apis'

// Interfaces
import { IErrors } from '@/interfaces/global'
import { IGenericResource } from '@/interfaces/customs/resources/Common'
import {
  ITestNormativeResource,
  IEquivalencyParametersFormatsResource,
  IEquivalencyParametersConceptsResource,
  ICertificateTypesResource,
} from '@/interfaces/customs/resources/Normative'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  test_normative_key: [] as ITestNormativeResource[],
  test_normative_key_label_id: [] as ITestNormativeResource[],
  person_types: [] as IGenericResource[],
  certificates: [] as IGenericResource[],
  certificate_type_id: [] as IGenericResource[],
  fixed_variables: [] as IGenericResource[],
  equivalency_parameters_formats: [] as IEquivalencyParametersFormatsResource[],
  equivalency_parameters_concepts:
    [] as IEquivalencyParametersConceptsResource[],
  certificate_types: [] as IGenericResource[],
})

export const useNormativeResourcesV1 = defineStore('normative-resources-v1', {
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

    assignCertifiedTypes(items: IGenericResource[]) {
      this.certificate_types =
        items.map((item: IGenericResource) => ({
          value: item.id ?? 0,
          label: `${item.name}`,
        })) ?? []
    },

    assignPersonTypes(items: IGenericResource[]) {
      this.person_types =
        items.map((item: IGenericResource) => ({
          value: item.id ?? 0,
          label: `${item.name}`,
        })) ?? []
    },

    assignCertificates(items: IGenericResource[]) {
      this.certificates =
        items.map((item: IGenericResource) => ({
          value: item.id ?? 0,
          label: `${item.name}`,
        })) ?? []
    },

    assignFixedVariables(items: IGenericResource[]) {
      this.fixed_variables =
        items.map((item: IGenericResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.name}`,
        })) ?? []
    },

    assignEquivalencyParametersFormats(items: []) {
      this.equivalency_parameters_formats =
        items.map((item: IEquivalencyParametersFormatsResource) => ({
          ...item,
          value: item.id ?? 0,
          label: item.name ?? '',
        })) ?? []
    },

    assignEquivalencyParametersConcepts(items: []) {
      this.equivalency_parameters_concepts =
        items.map((item: IEquivalencyParametersConceptsResource) => ({
          ...item,
          value: item.id ?? 0,
          label: item.name ?? '',
        })) ?? []
    },

    assignCertificateTypes(items: []) {
      this.certificate_types =
        items.map((item: ICertificateTypesResource) => ({
          ...item,
          value: item.id ?? 0,
          label: `${item.test} - ${item.name}`,
        })) ?? []
    },

    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (value: any, key: string | undefined) => void
      > = {
        certificate_types: this.assignCertifiedTypes,
        person_types: this.assignPersonTypes,
        certificates: this.assignCertificates,
        fixed_variables: this.assignFixedVariables,
        equivalency_parameters_formats: this.assignEquivalencyParametersFormats,
        equivalency_parameters_concepts:
          this.assignEquivalencyParametersConcepts,
      }
      await executeApi()
        .get(`${URL_PATH_NORMATIVE}/select-tables${params}`)
        .then((response) => {
          if (!response.status) return
          Object.entries(response.data.data).forEach(([key, value]) => {
            if (!value || typeof value === 'string' || value instanceof String)
              return
            if (customHandlers[key]) {
              customHandlers[key](value, key)
            } else if (key in this.$state) {
              const state = this.$state as unknown as Record<string, unknown>
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
})
