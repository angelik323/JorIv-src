// vue - quasar
import { onBeforeMount, ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// interfaces
import type { ITabs } from '@/interfaces/customs/Tab'
import type {
  IBuySaleTransactionData,
  IBuySaleFixedAssetsUpdateRequest
} from '@/interfaces/customs/fixed-assets/BuySaleFixedAssets'

// composables
import { useAlert, useMainLoader, useUtils, useGoToUrl } from '@/composables'

// stores
import { useBuySaleFixedAssetsStore } from '@/stores/fixed-assets/buy-sale-fixed-assets'

const useSaleFixedAssetsEdit = () => {
  // route
  const route = useRoute()
  const searchId = +route.params.id

  // composables
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  // imports stores
  const { headerPropsDefault } = storeToRefs(useBuySaleFixedAssetsStore('v1'))
  const { _getByIdBuySaleFixedAssets, _updateBuySaleFixedAssets } = useBuySaleFixedAssetsStore('v1')

  const transactionData = ref<IBuySaleTransactionData | null>(null)

  // breadcrumb
  const headerPropsEdit = ref({
    title: 'Editar venta de activos fijos y bienes',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Editar Venta',
        route: 'SaleFixedAssetsEdit'
      },
      { label: `${searchId}` }
    ]
  })

  // form refs
  const formInformation = ref()

  // tabs
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

  const makeDataRequest = (): IBuySaleFixedAssetsUpdateRequest | null => {
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

    return formData as IBuySaleFixedAssetsUpdateRequest
  }

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
        'No hay datos para actualizar o faltan campos requeridos',
        'error',
        undefined,
        3000
      )
    }

    const response = await _updateBuySaleFixedAssets(searchId, payload)

    if (response) {
      goToList()
    }

    openMainLoader(false)
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
    defaultIconsLucide,
    headerPropsEdit,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    transactionData,

    goToList,
    onSubmit
  }
}

export default useSaleFixedAssetsEdit
