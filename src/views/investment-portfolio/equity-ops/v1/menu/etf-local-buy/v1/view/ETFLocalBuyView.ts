import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'

import { useLocalPurchaseExchangeTradedFundStore } from '@/stores'

const useEtfLocalBuyView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const { _showAction } = useLocalPurchaseExchangeTradedFundStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const initialData = ref({})

  const headerProperties = {
    title: "Ver compra ETF's moneda local",
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: "Operaciones ETF's",
        route: 'EquityOpsList',
      },
      {
        label: 'Ver',
        route: 'ETFLocalBuyView',
      },
      {
        label: id,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
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

  const loadData = async () => {
    openMainLoader(true)

    const success = await _showAction(id)

    if (success) {
      const data = success
      initialData.value = data
      isLoaded.value = true
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({
      name: 'EquityOpsList',
      query: { reload: 'true' },
    })

  onMounted(() => loadData())

  return {
    tabs,
    isLoaded,
    tabActive,
    initialData,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    informationFormRef,
  }
}

export default useEtfLocalBuyView
