import { computed, onMounted, onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  useResourceManagerStore,
  useForeignCurrencyEquityStockSaleStore,
} from '@/stores'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'

const useForeignCurrencyEquityStockSaleCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const foreignCurrencyStore = useForeignCurrencyEquityStockSaleStore('v1')
  const { headerPropsDefault, buildPayload } = storeToRefs(foreignCurrencyStore)
  const {
    _createAction,
    updateBasicData,
    updateEmitterData,
    updateComplianceData,
    resetFormData,
  } = foreignCurrencyStore

  const headerProperties = headerPropsDefault.value

  const basicDataFormRef = ref()
  const complianceFormRef = ref()
  const emitterFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio_code_local_currency',
    'operation_type_code_local_currency',
    'issuer_counterparty_local_currency',
    'local_currency_share_class',
    'currency_foreign',
    'issuer_seller',
  ]

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'emitter',
      label: 'Emisor',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'compliance',
      label: 'Cumplimiento',
      icon: defaultIconsLucide.send,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources({ investment_portfolio: keys })

    await _getResources(
      { investment_portfolio: ['currency_local'] },
      'filter[search_currency]=COP'
    )

    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 1000)
  }

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    // Guardar datos del formulario actual antes de cambiar de tab
    await saveCurrentFormData()

    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const saveCurrentFormData = async () => {
    if (tabActive.value === 'basic_data') {
      const data = basicDataFormRef.value?.getValues()
      if (data) {
        updateBasicData(data)
      }
    } else if (tabActive.value === 'emitter') {
      const data = emitterFormRef.value?.getValues()
      if (data) {
        updateEmitterData(data)
      }
    } else if (tabActive.value === 'compliance') {
      const data = complianceFormRef.value?.getValues()
      if (data) {
        updateComplianceData(data)
      }
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const validateForms = async () => {
    if (tabActive.value === 'basic_data') {
      return await basicDataFormRef.value?.validateForm()
    } else if (tabActive.value === 'emitter') {
      return await emitterFormRef.value?.validateForm()
    } else if (tabActive.value === 'compliance') {
      return await complianceFormRef.value?.validateForm()
    }

    return true
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    await saveCurrentFormData()

    const payload = buildPayload.value

    openMainLoader(true)
    const success = await _createAction(payload)
    openMainLoader(false)

    if (!success) return

    basicDataFormRef.value?.resetForm()
    emitterFormRef.value?.resetForm()
    complianceFormRef.value?.resetForm()
    resetFormData()

    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name
  }

  // Watch para sincronizar cambios en tiempo real
  watch(tabActive, async (_, oldTab) => {
    if (oldTab) {
      await saveCurrentFormData()
    }
  })

  onMounted(() => loadResources())

  onBeforeMount(() => {
    _resetKeys({ investment_portfolio: keys })
    resetFormData()
  })

  return {
    nextTab,
    backTab,
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    emitterFormRef,
    headerProperties,
    handleSubmitForm,
    complianceFormRef,
    basicDataFormRef,
    defaultIconsLucide,
  }
}

export default useForeignCurrencyEquityStockSaleCreate
