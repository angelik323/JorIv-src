// Core - Pinia - API
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces & types
import { IResourceBudgetForm } from '@/interfaces/customs/budget/ResourceBudget'
import { ActionType } from '@/interfaces/global'
// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useResourceBudgetForm = (
  props: {
    action: ActionType
    data?: IResourceBudgetForm
  },
  emit: Function
) => {
  const {
    budget_resources_types,
    budget_item_types,
    budget_items_statuses,
    account_structures,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const initialModel: IResourceBudgetForm = {
    id: undefined,
    status_id: 1,
    structure_resource: null,
    code: '',
    description: '',
    type: '',
    resource_type_id: null,
    has_bank_account: false,
  }

  const viewModel = ref<IResourceBudgetForm>({ ...initialModel })

  const models = ref<IResourceBudgetForm>({ ...initialModel })

  const formValidateElementRef = ref()

  watch(
    () => models.value,
    async () => {
      emit('update:modelValue', models.value)
    },
    { deep: true }
  )

  const setFormData = (data: IResourceBudgetForm) => {
    if (!data) return
    if (['create', 'edit'].includes(props.action)) {
      models.value.structure_resource = data.structure_resource ?? null
      models.value.code = data.code ?? ''
      models.value.description = data.description ?? ''
      models.value.type = data.type ?? ''
      models.value.resource_type_id = data.resource_type_id ?? null
      models.value.has_bank_account = !!data.has_bank_account
    } else if (['view'].includes(props.action)) {
      viewModel.value = { ...data }
    }
  }
  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        setFormData(newVal)
      }
    },
    { immediate: true }
  )

  return {
    models,
    viewModel,
    budget_resources_types,
    budget_item_types,
    budget_items_statuses,
    account_structures,
    formValidateElementRef,
  }
}

export default useResourceBudgetForm
