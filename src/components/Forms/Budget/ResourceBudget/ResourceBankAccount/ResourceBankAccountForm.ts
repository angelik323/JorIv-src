// Core - Pinia - API
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces & types
import { IResourceBankAccountForm } from '@/interfaces/customs/budget/ResourceBudget'
import { ActionType } from '@/interfaces/global/Action'
// stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useResourceBankAccountForm = (
  props: {
    action: ActionType
    data?: IResourceBankAccountForm
  },
  emit: Function
) => {
  const { banks, cities, branches, type_accounts, account_structures } =
    storeToRefs(useBudgetResourceStore('v1'))
  const viewModel = ref<IResourceBankAccountForm>({
    bank_id: 0,
    bank_code: '',
    bank_name: '',
    city_id: null,
    city_name: 'Bogotá',
    branch_id: null,
    branch_name: '',
    account_type: '',
    account_number: '',
  })

  const initialModels: IResourceBankAccountForm = {
    bank_id: null,
    bank_name: '',
    city_id: null,
    city_name: null,
    branch_id: null,
    branch_name: null,
    account_type: '',
    account_number: '',
  }

  const models = ref<IResourceBankAccountForm>({ ...initialModels })
  const formValidateElementRef = ref()
  // Watcher para actualizar el nombre del banco cuando se selecciona uno
  watch(
    () => models.value.bank_id,
    (newBankId) => {
      if (newBankId) {
        const selectedBank = banks.value.find(
          (bank) => bank.value === newBankId
        )
        models.value.bank_name = selectedBank?.description ?? ''
      }
    }
  )

  watch(
    () => models.value,
    () => {
      emit('update:modelValue', models.value)
    },
    { deep: true }
  )
  const setFormData = (data: IResourceBankAccountForm) => {
    if (!data) return
    if (['create', 'edit'].includes(props.action)) {
      models.value.bank_id = data.bank_id ?? null
      models.value.bank_name = data.bank_name ?? ''
      models.value.city_id = data.city_id ?? null
      models.value.city_name = data.city_name ?? null
      models.value.branch_id = data.branch_id ?? null
      models.value.branch_name = data.branch_name ?? null
      models.value.account_type = data.account_type ?? ''
      models.value.account_number = data.account_number ?? ''
    } else if (props.action === 'view') {
      viewModel.value = data
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
    banks,
    cities,
    branches,
    type_accounts,
    account_structures,
    formValidateElementRef,
  }
}

export default useResourceBankAccountForm
