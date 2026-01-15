// Vue
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Stores
import { useTaxMatrixStoreV1 } from '@/stores/accounts-payable/tax-matrix/tax-matrix-v1'



const useTaxMatrixList = () => {
  const route = useRoute()
  const router = useRouter()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  const { _getTaxMatrixList, getMatrixByType } = useTaxMatrixStoreV1()

  const headerProps = {
    title: 'Matriz tributaria',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      { label: 'Matriz tributaria', route: 'TaxMatrixList' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'rft',
      label: 'Retención en la fuente',
      icon: defaultIconsLucide.fileText,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'riv',
      label: 'Retención de IVA',
      icon: defaultIconsLucide.fileText,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'ric',
      label: 'Retención de ICA',
      icon: defaultIconsLucide.fileText,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'rte',
      label: 'Impuestos territoriales',
      icon: defaultIconsLucide.fileText,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabFromQuery = route.query.tab as string
  const initialTab = tabFromQuery || filteredTabs.value[0].name

  const tabActive = ref(initialTab)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const getCurrentTabData = computed(() => {
    const taxTypeMap: Record<string, string> = {
      rft: 'RFT',
      riv: 'RIV',
      ric: 'RIC',
      rte: 'RTE',
    }

    const taxType = taxTypeMap[tabActive.value]
    return getMatrixByType(taxType)
  })

  const nextTab = () => {
    const nextIdx = tabActiveIdx.value + 1
    if (nextIdx >= filteredTabs.value.length) return

    tabActiveIdx.value = nextIdx
    tabActive.value = filteredTabs.value[nextIdx].name
  }

  const backTab = () => {
    const prevIdx = tabActiveIdx.value - 1
    if (prevIdx < 0) return

    tabActiveIdx.value = prevIdx
    tabActive.value = filteredTabs.value[prevIdx].name
  }

  const handleEdit = (taxType: string) => {
    goToURL('TaxMatrixEdit', { taxType })
  }

  onMounted(async () => {
    openMainLoader(true)
    
    if (route.query.tab) {
      router.replace({ name: 'TaxMatrixList' })
    }
    
    await _getTaxMatrixList()
    setTimeout(() => openMainLoader(false), 1000)
  })

  return {
    // configs
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,

    // data
    getCurrentTabData,

    // utils
    defaultIconsLucide,

    // actions
    nextTab,
    backTab,
    handleEdit,
  }
}

export default useTaxMatrixList