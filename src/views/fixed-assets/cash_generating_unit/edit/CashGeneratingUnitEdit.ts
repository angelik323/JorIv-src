// core
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import { ICashUnitForm } from '@/interfaces/customs/fixed-assets/CashGeneratingUnit'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'

import { useCashGeneratingUnitStore } from '@/stores/fixed-assets/cash-generating-unit'

const useCashGeneratingUnitCreateEdit = () => {
  // hooks

  const route = useRoute()
  const id = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // refs
  const keys = ref({
    fixed_assets: ['affectation_type', 'uge', 'configuration_type'],
    trust_business: ['business_currency'],
  })

  const basicDataFormRef = ref()
  const cash_unit_form = ref<ICashUnitForm | null>()

  // stores

  const { _updateCasUnit, _getCashUnitById } = useCashGeneratingUnitStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  // configs
  const headerProps = {
    title: 'Editar UGE',
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
        label: 'Editar',
        route: 'CashGeneratingUnitEdit',
      },
      {
        label: `${id}`,
        route: '',
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

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!cash_unit_form.value) return
    const row = cash_unit_form.value ?? null

    const payload = {
      business_trust_id: row.business_trust_id,
      description: row.description,
      configuration_type_id: row.configuration_type_id,
      description_type: row.description_type,
      cash_flow_generation_date: row.cash_flow_generation_date,
      initial_value: row.initial_value,
    }

    openMainLoader(true)

    if (await _updateCasUnit(payload, id)) {
      goToURL('CashGeneratingUnitList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks

  onMounted(async () => {
    openMainLoader(true)
    cash_unit_form.value = await _getCashUnitById(id)

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onMounted(async () => {
    await _getResources(keys.value)
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
    handleEdit,
    goToURL,
  }
}

export default useCashGeneratingUnitCreateEdit
