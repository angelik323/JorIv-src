// pinia
import { defineStore } from 'pinia'
import { executeApi } from '@/apis'

// interfaces
import { IErrors } from '@/interfaces/global'
import {
  ISettlementConceptsCreatePayload,
  ISettlementConceptsForm,
  ISettlementConceptItem,
  ISettlementConceptsUpdatePayload,
  IBackendSettlementConcept,
} from '@/interfaces/customs/accounts-payable/SettlementConcepts'

// composables
import { useAlert, useShowError } from '@/composables'

// constants
import { URL_PATH_ACCOUNTS_PAYABLE } from '@/constants/apis'
import { TIMEOUT_ALERT } from '@/constants/alerts'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()


const transformBackendToForm = (
  data: IBackendSettlementConcept
): ISettlementConceptsForm => {
  return {
    id: data.id,
    structure_id: data.structure?.id ?? null,
    structure_label: data.structure
      ? `${data.structure.code} - ${data.structure.structure}`
      : null,
    concept_code: data.concept ?? null,
    description: data.concept_description ?? null,
    type: data.type ?? null,
    apply_iva: data.apply_iva ?? false,
    class: data.class ?? null,
    percentage: data.percentage ? Number(data.percentage) : null,
    has_minimum_uvt: data.has_minimum_uvt ?? false,
    min_withholding_uvt: data.min_withholding_uvt ?? null,
    min_withholding_iva_uvt: data.min_withholding_iva_uvt ?? null,
    min_withholding_pesos: data.min_withholding_pesos ?? null,
    min_withholding_iva_pesos: data.min_withholding_iva_pesos ?? null,
    plan_account_id: data.plan_account?.id ?? null,
    plan_account_label: data.plan_account
      ? `${data.plan_account.code} - ${
          data.plan_account.description ?? data.plan_account.name ?? ''
        }`
      : null,
    liability_account_id: data.liability_account?.id ?? null,
    liability_account_label: data.liability_account
      ? `${data.liability_account.code} - ${data.liability_account.name ?? ''}`
      : null,
    expense_account_id: data.expense_account?.id ?? null,
    expense_account_label: data.expense_account
      ? `${data.expense_account.code} - ${data.expense_account.name ?? ''}`
      : null,
    fiscal_charge_id: data.fiscal_charge?.id ?? null,
    fiscal_charge_label: data.fiscal_charge
      ? `${data.fiscal_charge.code} - ${data.fiscal_charge.name ?? ''}`
      : null,
    credit_notes_account_id: data.credit_notes_account?.id ?? null,
    credit_notes_account_label: data.credit_notes_account
      ? `${data.credit_notes_account.code} - ${
          data.credit_notes_account.name ?? ''
        }`
      : null,
    status_id: data.status?.id ?? null,
    created_at: data.created_at ?? null,
    updated_at: data.updated_at ?? null,
  }
}

export const useSettlementConceptsStoreV1 = defineStore(
  'settlement-concepts-store-v1',
  {
    state: () => ({}),

    actions: {
      async _getSettlementConceptsList(
        params: Record<string, string | number>
      ) {
        const responseData = {
          pages: {
            currentPage: 1,
            lastPage: 1,
          },
          data: [] as ISettlementConceptItem[],
        }

        await executeApi()
          .get(`${URL_PATH_ACCOUNTS_PAYABLE}/settlement-concepts`, {
            params: { ...params, paginate: 1, order_by: 'id,desc' }
          })
          .then((response) => {
            const {
              data: { data: items = [], current_page = 0, last_page = 0 },
              message,
              success,
            } = response.data

            responseData.data = items
            responseData.pages = {
              currentPage: current_page,
              lastPage: last_page,
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return responseData
      },

      async _toggleStatusSettlementConcept(id: number) {
        let success = false
        await executeApi()
          .patch(
            `${URL_PATH_ACCOUNTS_PAYABLE}/settlement-concepts/${id}/toggle-status`
          )
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return success
      },

      async _createSettlementConcept(
        payload: ISettlementConceptsCreatePayload
      ) {
        let success = false
        await executeApi()
          .post(`${URL_PATH_ACCOUNTS_PAYABLE}/settlement-concepts`, payload)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _deleteSettlementConcept(id: number) {
        let success = false
        await executeApi()
          .delete(`${URL_PATH_ACCOUNTS_PAYABLE}/settlement-concepts/${id}`)
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },

      async _getSettlementConceptById(id: number): Promise<ISettlementConceptsForm | null> {
        let responseData: ISettlementConceptsForm | null = null
        await executeApi()
          .get(`${URL_PATH_ACCOUNTS_PAYABLE}/settlement-concepts/${id}`)
          .then((response) => {
            const { data, message, success } = response.data
            if (success) {
              responseData = transformBackendToForm(data)
            }

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })
        return responseData
      },

      async _updateSettlementConcept(
        payload: ISettlementConceptsUpdatePayload,
        id: number
      ) {
        let success = false
        await executeApi()
          .put(
            `${URL_PATH_ACCOUNTS_PAYABLE}/settlement-concepts/${id}`,
            payload
          )
          .then((response) => {
            const { message } = response.data
            success = response.data?.success ?? false

            showAlert(
              message,
              success ? 'success' : 'error',
              undefined,
              TIMEOUT_ALERT
            )
          })
          .catch((e) => {
            const error = e as IErrors
            const message = showCatchError(error)
            showAlert(message, 'error', undefined, TIMEOUT_ALERT)
          })

        return success
      },
    },
  }
)