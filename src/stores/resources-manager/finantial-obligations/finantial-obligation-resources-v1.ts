/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  ISelectorResources,
  IFinancialObligationResource,
  IPaymentPlanQuotasResource,
} from '@/interfaces/customs'
import { IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_FINANCIAL_OBLIGATION } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  obligation_status: [] as IResource[],
  credit_types: [] as IResource[],
  periodicity_types: [] as IResource[],
  financial_obligations: [] as IFinancialObligationResource[],
  payment_plan_quotas: [] as IPaymentPlanQuotasResource[],
})

export const useFinantialObligationResourcesV1 = defineStore(
  'finantial-obligation-resources-v1',
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
      assignMapIdName(resources: [], key: string | undefined) {
        if (!key) return
        ;(this as any)[key] =
          resources.map((item: ISelectorResources | IResource) => ({
            ...item,
            value: item.id,
            label: `${item.name}`,
          })) || []
      },
      assignObligationStatuses(obligation_statuses: []) {
        this.obligation_status = obligation_statuses.map(
          (item: ISelectorResources) => ({
            label: item.name,
            value: item.id,
          })
        )
      },
      assignCreditTypes(credit_types: []) {
        this.credit_types = credit_types.map((item: ISelectorResources) => ({
          label: item.name,
          value: item.id,
        }))
      },
      assignFinantialObligations(financial_obligations: []) {
        this.financial_obligations =
          financial_obligations?.map((item: IFinancialObligationResource) => ({
            ...item,
            value: item.id ?? '',
            label: `${item.obligation_number}`,
          })) ?? []
      },
      assignPaymentPlanQuotas(payment_plan_quotas: []) {
        this.payment_plan_quotas =
          payment_plan_quotas?.map((item: IPaymentPlanQuotasResource) => ({
            ...item,
            value: item.id ?? '',
            label: item.status_quota.name,
          })) ?? []
      },

      async getResources(params: string) {
        const customHandlers: Record<
          string,
          (value: any, key: string | undefined) => void
        > = {
          obligation_statuses: this.assignObligationStatuses,
          credit_types: this.assignCreditTypes,
          financial_obligations: this.assignFinantialObligations,
          payment_plan_quotas: this.assignPaymentPlanQuotas,
        }

        await executeApi()
          .get(`${URL_PATH_FINANCIAL_OBLIGATION}/select-tables${params}`)
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
