// Vue
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Interfaces - Constans
import { fics_fiduciary_investment_plans_report_options } from '@/constants'
import { IFicFiduciaryInvestmentPlansReportOptions } from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryInvestmentPlansReports = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    fics: ['funds'],
  }

  const headerProps = {
    title: 'Reportes',
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
        label: 'Reportes',
        route: 'FiduciaryInvestmentPlanReport',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const activeTab = tabs[0].name
  const activeTabIdx = 0

  const selectedReportOption =
    ref<IFicFiduciaryInvestmentPlansReportOptions | null>(null)

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys)

    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    tabs,
    goToURL,
    activeTab,
    headerProps,
    activeTabIdx,
    selectedReportOption,
    fics_fiduciary_investment_plans_report_options,
  }
}

export default useFiduciaryInvestmentPlansReports
