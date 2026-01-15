// vue - router - quasar - pinia
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
// Interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import {
  IResourceBankAccountForm,
  IResourceBudgetForm,
  IResourceBudgetPayload,
} from '@/interfaces/customs/budget/ResourceBudget'
// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetResourceModuleStore } from '@/stores/budget/budget-resources'

const useResourceBudgetCreate = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useBudgetResourceModuleStore('v1')

  const resourceForm = ref()
  const bankAccountForm = ref()
  const loading = ref(false)

  const headerProps = {
    title: 'Crear recurso presupuestal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Recursos presupuestales', route: 'ResourceBudgetList' },
      { label: 'Crear', route: 'ResourceBudgetCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'bank',
      label: 'Cuenta bancaria',
      icon: defaultIconsLucide.bank,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0]?.name ?? 'information')
  const tabActiveIdx = computed(() =>
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // Computed para obtener el valor de has_bank_account del formulario
  const hasBankAccount = computed(() => {
    const formData = resourceForm.value?.getFormData()
    return formData?.has_bank_account ?? false
  })

  const resourceData = ref<IResourceBudgetForm>()
  const bankAccountData = ref<IResourceBankAccountForm>()
  const validateForms = async () => {
    if (
      tabActive.value === 'information' &&
      !(await resourceForm.value?.validateForm())
    )
      return false
    if (
      tabActive.value === 'bank' &&
      !(await bankAccountForm.value?.validateForm())
    )
      return false
    return true
  }

  const buildPayload = () => {
    // Mapear los campos al formato esperado por el backend
    const payload: IResourceBudgetPayload = {
      code: resourceData.value?.code ?? '',
      description: resourceData.value?.description ?? '',
      type: resourceData.value?.type ?? '',
      code_type_id: Number(resourceData.value?.resource_type_id),
      budget_structure_id: Number(resourceData.value?.structure_resource),
      manage_bank_account: resourceData.value?.has_bank_account ? 1 : 0,
    }

    // Si tiene cuenta bancaria, agregar los datos bancarios
    if (payload.manage_bank_account && bankAccountData.value) {
      payload.bank_id = bankAccountData.value?.bank_id
      payload.city_id = bankAccountData.value?.city_id
      payload.branch_id = bankAccountData.value?.branch_id
      payload.type_account = bankAccountData.value?.account_type
      payload.number_account = bankAccountData.value?.account_number
    }

    return payload
  }

  const continueToBank = async () => {
    if (await resourceForm.value?.validateForm()) {
      tabActive.value = 'bank'
    }
  }

  const createResource = async () => {
    if (!(await validateForms())) {
      return
    }

    loading.value = true
    openMainLoader(true)

    const payload = buildPayload()
    const success = await _createAction(payload)

    loading.value = false
    openMainLoader(false)

    if (success) {
      goToURL('ResourceBudgetList')
    }
  }
  const BudgetKeys = [
    'account_structures',
    'type_accounts',
    'budget_item_types',
    'budget_resources_types',
    'banks',
    'cities',
    'branches',
  ]

  onMounted(async () => {
    _getResources({ budget: BudgetKeys })
  })
  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })

  return {
    resourceForm,
    bankAccountForm,
    resourceData,
    bankAccountData,
    headerProps,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    createResource,
    hasBankAccount,
    continueToBank,
    goToURL,
  }
}

export default useResourceBudgetCreate
