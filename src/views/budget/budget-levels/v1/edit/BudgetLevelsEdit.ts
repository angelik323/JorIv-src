import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ITabs } from '@/interfaces/global'
import {
  useGoToUrl,
  useMainLoader,
  useUtils,
  useRouteValidator,
} from '@/composables'
import { useBudgetLevelsStore } from '@/stores/budget/budget-levels'

const useBudgetLevelsEdit = () => {
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const budgetLevelsId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { _updateBudgetLevels, _cleanData, _getBudgetLevelById } =
    useBudgetLevelsStore('v1')
  const { defaultIconsLucide } = useUtils()

  const budgetLevelsForm = ref()

  const headerProps = ref({
    title: 'Editar niveles presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      {
        label: 'Presupuesto',
      },
      {
        label: 'Niveles presupuestales',
        route: 'BudgetLevelsList',
      },
      { label: 'Editar', route: 'BudgetLevelsEdit' },
      { label: `${budgetLevelsId}` },
    ],
    btn: {
      to: () => goToURL('BudgetLevelsList'),
    },
  })

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
    return budgetLevelsForm?.value?.validateForm()
  }

  const updateBudgetLevels = async () => {
    if (!(await validateForms())) {
      return
    }
    await onSubmit()
  }

  const onSubmit = async () => {
    openMainLoader(true)
    const payload = budgetLevelsForm.value.getFormData()
    if (await _updateBudgetLevels(budgetLevelsId, payload)) {
      goToURL('BudgetLevelsList')
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    _getBudgetLevelById(budgetLevelsId)
  })

  onBeforeUnmount(() => {
    _cleanData()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    budgetLevelsForm,
    budgetLevelsId,
    updateBudgetLevels,
    onSubmit,
    validateRouter,
  }
}

export default useBudgetLevelsEdit
