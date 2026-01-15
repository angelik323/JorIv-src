// vue - router - quasar - pinia
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
// Interfaces & types
import { ITabs } from '@/interfaces/global'

// composable
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useBudgetItemsModuleStore, useResourceManagerStore } from '@/stores'

const useBudgetItemsCreate = () => {
  const { goToURL } = useGoToUrl()

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useBudgetItemsModuleStore('v1')
  const budgetForm = ref()
  const loading = ref(false)

  const headerProps = {
    title: 'Crear rubro presupuestal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Configuración' },
      { label: 'Rubros presupuestales', route: 'BudgetItemsList' },
      { label: 'Crear', route: 'BudgetItemsCreate' },
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
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const createBudget = async () => {
    if (!(await budgetForm.value.validateForm())) {
      return
    }

    loading.value = true
    openMainLoader(true)
    const payload = budgetForm.value.getFormData()
    const success = await _createAction(payload)
    loading.value = false
    openMainLoader(false)
    if (success) {
      goToURL('BudgetItemsList')
    }
  }

  const BudgetKeys = ['budget_item_types', 'budget_item_nature']
  const AccountingKeys = [
    'budget_item_structure',
    'chart_of_account_structures',
    'resource_catalog_structures',
  ]

  onMounted(async () => {
    _getResources({ budget: BudgetKeys })
    _getResources({ accounting: AccountingKeys }, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys, accounting: AccountingKeys })
  })

  return {
    headerProps,
    loading,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    budgetForm,
    createBudget,
    goToURL,
  }
}

export default useBudgetItemsCreate
