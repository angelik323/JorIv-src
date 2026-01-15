import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { ITabs } from '@/interfaces/global'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import {
  useResourceManagerStore,
  useDefinitionAccountingParametersStore,
} from '@/stores'
import { IDefinitionAccountingParametersForm } from '@/interfaces/customs'

const useDefinitionAccountingParametersEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const { openMainLoader } = useMainLoader()

  const {
    _updateDefinitionAccountingParameters,
    _getByIdDefinitionAccountingParameters,
    _clearData,
  } = useDefinitionAccountingParametersStore('v1')
  const {
    definition_accounting_parameters_view,
    definition_accounting_parameters_details,
    definition_accounting_parameters_positions,
    definition_accounting_parameters_derivates,
    is_required_fields_positions,
    is_required_fields_derivates,
  } = storeToRefs(useDefinitionAccountingParametersStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: ['business_trust_types', 'business_trusts'],
    accounting: [
      'account_structures_available',
      'cost_center',
      'receipt_types',
      'accounts_charts',
    ],
    investment_portfolio: [
      'operation_type',
      'paper_types_form_parameters',
      'class_investment',
      'type_auxiliary',
    ],
  }

  const definitionAccountingParametersId = +route.params.id
  const basicDataFormRef = ref()
  const detailFormRef = ref()
  const positionFormRef = ref()
  const derivateFormRef = ref()
  const isInitialized = ref(false)

  const headerProps = {
    title: 'Editar parámetro contable',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Parámetros contables',
        route: 'DefinitionAccountingParametersList',
      },
      {
        label: 'Editar',
        route: 'DefinitionAccountingParametersEdit',
      },
      {
        label: `${definitionAccountingParametersId}`,
      },
    ],
  }

  const tabsBasic = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const tabs = ref<ITabs[]>([
    {
      name: 'details',
      label: 'Detalle parámetro',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'positions',
      label: 'Detalle parámetros contables posiciones',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'derivates',
      label: 'Detalle parámetros contables derivados',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActiveBasic = ref(tabsBasic.value[0].name)
  const tabActiveIdxBasic = ref(
    tabsBasic.value.findIndex((tab) => tab.name === tabActiveBasic.value)
  )

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const makeDataRequest = (): IDefinitionAccountingParametersForm => {
    return {
      details: definition_accounting_parameters_details.value
        ? [definition_accounting_parameters_details.value]
        : [],
      positions:
        is_required_fields_positions.value &&
        definition_accounting_parameters_positions.value
          ? [definition_accounting_parameters_positions.value]
          : [],
      derivatives:
        is_required_fields_derivates.value &&
        definition_accounting_parameters_derivates.value
          ? [definition_accounting_parameters_derivates.value]
          : [],
    }
  }

  const validateFormBasicData = async () => {
    return (await basicDataFormRef.value?.validateForm()) ?? false
  }

  const validateFormDetail = async () => {
    return (await detailFormRef.value?.validateForm()) ?? false
  }

  const validateFormPosition = async () => {
    return (await positionFormRef.value?.validateForm()) ?? false
  }

  const validateFormDerivate = async () => {
    return (await derivateFormRef.value?.validateForm()) ?? false
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const nextTab = async () => {
    if (tabActive.value === 'details') {
      if (!(await validateFormDetail())) return
    }

    if (tabActive.value === 'positions') {
      if (!(await validateFormPosition())) return
    }

    if (tabActive.value === 'derivates') {
      if (!(await validateFormDerivate())) return
    }

    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateFormBasicData()) || !(await validateFormDerivate()))
      return
    openMainLoader(true)

    try {
      const payload = makeDataRequest()
      const success = await _updateDefinitionAccountingParameters(
        payload,
        definitionAccountingParametersId
      )

      if (success) {
        router.push({ name: 'DefinitionAccountingParametersList' })
      }
    } finally {
      openMainLoader(false)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    try {
      await _getByIdDefinitionAccountingParameters(
        definitionAccountingParametersId
      )
      await _getResources(keys)
    } finally {
      openMainLoader(false)
      isInitialized.value = true
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _clearData()
  })

  return {
    headerProps,
    tabsBasic,
    tabActiveBasic,
    tabActiveIdxBasic,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    detailFormRef,
    positionFormRef,
    derivateFormRef,
    definition_accounting_parameters_view,
    isInitialized,

    backTab,
    nextTab,
    onSubmit,
  }
}

export default useDefinitionAccountingParametersEdit
