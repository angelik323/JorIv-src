// Vue - Vue Router
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

// Composables
import { useGoToUrl, useMainLoader } from '@/composables'

// Store
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'

const useCheckBalancesControlView = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getByIdCheckBalancesBasicData, _clearData } =
    useFiduciaryInvestmentPlanStore('v1')

  const searchId = +route.params.id

  const headerProperties = {
    title: 'Saldos con control de aportes',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Planes de inversión fiduciarios',
        route: 'FiduciaryInvestmentPlanList',
      },
      {
        label: 'Consulta de saldos de planes de inversión',
        route: 'CheckBalancesControlView',
      },
      {
        label: `${searchId}`,
        route: '',
      },
    ],
  }

  const handleGoBack = () =>
    goToURL('CheckBalancesView', undefined, { reload: true })

  onMounted(async () => {
    _clearData()

    openMainLoader(true)

    await _getByIdCheckBalancesBasicData(searchId)

    openMainLoader(false)
  })

  return {
    handleGoBack,
    headerProperties,
  }
}

export default useCheckBalancesControlView
