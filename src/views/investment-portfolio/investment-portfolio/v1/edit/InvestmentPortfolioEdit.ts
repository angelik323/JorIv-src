import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useInvestmentPortfoliosStore, useResourceManagerStore } from '@/stores'

const useInvestmentPortfolioEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const investmentPortfolioId = +route.params.id
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _updateInvestmentPortfolio,
    _getInvestmentPortfolio,
    _cleanInvestmentPortfoliosData,
  } = useInvestmentPortfoliosStore('v1')

  const investmentPortfolioForm = ref()

  const headerProps = {
    title: 'Editar portafolio de inversiones',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: 'InvestmentPortfolioList' },
      { label: 'Editar' },
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

  const validateForms = async () => {
    return investmentPortfolioForm?.value?.validateForm()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = investmentPortfolioForm.value.getFormData()
      const success = await _updateInvestmentPortfolio(
        investmentPortfolioId,
        payload
      )
      if (success) {
        router.push({ name: 'InvestmentPortfolioList' })
      }
      openMainLoader(false)
    }
  }

  const keys = {
    investment_portfolio: ['coins'],
    accounting: ['cost_center'],
    treasury: ['banks', 'bank_account', 'typeReceive', 'means_of_payments'],
  }

  const hasLoadedData = ref(false)

  onMounted(async () => {
    openMainLoader(true)
    const portfolioPromise = _getInvestmentPortfolio(investmentPortfolioId)
    const resourcePromise = _getResources(keys)

    Promise.all([resourcePromise, portfolioPromise]).finally(() => {
      hasLoadedData.value = true
      openMainLoader(false)
    })
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
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
    onSubmit,
  }
}

export default useInvestmentPortfolioEdit
