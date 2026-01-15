// Vue - pinia - moment
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useBudgetAccountingHomologationParametersStore } from '@/stores/budget/budget-accounting-homologation-parameters'

const useAccountingBudgetHomologationParametersView = () => {
  const { _getAccountingBudgetParameterById } =
    useBudgetAccountingHomologationParametersStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const parameterId = route.params.id

  const headerProps = {
    title: 'Ver parámetros homologación contabilidad a presupuesto',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Parámetros homologación contabilidad vs presupuesto',
        route: 'BudgetAccountingHomologationParametersList',
      },
      { label: 'Ver', route: 'AccountingBudgetHomologationParametersView' },
      { label: String(parameterId) },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'budget_data',
      label: 'Datos presupuestales',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const basicDataFormRef = ref()
  const budgetDataFormRef = ref()

  const nextTab = async () => {
    tabActiveIdx.value = 1
    tabActive.value = tabs[tabActiveIdx.value].name
  }

  const previousTab = () => {
    tabActiveIdx.value = 0
    tabActive.value = tabs[tabActiveIdx.value].name
  }

  const parameterData = ref()

  onMounted(async () => {
    openMainLoader(true)
    Promise.all([
      (parameterData.value = await _getAccountingBudgetParameterById(
        Number(parameterId)
      )),
    ]).finally(() => {
      openMainLoader(false)
    })
  })

  return {
    basicDataFormRef,
    budgetDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    parameterData,
    goToURL,
    nextTab,
    previousTab,
  }
}

export default useAccountingBudgetHomologationParametersView
