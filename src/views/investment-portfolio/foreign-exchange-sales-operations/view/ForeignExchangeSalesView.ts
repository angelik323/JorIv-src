// Vue - Router
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useForeignExchangeSalesStore } from '@/stores/investment-portfolio/foreign-exchange-sales-operations'

const useForeignExchangeSalesView = () => {
  const route = useRoute()
  const foreignExchangeSalesId = +route.params.id
  const foreignExchangeForm = ref()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { openMainLoader } = useMainLoader()

  const { _cleanForeignExchangeSalesBuysData, _getForeignExchangeSalesBuy } =
    useForeignExchangeSalesStore('v1')

  const headerProps = {
    title: 'Ver venta de divisas',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      {
        label: 'Portafolio de inversiones',
      },
      { label: 'Divisas', route: 'ForeignExchangeSalesList' },
      { label: 'Ver', route: 'ForeignExchangeSalesView' },
      { label: `${foreignExchangeSalesId}` },
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

  const hasLoadedData = ref(false)

  onMounted(async () => {
    openMainLoader(true)
    await _getForeignExchangeSalesBuy(foreignExchangeSalesId)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _cleanForeignExchangeSalesBuysData()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    foreignExchangeForm,
    foreignExchangeSalesId,
    hasLoadedData,
    goToURL,
  }
}

export default useForeignExchangeSalesView
