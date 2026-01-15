import { computed, onMounted, onBeforeMount, ref } from 'vue'

import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'
import {
  IEmitterFormData,
  IComplianceFormData,
  IRegisterSharePurchaseLocalCurrency,
} from '@/interfaces/customs'

import {
  useResourceManagerStore,
  useRegisterSharePurchaseLocalCurrencyStore,
} from '@/stores'

const useRegisterSharePurchaseLocalCurrencyCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _createAction } = useRegisterSharePurchaseLocalCurrencyStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const complianceFormRef = ref()
  const emitterFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio_code_local_currency',
    'operation_type_code_local_currency',
    'issuer_counterparty_local_currency',
    'local_currency_share_class',
    'paper_type_local_currency',
    'administrators_codes',
    'isin_code_mnemonics',
    'currency_local',
    'issuer_seller',
  ]

  const headerProperties = {
    title: 'Registro compra de acciones moneda local',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Registro compra de acciones moneda local',
        route: 'RegisterSharePurchaseLocalCurrencyCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
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

    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 1000)
  }

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const info = informationFormRef.value?.getValues()
    const emitter = emitterFormRef.value?.getValues()
    const compliance = complianceFormRef.value?.getValues()

    emitter.has_commision = info.has_commision
    compliance.commission_value =
      parseFloat(emitter.percentage_or_fixed_value) || 0
    compliance.commission_type = emitter.commission_base ? '%' : '$'
    compliance.has_commision = info.has_commision

    compliance.commission_base = emitter.commission_base

    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const validateForms = async () => {
    if (tabActive.value === 'information') {
      return await informationFormRef.value?.validateForm()
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

    const information = informationFormRef.value?.getValues()
    const emitter: IEmitterFormData = emitterFormRef.value?.getValues()
    const compliance: IComplianceFormData = complianceFormRef.value?.getValues()

    const payload: IRegisterSharePurchaseLocalCurrency = {
      ...information,
      issuer: {
        ...emitter,
        commission_base: emitter.commission_base ? 'Porcentaje' : 'Valor fijo',
      },
      unit_compliances: compliance,
    }

    openMainLoader(true)

    const success = await _createAction(payload)

    if (!success) {
      openMainLoader(false)
      return
    }

    setTimeout(() => {
      openMainLoader(false)

      informationFormRef.value?.resetForm()
      emitterFormRef.value?.resetForm()
      complianceFormRef.value?.resetForm()

      tabActiveIdx.value = 0
      tabActive.value = filteredTabs.value[0].name
    }, 1000)
  }

  onMounted(() => loadResources())

  onBeforeMount(() => _resetKeys({ investment_portfolio: keys }))

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
    informationFormRef,
    defaultIconsLucide,
  }
}

export default useRegisterSharePurchaseLocalCurrencyCreate
