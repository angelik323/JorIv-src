// Core
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IBalanceValidationItemModel } from '@/interfaces/customs/budget/BudgetDocumentTypes'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useSingleBalanceValidationForm = (props: {
  action: WriteActionType
  data?: IBalanceValidationItemModel
}) => {
  const {
    budget_level_for_documents: budget_levels,
    budget_document_validities,
    budget_document_numbering_types,
    budget_document_expiration_periodicities,
    code_movements_types_contracting: code_movements,
    budget_document_transfer_type: budget_document_types_selector,
    accounting_budget_mapping_parameters,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const { defaultIconsLucide } = useUtils()

  const formRef = ref()

  const models = ref<IBalanceValidationItemModel>({
    accounting_budget_mapping_parameter_id: null,
    budget_item_structure: null,
    resource_structure: null,
    area_structure: null,
    code_movement_id: null,
    movement_code_description: null,
    balance_validation_level_id: null,
    balance_validation_level_description: null,
    validates_document_type: false,
    validated_document_type_id: null,
    validated_document_type_description: null,
  })

  const selectBudgetStructure = (
    accounting_budget_mapping_parameter_id: number
  ) => {
    models.value.accounting_budget_mapping_parameter_id =
      accounting_budget_mapping_parameter_id
    const selectedBudgetStructure =
      accounting_budget_mapping_parameters.value.find(
        (item) => item.id === accounting_budget_mapping_parameter_id
      )

    if (!selectedBudgetStructure) return
    models.value.budget_item_structure = `${selectedBudgetStructure.budgetItem.code} - ${selectedBudgetStructure.budgetItem.description}`
    models.value.resource_structure = `${selectedBudgetStructure.budgetResource.code} - ${selectedBudgetStructure.budgetResource.description}`
    models.value.area_structure = `${selectedBudgetStructure.responsabilityArea.code} - ${selectedBudgetStructure.responsabilityArea.description}`
  }

  watch(
    () => props.data,
    () => {
      if (props.data) {
        models.value = { ...props.data }
        if (props.data.accounting_budget_mapping_parameter_id) {
          selectBudgetStructure(
            props.data.accounting_budget_mapping_parameter_id
          )
        }
      }
    },
    { immediate: true }
  )

  return {
    models,
    formRef,
    budget_levels,
    code_movements,
    defaultIconsLucide,
    budget_document_validities,
    budget_document_types_selector,
    budget_document_numbering_types,
    accounting_budget_mapping_parameters,
    budget_document_expiration_periodicities,
    selectBudgetStructure,
  }
}

export default useSingleBalanceValidationForm
