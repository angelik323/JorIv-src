import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ITabs } from '@/interfaces/global'

import { defaultIconsLucide } from '@/utils'
import { useMainLoader } from '@/composables'

import { useInvestmentPortfoliosStore } from '@/stores'

const useInvestmentPortfolioView = () => {
  const route = useRoute()
  const router = useRouter()
  const investmentPortfolioId = +route.params.id
  const investmentPortfolioForm = ref()

  const { openMainLoader } = useMainLoader()

  const { _getInvestmentPortfolio, _cleanInvestmentPortfoliosData } =
    useInvestmentPortfoliosStore('v1')

  const headerProps = {
    title: 'Ver ETF',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: "Definición ETF's", route: 'OperationalETFList' },
      { label: 'Ver' },
      { label: `${investmentPortfolioId}` },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const goToList = () => {
    router.push({ name: 'InvestmentPortfolioList' })
  }

  const hasLoadedData = ref(false)

  onMounted(async () => {
    openMainLoader(true)
    await _getInvestmentPortfolio(investmentPortfolioId)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _cleanInvestmentPortfoliosData()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    investmentPortfolioForm,
    investmentPortfolioId,
    hasLoadedData,
    goToList,
  }
}

export default useInvestmentPortfolioView
