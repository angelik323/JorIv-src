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

const useBudgetAccountingHomologationParametersView = () => {
  const { _getBudgetAccountingParameterById } =
    useBudgetAccountingHomologationParametersStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const parameterId = route.params.id

  const headerProps = {
    title: 'Ver parámetros homologación presupuesto a contabilidad',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Parámetros homologación contabilidad vs presupuesto',
        route: 'BudgetAccountingHomologationParametersList',
      },
      { label: 'Ver', route: 'BudgetAccountingHomologationParametersView' },
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
  ]

  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const parameterData = ref()

  onMounted(async () => {
    openMainLoader(true)
    Promise.all([
      (parameterData.value = await _getBudgetAccountingParameterById(
        Number(parameterId)
      )),
    ]).finally(() => {
      openMainLoader(false)
    })
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    parameterData,
    goToURL,
  }
}

export default useBudgetAccountingHomologationParametersView
