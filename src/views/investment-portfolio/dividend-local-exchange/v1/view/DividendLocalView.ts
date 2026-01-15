import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ITabs } from '@/interfaces/global'

import { defaultIconsLucide } from '@/utils'
import { useMainLoader } from '@/composables'

import { useDividendLocalStore, useResourceManagerStore } from '@/stores'

const useDividendLocalView = () => {
  const route = useRoute()
  const router = useRouter()
  const investmentPortfolioId = +route.params.id
  const investmentPortfolioForm = ref()

  const { openMainLoader } = useMainLoader()

  const { _getDividendLocal, _cleanDividendLocalsData } =
    useDividendLocalStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: "Ver registro de dividendos ETF's moneda local",

    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Operaciones renta variable', route: 'DividendLocalList' },
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
    router.push({ name: 'DividendLocalList' })
  }

  const hasLoadedData = ref(false)
  const keys = {
    investment_portfolio: ['emitter_anna_codes', 'exchange_traded_fund_local'],
  }

  onMounted(async () => {
    openMainLoader(true)
    try {
      const portfolioPromise = _getDividendLocal(investmentPortfolioId)
      const resourcePromise = _getResources(keys)
      await Promise.all([portfolioPromise, resourcePromise])
      hasLoadedData.value = true
    } finally {
      openMainLoader(false)
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _cleanDividendLocalsData()
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

export default useDividendLocalView
