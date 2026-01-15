// vue - quasar
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/customs/Tab'
import { IBuySaleFixedAssetsCreateRequest } from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// composables
import { useAlert, useMainLoader, useUtils, useGoToUrl } from '@/composables'

// stores
import { useBuySaleFixedAssetsStore } from '@/stores/fixed-assets/buy-sale-fixed-assets'

const useSaleFixedAssetsCreate = () => {
  // composables
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // imports stores
  const { headerPropsDefault } = storeToRefs(useBuySaleFixedAssetsStore('v1'))
  const { _createBuySaleFixedAssets } = useBuySaleFixedAssetsStore('v1')

  // breadcrumb
  const headerPropsCreate = computed(() => {
    return {
      title: 'Crear venta de activos fijos y bienes',
      breadcrumbs: [
        ...headerPropsDefault.value.breadcrumbs,
        {
          label: 'Crear Venta',
          route: 'SaleFixedAssetsCreate'
        }
      ]
    }
  })

  // form refs
  const formInformation = ref()

  // tabs - Solo datos básicos para Venta (sin documentos)
  const tabs = computed<ITabs[]>(() => {
    return [
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
  })

  const [initialTab] = tabs.value
  const tabActive = ref(initialTab.name)
  const tabActiveIdx = ref(tabs.value.indexOf(initialTab))

  const validateForms = async () => {
    let valid: boolean = false

    try {
      valid = (await formInformation.value?.validateForm()) ?? false
    } catch {
      valid = false
    }

    return valid
  }

  const makeDataRequest = (): IBuySaleFixedAssetsCreateRequest | null => {
    const formData = formInformation.value?.getRequestData()
    if (!formData) return null

    if (
      !formData.business_trust_id ||
      !formData.third_party_id ||
      !formData.cost_center_id ||
      !formData.currency_id ||
      !formData.configuration_type_id ||
      !formData.configuration_subtype_id ||
      !formData.transaction_date ||
      !formData.transaction_value ||
      !formData.asset_category
    ) {
      return null
    }

    return formData as IBuySaleFixedAssetsCreateRequest
  }

  // actions
  const goToList = () => {
    goToURL('BuySaleFixedAssetsList')
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    if (!payload) {
      openMainLoader(false)
      return showAlert(
        'No hay datos para crear o faltan campos requeridos',
        'error',
        undefined,
        3000
      )
    }

    const success = await _createBuySaleFixedAssets(payload)
    if (success) {
      setTimeout(() => {
        openMainLoader(false)
        goToList()
      }, 5000)
    } else {
      openMainLoader(false)
    }
  }

  const handleBack = () => {
    goToList()
  }

  return {
    defaultIconsLucide,

    // Header & Form
    headerPropsCreate,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,

    // Actions
    goToList,
    onSubmit,
    handleBack
  }
}

export default useSaleFixedAssetsCreate
