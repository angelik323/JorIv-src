import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'

import {
  useResourceManagerStore,
  useForeignSellExchangeTradedFundStore,
} from '@/stores'

const useETFForeignSellCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useForeignSellExchangeTradedFundStore('v1')

  const informationFormRef = ref()
  const complianceFormRef = ref()
  const valuesFormRef = ref()
  const isLoaded = ref(false)

  const keys = {
    investment_portfolio: [
      'exchange_traded_fund_foreign',
      'issuer_counterparty_all',
      'investment_portfolio',
      'operation_type',
      'emitter_buyer',
      'paper_type',
      'coins',
    ],
  }

  const headerProperties = {
    title: "Crear venta ETF's moneda extranjera",
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
        route: 'ETFForeignSellCreate',
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
    {
      name: 'values',
      label: 'Valores de cumplimiento',
      icon: defaultIconsLucide.dollarSign,
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

    const info = informationFormRef.value?.getValues()
    const compliance = complianceFormRef.value?.getValues()

    const valuesForm = valuesFormRef.value?.formData
    const complianceForm = complianceFormRef.value?.formData

    if (tabActive.value === 'information') {
      if (complianceForm) {
        complianceForm.commission_base = info.commission_base
        complianceForm.commission_value = info.commission_value
        complianceForm.operation = info.operation
      }

      if (valuesForm) {
        valuesForm.operation = info.operation

        valuesFormRef.value?.setComplianceDate(
          info.operation_date,
          info.operation_number_days
        )
      }
    }

    if (tabActive.value === 'compliance') {
      if (valuesForm) {
        valuesForm.origin_currency_id = compliance.origin_currency_id
        valuesForm.value_spot_rate = compliance.value_origin_currency
        valuesForm.quantity_sell_units = compliance.quantity_sell_units
        valuesForm.value_origin_currency = compliance.value_origin_currency
        valuesForm.value_unit_origin_currency =
          compliance.value_unit_origin_currency
        valuesForm.value_commission_origin_currency =
          compliance.value_commission_origin_currency
      }
    }

    tabActiveIdx.value += 1
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
    else if (tabActive.value === 'values')
      return await valuesFormRef.value?.validateForm()

    return true
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const information = informationFormRef.value?.getValues()
    const compliance = complianceFormRef.value?.getValues()
    const values = valuesFormRef.value?.getValues()

    openMainLoader(true)

    const payload = {
      basic_information: {
        investment_portfolio_id: Number(information.investment_portfolio_id),
        operation_type_id: Number(information.operation_type_id),
        operation_date: information.operation_date,
      },
      negotiation_conditions: {
        operation_number_days: Number(information.operation_number_days),
        commission_base: information.commission_base,
        commission_value: Number(information.commission_value),
        has_commission: information.has_commission,
        operation: information.operation,
      },
      compliance_conditions: {
        title_id: Number(compliance.title_id),
        exchange_traded_fund_id: Number(compliance.exchange_traded_fund_id),
        buyer_id: Number(compliance.buyer_id),
        commission_agent_id: Number(compliance.commission_agent_id),
        origin_currency_id: Number(compliance.origin_currency_id),
        value_commission_origin_currency: Number(
          compliance.value_commission_origin_currency
        ),
        quantity_sell_units: Number(compliance.quantity_sell_units),
        value_unit_origin_currency: Number(
          compliance.value_unit_origin_currency
        ),
        value_origin_currency: Number(compliance.value_origin_currency),

        compliance_currency_id: Number(compliance.compliance_currency_id),
        compliance_date: compliance.compliance_date,
      },
      values_compliance: {
        value_negotiation_currency: values.value_negotiation_currency,
        value_operation_origin_currency: values.value_operation_origin_currency,
        colocation_resources_date: values.colocation_resources_date,
        compliance_currency_id: Number(values.compliance_currency_id),
        factor_conversion: values.factor_conversion,
        compliance_date: values.compliance_date,
        compliance_origin_currency: values.compliance_origin_currency,
        value_unit_local_currency: values.value_unit_local_currency,
        value_commission_local_currency: values.value_commission_local_currency,
        value_total_local_currency: values.value_total_local_currency,
        value_unit_origin_currency: values.value_unit_origin_currency,
        value_commission_origin_currency:
          values.value_commission_origin_currency,
        value_total_origin_currency: values.value_total_origin_currency,
        value_unit_compliance_currency: values.value_unit_compliance_currency,
        value_commission_compliance_currency:
          values.value_commission_compliance_currency,
        value_total_compliance_currency: values.value_total_compliance_currency,
        gyre_compliance_local_currency: values.gyre_compliance_local_currency,
        value_spot_rate: Number(values.value_spot_rate),
        value_compliance_spot_rate: values.value_compliance_spot_rate,
      },
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

  onMounted(async () => await loadResources())

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    tabs,
    nextTab,
    backTab,
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    valuesFormRef,
    handleGoToList,
    headerProperties,
    handleSubmitForm,
    complianceFormRef,
    informationFormRef,
    defaultIconsLucide,
  }
}

export default useETFForeignSellCreate
