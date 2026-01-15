// vue - quasar
import { onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import { IBuyOrderFixedAssetsList } from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'

// composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'

// stores
import { useBuyOrderFixedAssetsStore } from '@/stores/fixed-assets/buy-order-fixed-assets'

const useBuyOrderFixedAssetsRead = () => {
  // route
  const route = useRoute()
  const searchId = +route.params.id

  // composables
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // imports stores
  const { headerPropsDefault } = storeToRefs(useBuyOrderFixedAssetsStore('v1'))
  const { _getByIdBuyOrderFixedAssets } = useBuyOrderFixedAssetsStore('v1')

  // breadcrumb
  const headerPropsRead = {
    title: 'Ver orden de compra de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'BuyOrderFixedAssetsRead'
      },
      { label: `${searchId}` }
    ]
  }

  // Data response
  const buyOrderData = ref<IBuyOrderFixedAssetsList | null>(null)

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

  const goToList = () => {
    goToURL('BuyOrderFixedAssetsList')
  }

  const onSubmit = () => {
    goToList()
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    const response = await _getByIdBuyOrderFixedAssets(searchId)
    buyOrderData.value = response
    openMainLoader(false)
  })

  return {
    headerPropsRead,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    buyOrderData,

    goToList,
    onSubmit
  }
}

export default useBuyOrderFixedAssetsRead
