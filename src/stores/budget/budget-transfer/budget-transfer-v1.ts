//Core
import { executeApi } from '@/apis'
import { defineStore } from 'pinia'
//Composables
import { useShowError } from '@/composables/useShowError'
import { useAlert } from '@/composables/useAlert'
//Interfaces
import {
  IBudgetTransferList,
  IBudgetTransferCreate,
  IBudgetTransferModel,
  IBudgetTransferCreatePayload,
} from '@/interfaces/customs/budget/BudgetTransfer'
import type { IErrors } from '@/interfaces/global/errorMessage'
//Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { URL_PATH_BUDGET } from '@/constants/apis'

const { showAlert } = useAlert()
const { showCatchError } = useShowError()
const URL_PATH = `${URL_PATH_BUDGET}/budget-transfers`

export const useBudgetTransferStoreV1 = defineStore(
  'budget-transfer-store-v1',
  {
    state: () => ({
      version: 'v1',
      models_origin: [] as IBudgetTransferModel[],
      models_destination: [] as IBudgetTransferModel[],
      budget_selected_business: 0 as number,
      resetTrigger: 0 as number,
      models: null as IBudgetTransferList | null,
    }),
    actions: {
      setBudgetTransferCreate(data: IBudgetTransferCreate | IBudgetTransferList) {
        // Convertir IBudgetTransferCreate a IBudgetTransferList agregando los campos faltantes
        const budgetTransferList: IBudgetTransferList = {
          ...data,
          budget_document_type_id_description: 'budget_document_type_id_description' in data 
            ? data.budget_document_type_id_description 
            : '',
          code_movement_id_description: 'code_movement_id_description' in data 
            ? data.code_movement_id_description 
            : '',
          third_party_requester_id_description: 'third_party_requester_id_description' in data 
            ? data.third_party_requester_id_description 
            : '',
        }
        this.models = budgetTransferList
      },

      setBudgetSelectedBusiness(businessId: number) {
        this.budget_selected_business = businessId
      },

      setModelsOrigin(rows: IBudgetTransferModel[]) {
        this.models_origin = rows
      },

      setModelsDestination(rows: IBudgetTransferModel[]) {
        this.models_destination = rows
      },

      resetAll() {
        this.models_origin = []
        this.models_destination = []
        this.budget_selected_business = 0
        this.models = null
        this.resetTrigger += 1
      },

      async createAction(payload: IBudgetTransferCreatePayload) {
        try {
          const response = await executeApi().post(`${URL_PATH}`, payload)
          const { message, success } = response.data

          showAlert(
            message,
            success ? 'success' : 'error',
            undefined,
            TIMEOUT_ALERT
          )

          return !!success
        } catch (error: unknown) {
          showAlert(
            showCatchError(error as IErrors),
            'error',
            undefined,
            TIMEOUT_ALERT
          )
          return false
        }
      },
    },
  }
)
