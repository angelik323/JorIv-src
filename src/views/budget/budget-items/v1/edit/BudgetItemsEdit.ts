// vue - router - quasar - pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// composables
import { useGoToUrl, useUtils } from '@/composables'

// Stores
import { useBudgetItemsModuleStore, useResourceManagerStore } from '@/stores'

const useBudgetItemsEdit = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const { _updateAction, _showAction } = useBudgetItemsModuleStore('v1')
  const { selected_budget_item } = storeToRefs(useBudgetItemsModuleStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const budgetItemId = Number(route.params.id)

  const headerProps = {
    title: 'Editar rubro presupuestal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Configuración' },
      { label: 'Rubros presupuestales', route: 'BudgetItemsList' },
      { label: 'Editar', route: 'BudgetItemsEdit' },
      { label: budgetItemId.toString() },
    ],
  }

  const tabs = ref([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(0)

  const formInformation = ref()

  const onSubmit = async () => {
    if (!(await formInformation.value.validateForm())) return

    const payload = formInformation.value.getFormData()

    // Solo tomamos description y status_id
    const dataToSend = {
      id: budgetItemId,
      description: payload.description,
      status_id: payload.status_id,
    }

    const success = await _updateAction(dataToSend)

    if (success) goToURL('BudgetItemsList')
  }
  const BudgetKeys = ['budget_items_statuses']
  const AccountingKeys = [
    'budget_item_structure',
    'chart_of_account_structures',
    'resource_catalog_structures',
  ]

  onMounted(async () => {
    _getResources({ budget: BudgetKeys })
    _getResources({ accounting: AccountingKeys }, '', 'v2')

    if (
      !selected_budget_item.value ||
      selected_budget_item.value.id !== budgetItemId
    ) {
      await _showAction(budgetItemId)
    }
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    selected_budget_item,
    onSubmit,
    goToURL,
  }
}

export default useBudgetItemsEdit
