import { computed, onBeforeUnmount, ref } from 'vue'
import {
  useMainLoader,
  useUtils,
  useGoToUrl,
  useRouteValidator,
} from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useBudgetLevelsStore } from '@/stores/budget/budget-levels'

const useBudgetLevelsCreate = () => {
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _createBudgetLevels, _cleanData } = useBudgetLevelsStore('v1')

  const budgetLevelForm = ref()

  const headerProps = {
    title: `Crear niveles presupuestales`,
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Niveles presupuestales',
        route: 'BudgetLevelsList',
      },
      { label: 'Crear', route: 'BudgetLevelsCreate' },
    ],
    btn: {
      to: () => goToURL('BudgetLevelsList'),
    },
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    return budgetLevelForm?.value?.validateForm()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = budgetLevelForm.value.getFormData()
      if (await _createBudgetLevels(payload)) {
        budgetLevelForm.value?.resetForm?.()
        goToURL('BudgetLevelsList')
      }
      openMainLoader(false)
    }
  }

  onBeforeUnmount(() => {
    _cleanData()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    budgetLevelForm,
    onSubmit,
    validateRouter,
  }
}

export default useBudgetLevelsCreate
