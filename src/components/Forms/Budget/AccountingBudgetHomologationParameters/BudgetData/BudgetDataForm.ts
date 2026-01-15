// Core
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IAccountingBudgetHomologationParameterModel,
  IAccountingBudgetParameterItem,
} from '@/interfaces/customs/budget/BudgetAccountingHomologationParameters'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useBudgetDataForm = (props: {
  action: ActionType
  data?: IAccountingBudgetParameterItem
}) => {
  const {
    budget_resource_codes,
    areas_resposabilities_codes,
    budget_document_types,
    budget_item_codes,
    code_movements,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const formRef = ref()

  const models = ref<Partial<IAccountingBudgetHomologationParameterModel>>({
    budget_resource_id: null,
    budget_resource_description: null,
    responsability_area_id: null,
    responsability_area_description: null,
    budget_document_type_id: null,
    budget_document_type_description: null,
    budget_resource_type_id: null,
    budget_resource_type_description: null,
    budget_item_id: null,
    budget_item_description: null,
    code_movement_id: null,
    code_movement_description: null,
  })

  watch(
    () => props.data,
    () => {
      if (props.data)
        models.value = {
          budget_resource_id: props.data.budget_resource.id || null,
          budget_resource_description: `${
            props.data.budget_resource?.code || null
          } - ${props.data.budget_resource?.description || null}`,
          responsability_area_id: props.data.responsability_area?.id || null,
          responsability_area_description: `${
            props.data.responsability_area?.code || null
          } - ${props.data.responsability_area?.description || null}`,
          budget_document_type_id: props.data.budget_document_type?.id || null,
          budget_document_type_description: `${
            props.data.budget_document_type?.code || null
          } - ${props.data.budget_document_type?.description || null}`,
          code_movement_id: props.data.code_movement?.id || null,
          code_movement_description: `${
            props.data.code_movement?.code || null
          } - ${props.data.code_movement?.description || null}`,
          budget_item_id: props.data.budget_item?.id || null,
          budget_item_description: `${props.data.budget_item?.code || null} - ${
            props.data.budget_item?.description || null
          }`,
        }
    }
  )

  const selectedResource = computed(() =>
    budget_resource_codes.value.find(
      (item) => item.value === models.value.budget_resource_id
    )
  )

  const selectedArea = computed(() =>
    areas_resposabilities_codes.value.find(
      (item) => item.value === models.value.responsability_area_id
    )
  )

  const selectedDocumentType = computed(() =>
    budget_document_types.value.find(
      (item) => item.value === models.value.budget_document_type_id
    )
  )

  const selectedMovementCode = computed(() =>
    code_movements.value.find(
      (item) => item.id === models.value.code_movement_id
    )
  )

  const selectedBudgetItem = computed(() =>
    budget_item_codes.value.find(
      (item) => item.value === models.value.budget_item_id
    )
  )

  return {
    models,
    formRef,
    selectedArea,
    code_movements,
    selectedResource,
    budget_item_codes,
    selectedBudgetItem,
    selectedDocumentType,
    selectedMovementCode,
    budget_resource_codes,
    budget_document_types,
    areas_resposabilities_codes,
  }
}

export default useBudgetDataForm
