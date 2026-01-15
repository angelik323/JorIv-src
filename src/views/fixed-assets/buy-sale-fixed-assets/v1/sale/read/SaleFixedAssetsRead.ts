// vue - quasar
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import { IBuySaleTransactionData } from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// stores
import { useBuySaleFixedAssetsStore } from '@/stores/fixed-assets/buy-sale-fixed-assets'

const useSaleFixedAssetsRead = () => {
  // route
  const route = useRoute()
  const searchId = +route.params.id

  // composables
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // imports stores
  const { headerPropsDefault } = storeToRefs(useBuySaleFixedAssetsStore('v1'))
  const { _getByIdBuySaleFixedAssets } = useBuySaleFixedAssetsStore('v1')

  const transactionData = ref<IBuySaleTransactionData | null>(null)

  // breadcrumb
  const headerPropsRead = ref({
    title: 'Ver venta de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver Venta',
        route: 'SaleFixedAssetsRead'
      },
      { label: `${searchId}` }
    ]
  })

  // form refs
  const formInformation = ref()

  // tabs
  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false
    }
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = ref(0)

  // actions
  const goToList = () => {
    goToURL('BuySaleFixedAssetsList')
  }

  const onSubmit = () => {
    goToList()
  }

  onBeforeMount(async () => {
    openMainLoader(true)

    const data = await _getByIdBuySaleFixedAssets(searchId)
    if (data) {
      transactionData.value = data
    }

    openMainLoader(false)
  })

  return {
    headerPropsRead,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    transactionData,

    goToList,
    onSubmit
  }
}

export default useSaleFixedAssetsRead
