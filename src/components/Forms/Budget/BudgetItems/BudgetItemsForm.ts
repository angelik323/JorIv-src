// Vue - Router - Pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Stores
import { useAccountingResourceStore, useBudgetResourceStore } from '@/stores'
// Interfaces & types
import { IBudgetItemsForm } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
interface Props {
  action: ActionType
  data?: IBudgetItemsForm | null
}
export const useBudgetItemsForm = (props: Props) => {
  const { budget_item_types, budget_item_nature, budget_items_statuses } =
    storeToRefs(useBudgetResourceStore('v1'))
  const {
    budget_item_structure,
    chart_of_account_structures,
    resource_catalog_structures,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const initialModelsValues: IBudgetItemsForm = {
    id: undefined,
    status_id: null,
    budget_structure_id: null,
    resource_structure_id: null,
    accounting_structure_id: null,
    code: null,
    description: '',
    type: '',
    nature: '',
  }

  const models = ref<IBudgetItemsForm>({
    ...initialModelsValues,
  })
  const formInformation = ref<HTMLFormElement | null>(null)

  const getFormData = () => {
    return models.value
  }

  const validateForm = async () => {
    return await formInformation.value?.validate()
  }

  const setFormData = (data: Partial<IBudgetItemsForm>) => {
    models.value = { ...models.value, ...data }
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
    budget_item_types,
    budget_item_nature,
    budget_item_structure,
    chart_of_account_structures,
    resource_catalog_structures,
    budget_items_statuses,
    getFormData,
    setFormData,
    formInformation,
    validateForm,
  }
}
