/* eslint-disable @typescript-eslint/no-explicit-any */

import { executeApi } from '@/apis'
import { useAlert, useShowError } from '@/composables'
import {
  ISelectorResources,
  IInvoicesNotesResource,
  IGenericResource,
} from '@/interfaces/customs'
import { IErrors, IResource } from '@/interfaces/global'

import { defineStore } from 'pinia'

import { URL_PATH_BILLING } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()

const initialState = () => ({
  version: 'v1',
  invoices_notes: [] as IInvoicesNotesResource[],
  status_closure: [] as IGenericResource[],
  status_invoices: [] as IResource[],
  number_of_pay: [] as IResource[],
  payment_methods: [] as IResource[],
  status_support_document: [] as IResource[],
})

export const useBillingCollectV1 = defineStore('billing-collect-resources-v1', {
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

    assignInvoicesNotesResource(invoices_notes: IInvoicesNotesResource[]) {
      this.invoices_notes = invoices_notes
        .filter((item) => item.invoice_number)
        .map((item) => ({
          ...item,
          label: String(item.invoice_number),
          value: item.id,
        }))
    },

    assignNumbersOfPay(
      numbers_of_pay: Record<
        string,
        { amount?: number | string; code?: string }
      >
    ) {
      this.number_of_pay = Object.entries(numbers_of_pay).map(
        ([key, item]) => ({
          value: item.amount ?? '',
          label: item.code ?? key,
        })
      )
    },
    assignStatusInvoicesResource(status_invoices: IGenericResource[]) {
      this.status_invoices = status_invoices.map((item) => ({
        ...item,
        label: item.label ?? '',
        value: item.value ?? '',
      }))
    },

    assignStatusClosureResource(status_closure: IGenericResource[]) {
      this.status_closure = status_closure.map((item) => ({
        ...item,
        label: item.label ?? '',
        value: item.value ?? '',
      }))
    },

    assignPaymentMethodsResource(payment_methods: IResource[]) {
      this.payment_methods = payment_methods.map((item) => ({
        ...item,
        label: item.label,
        value: item.value,
      }))
    },

    assignStatusSupportDocumentResource(status: IResource[]) {
      this.status_support_document = status
    },

    async getResources(params: string) {
      const customHandlers: Record<
        string,
        (value: any, key: string | undefined) => void
      > = {
        invoices_notes: this.assignInvoicesNotesResource,
        status_closure: this.assignStatusClosureResource,
        'status-invoices': this.assignStatusInvoicesResource,
        'numbers-of-pay': this.assignNumbersOfPay,
        'payment-methods': this.assignPaymentMethodsResource,
        'status-support-document': this.assignStatusSupportDocumentResource,
      }

      await executeApi()
        .get(`${URL_PATH_BILLING}/select-tables${params}`)
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
