import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useInvestmentPortfoliosStore, useResourceManagerStore } from '@/stores'

const useInvestmentPortfolioCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createInvestmentPortfolio, _cleanInvestmentPortfoliosData } =
    useInvestmentPortfoliosStore('v1')

  const investmentPortfolioForm = ref()

  const headerProps = {
    title: 'Crear portafolio de inversiones',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: 'InvestmentPortfolioList' },
      { label: 'Crear' },
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
      const success = await _createInvestmentPortfolio(payload)
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

  onMounted(async () => {
    openMainLoader(true)
    _resetKeys({ fics: ['funds'], trust_business: ['business_trusts'] })
    await _getResources(keys)
    openMainLoader(false)
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
    onSubmit,
  }
}

export default useInvestmentPortfolioCreate
