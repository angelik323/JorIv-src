// Core
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import {
  IBugdetDocumentTypeResponse,
  IDocumentTypeStoreModel,
} from '@/interfaces/customs/budget/BudgetDocumentTypes'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useBasicDataForm = (props: {
  action: WriteActionType
  data?: IBugdetDocumentTypeResponse
}) => {
  const {
    budget_level_for_documents: budget_levels,
    budget_document_validities,
    budget_document_numbering_types,
    budget_document_expiration_periodicities,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const formRef = ref()

  const models = ref<IDocumentTypeStoreModel>({
    budget_level_id: null,
    code: '',
    description: '',
    validity: null,
    requires_authorization: false,
    allows_adjustments: false,
    validity_closure: false,
    creates_new_document: false,
    allows_additions: false,
    allows_deductions: false,
    validates_area: false,
    requires_city: false,
    requires_balance_validation_by_document_type: false,
    has_expiration_date: false,
    expiration_periodicity: null,
    numbering_type: null,
  })

  watch(
    () => props.data,
    () => {
      if (props.data) models.value = { ...props.data }
    }
  )

  return {
    formRef,
    budget_levels,
    budget_document_validities,
    budget_document_numbering_types,
    budget_document_expiration_periodicities,
    models,
  }
}

export default useBasicDataForm
