import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useBillingPortfolioClosureStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const useBillingAndPortfolioClousereView = () => {
  const { billing_portfolio_clouser_response } = storeToRefs(
    useBillingPortfolioClosureStore('v1')
  )
  const { _getByIdBillingPortfolioClosure } =
    useBillingPortfolioClosureStore('v1')

  const { _clearData } = useBillingPortfolioClosureStore('v1')

  const formInformationRef = ref()
  const route = useRoute()
  const { openMainLoader } = useMainLoader()

  const searchId = +route.params.id

  const headerProps = {
    title: 'Ver cierre de facturación y cartera',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Cierre de facturación y cartera',
        route: 'BillingAndPortfolioClosureList',
      },
      {
        label: 'Ver',
        route: 'BillingAndPortfolioClosureView',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: useUtils().defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onBeforeMount(() => {
    _clearData()
  })

  onMounted(async () => {
    openMainLoader(true)
    await _getByIdBillingPortfolioClosure(searchId)
    openMainLoader(false)
  })
  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformationRef,
    billing_portfolio_clouser_response,
  }
}

export default useBillingAndPortfolioClousereView
