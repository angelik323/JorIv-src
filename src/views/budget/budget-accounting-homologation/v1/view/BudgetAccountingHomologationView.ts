// Vue - pinia
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { IBudgetAccountingHomologationRead } from '@/interfaces/customs/budget/BudgetAccountingHomologation'

// Composables
import { useMainLoader } from '@/composables'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRouteValidator } from '@/composables/useRoutesValidator'

// Stores
import { useBudgetAccountingHomologationStore } from '@/stores/budget/budget-accounting-homologation'

const useBudgetAccountingHomologationView = () => {
  const { goToURL } = useGoToUrl()
  const { _getBudgetAccountingParameterById } =
    useBudgetAccountingHomologationStore('v1')
  const { openMainLoader } = useMainLoader()

  const { validateRouter } = useRouteValidator()

  const route = useRoute()
  const processId = route.params.id
  const operation = route.params.operation ? 1 : 0

  const headerProps = {
    title: 'Homologación contabilidad vs presupuesto',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Homologación contabilidad vs presupuesto',
        route: 'BudgetAccountingHomologationList',
      },
      { label: 'Ver', route: 'BudgetAccountingHomologationCreate' },
      { label: String(processId) },
    ],
  }

  const homologationProcessData = ref<IBudgetAccountingHomologationRead | null>(
    null
  )
  onMounted(async () => {
    openMainLoader(true)
    homologationProcessData.value = await _getBudgetAccountingParameterById(
      Number(processId),
      operation
    )
    openMainLoader(false)
  })

  return {
    headerProps,
    homologationProcessData,
    goToURL,
    validateRouter,
  }
}

export default useBudgetAccountingHomologationView
