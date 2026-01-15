// Vue - Vue Router
import { useRoute } from 'vue-router'
import { onMounted } from 'vue'

// Composables
import { useGoToUrl, useMainLoader } from '@/composables'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'

const useCheckBalancesView = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getByIdCheckBalancesBasicData, _clearData } =
    useFiduciaryInvestmentPlanStore('v1')

  const searchId = +route.params.id

  const headerProperties = {
    title: 'Ver saldo plan de inversión',
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
        route: 'CheckBalancesView',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const handleGoBack = () =>
    goToURL('FiduciaryInvestmentPlanList', undefined, { reload: true })

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

export default useCheckBalancesView
