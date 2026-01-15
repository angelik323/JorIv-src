// vue
import { onBeforeUnmount, onMounted, ref } from 'vue'

// interfaces
import { ITabs } from '@/interfaces/global'
import { ICalculationForm } from '@/interfaces/customs/fixed-assets/CalculationDeterioration'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useCalculationDeteriorationStore } from '@/stores/fixed-assets/calculation-deterioration'

const useCalculationDeteriorationCreate = () => {
  // hooks
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  //stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createCalculation } = useCalculationDeteriorationStore('v1')

  // refs
  const key = ref({
    fixed_assets: [
      'uge',
      'type',
      'business_trusts_uge_impairment',
      'business_trusts_uge',
      'business_trusts_type',
      'business_trusts_subtypes',
      'fixed_asset_values',
    ],
    trust_business: ['business_currency'],
  })

  const basicDataFormRef = ref()
  const calculation_form = ref<ICalculationForm | null>()

  // configs
  const headerProps = {
    title: 'Cálculo de deterioro',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Activos fijos',
        route: '',
      },
      {
        label: 'Cálculo de deterioro',
        route: 'CalculationDeteriorationList',
      },
      {
        label: 'Crear',
        route: 'CalculationDeteriorationCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // actions

  const makePayload = (): ICalculationForm | null => {
    return calculation_form.value ?? null
  }

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!calculation_form.value) return

    openMainLoader(true)
    const payload = makePayload()!

    if (await _createCalculation(payload)) {
      goToURL('CalculationDeteriorationList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onMounted(async () => {
    await _getResources(key.value, '', 'v1')
  })
  onBeforeUnmount(() => _resetKeys(key.value))

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    calculation_form,

    // methods
    handleCreate,
    goToURL,
  }
}

export default useCalculationDeteriorationCreate
