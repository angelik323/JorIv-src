// vue - quasar
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import {
  IBuyOrderFixedAssetsCreateRequest,
} from '@/interfaces/customs/fixed-assets/BuyOrderFixedAssets'

// composables
import { useAlert, useMainLoader, useUtils, useGoToUrl } from '@/composables'

// stores
import { useBuyOrderFixedAssetsStore } from '@/stores/fixed-assets/buy-order-fixed-assets'

const useBuyOrderFixedAssetsCreate = () => {
  // composables
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // imports stores
  const { headerPropsDefault } = storeToRefs(useBuyOrderFixedAssetsStore('v1'))
  const { _createBuyOrderFixedAssets } = useBuyOrderFixedAssetsStore('v1')

  // breadcrumb
  const headerPropsCreate = {
    title: 'Crear orden de compra de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
        route: 'BuyOrderFixedAssetsCreate'
      }
    ]
  }

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

  const makeDataRequest = (): IBuyOrderFixedAssetsCreateRequest | null => {
    const requestData = formInformation.value?.getRequestData()
    if (!requestData || !requestData.items || requestData.items.length === 0) {
      return null
    }
    return requestData
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
        'Debe agregar al menos un item a la orden de compra',
        'error',
        undefined,
        3000
      )
    }

    const success = await _createBuyOrderFixedAssets(payload)

    if (success) {
      setTimeout(() => {
        openMainLoader(false)
        goToList()
      }, 5000)
    } else {
      openMainLoader(false)
    }
  }

  return {
    headerPropsCreate,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    defaultIconsLucide,

    goToList,
    onSubmit
  }
}

export default useBuyOrderFixedAssetsCreate
