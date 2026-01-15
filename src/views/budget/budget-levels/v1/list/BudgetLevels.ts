import { useUtils, useGoToUrl, useRouteValidator } from '@/composables'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { onBeforeMount, onMounted } from 'vue'
const { defaultIconsLucide } = useUtils()

const useBudgetLevels = () => {
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    budget: ['budget_levels', 'budget_classes', 'code_movements'],
  }

  const headerProps = {
    title: 'Niveles presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Niveles presupuestales', route: 'BudgetLevelsList' },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
      to: () => goToURL('BudgetLevelsCreate'),
    },
  }

  onMounted(() => {
    _getResources(keys)
  })

  onBeforeMount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    validateRouter,
  }
}

export default useBudgetLevels
