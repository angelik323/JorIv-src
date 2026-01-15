import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { IEtfLocalSellOperation } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import {
  useResourceManagerStore,
  useLocalSellExchangeTradedFundStore,
} from '@/stores'

const useETFLocalSellCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useLocalSellExchangeTradedFundStore('v1')

  const informationFormRef = ref()
  const complianceFormRef = ref()
  const isLoaded = ref(false)

  const keys = {
    investment_portfolio: [
      'investment_portfolio_code_local_currency',
      'operation_type_code_local_currency',
      'exchange_traded_fund_local',
      'paper_type_local_currency',
      'issuer_seller',
    ],
  }

  const headerProperties = {
    title: "Crear venta ETF's moneda local",
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: "Operaciones ETF's",
        route: 'EquityOpsList',
      },
      {
        label: 'Crear',
        route: 'ETFLocalSellCreate',
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
      name: 'compliance',
      label: 'Condiciones de cumplimiento',
      icon: defaultIconsLucide.book,
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

    await _getResources(keys)

    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 1000)
  }

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    if (tabActive.value === 'information') {
      const info = informationFormRef.value?.getValues()
      const complianceForm = complianceFormRef.value?.formData

      complianceForm.commission_value = info.commission_value
      complianceForm.commission_base = info.commission_base

      complianceFormRef.value.setComplianceDate(
        info.operation_date,
        info.operation_number_days
      )
    }

    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const validateForms = async () => {
    if (tabActive.value === 'information')
      return await informationFormRef.value?.validateForm()
    else if (tabActive.value === 'compliance')
      return await complianceFormRef.value?.validateForm()

    return true
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const information = informationFormRef.value?.getValues()
    const compliance = complianceFormRef.value?.getValues()

    openMainLoader(true)

    const payload: IEtfLocalSellOperation = {
      title_id: Number(compliance.title_id),
      operation_date: information.operation_date,
      investment_portfolio_id: Number(information.investment_portfolio_id),
      operation_type_id: Number(information.operation_type_id),
      exchange_traded_fund_id: Number(information.exchange_traded_fund_id),
      paper_type_id: Number(information.paper_type_id),
      quantity_sell_units: compliance.quantity_sell_units,
      operation_number_days: Number(information.operation_number_days),
      commission_base: information.commission_base,
      commission_value: Number(information.commission_value),
      value_unit_sell: compliance.value_unit_sell,
      value_compliance: compliance.compliance_value,
      seller_id: Number(information.seller_id),
      value_real_commission: compliance.value_real_commission,
    }

    const success = await _createAction(payload)

    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({
      name: 'EquityOpsList',
      query: { reload: 'true' },
    })

  onMounted(() => loadResources())

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    tabs,
    nextTab,
    backTab,
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    handleSubmitForm,
    complianceFormRef,
    informationFormRef,
    defaultIconsLucide,
  }
}

export default useETFLocalSellCreate
