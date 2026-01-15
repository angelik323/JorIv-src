import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { useUtils } from '@/composables'

import {
  IEtfForeignSellOperationResponse,
  IFieldConfigExchangeTradedFund,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import { useInvestmentPortfolioResourceStore } from '@/stores'

const useInformationForm = (props: { action: ActionType; data?: {} }) => {
  const { watchAndUpdateDescription, formatCurrencyString } = useUtils()

  const { investment_portfolio, operation_type } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const informationFormRef = ref()

  const formData = ref({
    operation_date: moment().format('YYYY-MM-DD'),
    investment_portfolio_id: null,
    investment_portfolio_description: '',
    operation_type_id: null,
    operation_type_description: '',
    operation: 'De Contado',
    operation_number_days: null,
    has_commission: false,
    commission_base: '',
    commission_value: null,

    title_number: '',
    title_description: '',
    title_available_units: '',
    operation_number: '',
    status: '',

    exchange_traded_fund_id: null,
    exchange_traded_fund_transmitter_nit: '',
    exchange_traded_fund_transmitter_description: '',

    buyer_id: null,
    buyer_description: '',
    seller_id: null,
    seller_description: '',
    commission_agent_id: null,
    commission_agent_description: '',

    compliance_quantity_units: '',
    compliance_currency: '',
    compliance_key: '',
    compliance_factor_conversion: '',
    compliance_origin_currency: '',
    compliance_origin_key: '',
    colocation_resources_date: '',
    compliance_date: '',
    compliance_spot: '',
  })

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio.value,
    operation_type: operation_type.value,
  }))

  const isView = computed(() => ['view'].includes(props.action))

  if (!isView.value) {
    const descriptionBindings = [
      {
        sourceKey: 'investment_portfolio_id',
        optionsKey: 'investment_portfolio',
        descriptionKey: 'investment_portfolio_description',
      },
      {
        sourceKey: 'operation_type_id',
        optionsKey: 'operation_type',
        descriptionKey: 'operation_type_description',
      },
    ] as const

    descriptionBindings.forEach(({ sourceKey, optionsKey, descriptionKey }) => {
      watchAndUpdateDescription(
        formData,
        selectOptions,
        sourceKey,
        optionsKey,
        descriptionKey
      )
    })
  }

  if (props.data) {
    const api: IEtfForeignSellOperationResponse = props.data

    Object.assign(formData.value, {
      operation_number: api.basic_information?.operation_number,
      operation_date: api.basic_information?.operation_date,
      operation_type_id: api.basic_information?.operation_type?.code,
      operation_type_description:
        api.basic_information?.operation_type?.description,
      status: api.basic_information?.status?.description,

      investment_portfolio_id:
        api.basic_information?.investment_portfolio?.code,
      investment_portfolio_description:
        api.basic_information?.investment_portfolio?.description,

      operation: api.negotiation_conditions?.operation,
      operation_number_days: api.negotiation_conditions?.operation_number_days,
      has_commission: api.negotiation_conditions?.has_commission,
      commission_base: api.negotiation_conditions?.commission_base,
      commission_value: api.negotiation_conditions?.commission_value,

      title_number: api.compliance_conditions?.title?.id,
      title_description: api.compliance_conditions?.title?.description,
      exchange_traded_fund_transmitter_nit:
        api.compliance_conditions?.exchange_traded_fund?.transmitter
          ?.number_document,
      exchange_traded_fund_transmitter_description:
        api.compliance_conditions?.exchange_traded_fund?.transmitter
          ?.description,
      exchange_traded_fund_id:
        api.compliance_conditions?.exchange_traded_fund?.code,
      buyer_id: api.compliance_conditions?.buyer?.number_document,
      buyer_description: api.compliance_conditions?.buyer?.description,
      commission_agent_id:
        api.compliance_conditions?.agent_commission?.number_document,
      commission_agent_description:
        api.compliance_conditions?.agent_commission?.description,
      value_compliance_currency:
        api.compliance_conditions?.origin_currency?.code,
      value_compliance_value_currency:
        api.compliance_conditions?.origin_currency?.value,
      value_compliance_commission:
        api.compliance_conditions?.origin_currency?.commission_value,
      title_available_units: api.compliance_conditions?.title?.available_units,
      value_compliance_unit: api.compliance_conditions?.units_sell,

      compliance_value: api.compliance_values?.is_compliance_origin_currency
        ? 'Sí'
        : 'No',
      compliance_currency: api.compliance_values?.compliance_currency?.code,
      compliance_date: api.compliance_values?.compliance_date,
      colocation_resources_date:
        api.compliance_values?.colocation_resources_date,
      compliance_origin_value: api.compliance_values?.origin_currency?.value,
      compliance_spot: api.compliance_values?.spot?.rate,
      compliance_factor_conversion: api.compliance_values?.factor_conversion,
      gyre_compliance_local_currency:
        api.compliance_values?.gyre_compliance_local_currency,
    })
  }

  const complianceConditions: IFieldConfigExchangeTradedFund[] = [
    { label: 'Número de título', key: 'title_number' },
    { label: 'Descripción título', key: 'title_description' },
    { label: 'NIT emisor', key: 'exchange_traded_fund_transmitter_nit' },
    {
      label: 'Descripción emisor',
      key: 'exchange_traded_fund_transmitter_description',
    },
    { label: "Número ETF's", key: 'exchange_traded_fund_id' },
    { label: 'NIT comprador', key: 'buyer_id' },
    { label: 'Descripción comprador', key: 'buyer_description' },
    { label: 'NIT comisionista', key: 'commission_agent_id' },
    {
      label: 'Descripción comisionista',
      key: 'commission_agent_description',
    },
    { label: 'Moneda origen', key: 'value_compliance_currency' },
    {
      label: 'Valor moneda origen',
      key: 'value_compliance_value_currency',
      format: formatCurrencyString,
    },
    {
      label: 'Valor comisión moneda origen',
      key: 'value_compliance_commission',
      format: formatCurrencyString,
    },
    {
      label: 'Cantidad de acciones disponibles',
      key: 'title_available_units',
    },
    { label: "Unidades ETF's venta", key: 'title_available_units' },
    {
      label: 'Valor unidad venta moneda origen',
      key: 'value_compliance_unit',
      format: formatCurrencyString,
    },
  ]

  const complianceValues: IFieldConfigExchangeTradedFund[] = [
    { label: 'Cumple en moneda origen', key: 'compliance_value' },
    { label: 'Moneda cumplimiento', key: 'compliance_currency' },
    { label: 'Fecha cumplimiento', key: 'compliance_date' },
    {
      label: 'Fecha colocación de recursos',
      key: 'colocation_resources_date',
    },
    {
      label: 'Valor moneda negociación',
      key: '-',
      format: formatCurrencyString,
    },
    {
      label: 'Valor moneda origen',
      key: 'compliance_origin_value',
      format: formatCurrencyString,
    },
    {
      label: 'Valor tasa spot',
      key: 'compliance_spot',
      format: formatCurrencyString,
    },
    {
      label: 'Factor de conversión',
      key: 'compliance_factor_conversion',
      format: formatCurrencyString,
    },
    {
      label: 'Giro cumplimiento moneda local',
      key: 'gyre_compliance_local_currency',
      format: formatCurrencyString,
    },
  ]

  watch(
    () => formData.value.has_commission,
    (newVal) => {
      if (!newVal) {
        formData.value.commission_value = null
        formData.value.commission_base = ''
      }
    }
  )

  return {
    isView,
    formData,
    selectOptions,
    complianceValues,
    informationFormRef,
    complianceConditions,
  }
}
export default useInformationForm
