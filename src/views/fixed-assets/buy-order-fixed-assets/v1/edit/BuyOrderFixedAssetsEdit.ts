// vue - quasar
import { computed, onBeforeMount, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IBuyOrderFixedAssetsList,
  IBuyOrderFixedAssetsUpdateRequest
} from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'

// composables
import { useAlert, useMainLoader, useUtils, useGoToUrl } from '@/composables'

// stores
import { useBuyOrderFixedAssetsStore } from '@/stores/fixed-assets/buy-order-fixed-assets'

const useBuyOrderFixedAssetsEdit = () => {
  // route
  const route = useRoute()
  const searchId = +route.params.id

  // composables
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // imports stores
  const { headerPropsDefault } = storeToRefs(useBuyOrderFixedAssetsStore('v1'))
  const { _getByIdBuyOrderFixedAssets, _updateBuyOrderFixedAssets } =
    useBuyOrderFixedAssetsStore('v1')

  // breadcrumb
  const headerPropsEdit = {
    title: 'Editar orden de compra de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar',
        route: 'BuyOrderFixedAssetsEdit'
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

  const isSubmitDisabled = computed(() => {
    return !formInformation.value?.hasChanges
  })

  const validateForms = async (): Promise<boolean> => {
    try {
      const isValid = await formInformation.value?.validateForm()
      if (!isValid) {
        showAlert('Por favor valide el diligenciamiento', 'error', undefined, 3000)
        return false
      }
      return true
    } catch {
      showAlert('Por favor valide el diligenciamiento', 'error', undefined, 3000)
      return false
    }
  }

  const makeDataRequest = (): IBuyOrderFixedAssetsUpdateRequest | null => {
    const requestData = formInformation.value?.getRequestData()
    if (!requestData || !requestData.items || requestData.items.length === 0) {
      return null
    }
    return {
      id: searchId,
      items: requestData.items
    }
  }

  const goToList = () => {
    goToURL('BuyOrderFixedAssetsList')
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    if (!payload) {
      openMainLoader(false)
      return showAlert(
        'Debe tener al menos un item en la orden de compra',
        'error',
        undefined,
        3000
      )
    }

    const success = await _updateBuyOrderFixedAssets(searchId, payload)

    if (success) {
      setTimeout(() => {
        openMainLoader(false)
        goToList()
      }, 5000)
    } else {
      openMainLoader(false)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    const response = await _getByIdBuyOrderFixedAssets(searchId)
    buyOrderData.value = response
    openMainLoader(false)
  })

  return {
    headerPropsEdit,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    buyOrderData,
    isSubmitDisabled,

    goToList,
    onSubmit
  }
}

export default useBuyOrderFixedAssetsEdit
