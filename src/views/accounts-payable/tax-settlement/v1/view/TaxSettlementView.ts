// Vue - Pinia
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { ITaxSettlementViewHeader } from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import { useGoToUrl, useUtils } from '@/composables'

// Stores
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'

const useTaxSettlementView = () => {
  // composables
  const route = useRoute()
  const settlementId = route.params.id ? +route.params.id : 1
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // stores
  const { liquidation_view_response } = storeToRefs(useTaxSettlementStore('v1'))

  // refs
  const headerData = ref<ITaxSettlementViewHeader | null>(null)

  // configs
  const headerProps = {
    title: 'Ver liquidación tributaria',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Liquidación tributaria',
        route: 'TaxSettlementList',
      },
      {
        label: 'Ver',
        route: 'TaxSettlementView',
      },
      {
        label: `${settlementId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'settlement',
      label: 'Liquidación',
      icon: defaultIconsLucide.pdf,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'concepts',
      label: 'Conceptos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'discounts_payments',
      label: 'Descuentos/Pagos',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'accounting',
      label: 'Contabilidad',
      icon: defaultIconsLucide.book,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ]

  const tabActive = ref('settlement')
  const tabActiveIdx = ref(0)

  // actions
  const loadHeaderData = async () => {
    const taxSettlementStore = useTaxSettlementStore('v1')

    if (!liquidation_view_response.value) {
      await taxSettlementStore._getTaxSettlementLiquidationView(settlementId)
    }

    if (liquidation_view_response.value?.header) {
      headerData.value = liquidation_view_response.value.header
    }
  }

  const handleTabChange = (newTab: string) => {
    tabActive.value = newTab
  }

  const handleTabIdxChange = (newIdx: number) => {
    tabActiveIdx.value = newIdx
    if (tabs[newIdx]) {
      tabActive.value = tabs[newIdx].name
    }
  }

  const handleContinue = () => {
    if (tabActiveIdx.value < tabs.length - 1) {
      tabActiveIdx.value++
      tabActive.value = tabs[tabActiveIdx.value].name
    }
  }

  const handleBackTab = () => {
    if (tabActiveIdx.value > 0) {
      tabActiveIdx.value--
      tabActive.value = tabs[tabActiveIdx.value].name
    }
  }

  const handleGoBackList = () => {
    goToURL('TaxSettlementList')
  }

  const handleFinalize = () => {
    goToURL('TaxSettlementList')
  }

  // lifecycle hooks
  onMounted(async () => {
    await loadHeaderData()
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    headerData,
    settlementId,

    // utils
    defaultIconsLucide,

    // methods
    handleTabChange,
    handleTabIdxChange,
    handleContinue,
    handleBackTab,
    handleGoBackList,
    handleFinalize,
  }
}

export default useTaxSettlementView
