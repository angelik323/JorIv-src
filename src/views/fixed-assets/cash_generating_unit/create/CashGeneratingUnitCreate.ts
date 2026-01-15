// core
import { onBeforeUnmount, onMounted, ref } from 'vue'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import { ICashUnitForm } from '@/interfaces/customs/fixed-assets/CashGeneratingUnit'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'

import { useCashGeneratingUnitStore } from '@/stores/fixed-assets/cash-generating-unit'

const useCashGeneratingUnitCreate = () => {
  // hooks
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // refs
  const keys = ref({
    fixed_assets: ['uge','configuration_type'],
    trust_business: ['business_currency'],
  })
  const keys2 = ref({
    trust_business: ['business_trusts'],
  })

  const basicDataFormRef = ref()
  const cash_unit_form = ref<ICashUnitForm | null>()

  // stores

  const { _createCashUnit } = useCashGeneratingUnitStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  // configs
  const headerProps = {
    title: 'Crear UGE',
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
        label: 'Unidades generadoras de efectivo',
        route: 'CashGeneratingUnitList',
      },
      {
        label: 'Crear',
        route: 'CashGeneratingUnitCreate',
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
  const makePayload = (): ICashUnitForm | null => {
    return cash_unit_form.value ?? null
  }

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!cash_unit_form.value) return

    openMainLoader(true)
    const payload = makePayload()!

    if (await _createCashUnit(payload)) {
      goToURL('CashGeneratingUnitList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onMounted(async () => {
    await _getResources(keys.value, '', 'v1')
    await _getResources(keys2.value, 'business_trusts&filter[effect]=true')
  })

  onBeforeUnmount(() => _resetKeys(keys.value))

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    cash_unit_form,

    // methods
    handleCreate,
    goToURL,
  }
}

export default useCashGeneratingUnitCreate
