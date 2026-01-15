import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { useUtils } from '@/composables'

import { ActionType } from '@/interfaces/global'
import {
  IFieldConfigExchangeTradedFund,
  IEtfForeignBuyOperationResponse,
} from '@/interfaces/customs'

import { useInvestmentPortfolioResourceStore } from '@/stores'

const useInformationForm = (props: { action: ActionType; data?: {} }) => {
  const { watchAndUpdateDescription, formatCurrencyString } = useUtils()

  const {
    exchange_traded_fund_foreign,
    investment_portfolio,
    operation_type,
    issuer_seller,
    paper_type,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const informationFormRef = ref()

  const formData = ref({
    operation_date: moment().format('YYYY-MM-DD'),
    investment_portfolio_id: null,
    investment_portfolio_description: '',
    operation_type_id: null,
    operation_type_description: '',
    exchange_traded_fund_id: null as string | number | null,
    exchange_traded_fund_description: '' as string | undefined,
    exchange_traded_fund_isin: null as string | null,
    exchange_traded_fund_mnemonic: null as string | number | null,
    exchange_traded_fund_administrator_nit: null as string | null,
    exchange_traded_fund_administrator_description: null as string | null,
    exchange_traded_fund_transmitter_nit: null as string | null,
    exchange_traded_fund_transmitter_description: null as string | null,
    seller_id: null,
    seller_description: '',
    paper_type_id: null,
    quantity_units: null,
    operation_number_days: null,
    folio_number: null,
    commission_base: 'Manual',
    commission_value: null,

    title_number: '',
    operation_number: '',
    status: '',

    compliance_quantity_units: '',
    compliance_currency: '',
    compliance_value: '',
    compliance_factor_conversion: '',
    compliance_origin_currency: '',
    compliance_origin_value: '',
    colocation_resources_date: '',
    compliance_date: '',

    value_compliance_currency: '',
    value_compliance_commission: '',
    value_compliance_value_currency: '',
    value_compliance_total: '',
    value_compliance_unit: '',

    value_compliance_origin_currency: '',
    value_compliance_origin_value: '',
    value_compliance_origin_commission: '',
    value_compliance_origin_total: '',
    value_compliance_origin_unit: '',

    value_compliance_local_currency: '',
    value_compliance_local_commission: '',
    value_compliance_local_value_currency: '',
    value_compliance_local_total: '',
    value_compliance_local_unit: '',
  })

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio.value,
    etfs: exchange_traded_fund_foreign.value,
    operation_type: operation_type.value,
    paper_type: paper_type.value,
    sellers: issuer_seller.value,
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
      {
        sourceKey: 'seller_id',
        optionsKey: 'sellers',
        descriptionKey: 'seller_description',
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

  const onSelectETF = (selectedId: string) => {
    const selected = selectOptions.value.etfs.find(
      (etf) => etf.value === selectedId
    )

    if (!selected) return

    Object.assign(formData.value, {
      exchange_traded_fund_id: selected.value,
      exchange_traded_fund_description: selected.description,
      exchange_traded_fund_isin: selected.isin?.description,
      exchange_traded_fund_mnemonic: selected.isin?.mnemonic,
      exchange_traded_fund_administrator_nit: selected.administrator?.nit,
      exchange_traded_fund_administrator_description:
        selected.administrator?.description,
      exchange_traded_fund_transmitter_nit: selected.transmitter?.nit,
      exchange_traded_fund_transmitter_description:
        selected.transmitter?.description,
    })
  }

  if (props.data) {
    const api: IEtfForeignBuyOperationResponse = props.data

    Object.assign(formData.value, {
      title_number: api.basic_data?.title_number,
      operation_number: api.basic_data?.operation_number,
      operation_date: api.basic_data?.operation_date,
      operation_type_id: api.basic_data?.operation_type?.code,
      operation_type_description: api.basic_data?.operation_type?.description,
      status: api.basic_data?.status?.description,

      investment_portfolio_id: api.basic_data?.investment_portfolio?.code,
      investment_portfolio_description:
        api.basic_data?.investment_portfolio?.description,

      exchange_traded_fund_id:
        api.negotiation_conditions?.exchange_traded_fund?.code,
      exchange_traded_fund_description:
        api.negotiation_conditions?.exchange_traded_fund?.description,
      exchange_traded_fund_isin:
        api.negotiation_conditions?.exchange_traded_fund?.isin?.description,
      exchange_traded_fund_mnemonic:
        api.negotiation_conditions?.exchange_traded_fund?.isin?.mnemonic,
      exchange_traded_fund_administrator_nit:
        api.negotiation_conditions?.exchange_traded_fund?.administrator?.nit,
      exchange_traded_fund_administrator_description:
        api.negotiation_conditions?.exchange_traded_fund?.administrator
          ?.description,
      exchange_traded_fund_transmitter_nit:
        api.negotiation_conditions?.exchange_traded_fund?.transmitter?.nit,
      exchange_traded_fund_transmitter_description:
        api.negotiation_conditions?.exchange_traded_fund?.transmitter
          ?.description,

      seller_id: api.negotiation_conditions?.seller?.nit,
      seller_description: api.negotiation_conditions?.seller?.description,

      paper_type_id: api.negotiation_conditions?.paper?.description,

      quantity_units: api.negotiation_conditions?.quantity_units,

      operation_number_days: api.negotiation_conditions?.operation_number_days,

      commission_base:
        api.negotiation_conditions?.commission_base ?? 'Valor manual',
      commission_value: api.negotiation_conditions?.commission_value,

      folio_number: api.negotiation_conditions?.folio_number,

      compliance_quantity_units: api.compliance_conditions?.quantity_units,
      compliance_currency:
        api.compliance_conditions?.compliance_currency?.currency,
      compliance_value:
        api.compliance_conditions?.compliance_currency?.value_currency,
      compliance_factor_conversion:
        api.compliance_conditions?.factor_conversion,
      compliance_origin_currency:
        api.compliance_conditions?.origin_currency?.currency,
      compliance_origin_value:
        api.compliance_conditions?.origin_currency?.value_currency,
      colocation_resources_date:
        api.compliance_conditions?.colocation_resources_date,
      compliance_date: api.compliance_conditions?.compliance_date,

      value_compliance_currency:
        api.compliance_values?.compliance_currency?.currency,
      value_compliance_commission:
        api.compliance_values?.compliance_currency?.value_commission,
      value_compliance_total:
        api.compliance_values?.compliance_currency?.value_total,
      value_compliance_unit:
        api.compliance_values?.compliance_currency?.value_unit,

      value_compliance_origin_currency:
        api.compliance_values?.origin_currency?.currency,
      value_compliance_origin_commission:
        api.compliance_values?.origin_currency?.value_commission,
      value_compliance_origin_total:
        api.compliance_values?.origin_currency?.value_total,
      value_compliance_origin_unit:
        api.compliance_values?.origin_currency?.value_unit,

      value_compliance_local_currency:
        api.compliance_values?.local_currency?.currency,
      value_compliance_local_commission:
        api.compliance_values?.local_currency?.value_commission,
      value_compliance_local_total:
        api.compliance_values?.local_currency?.value_total,
      value_compliance_local_unit:
        api.compliance_values?.local_currency?.value_unit,
    })
  }

  const complianceConditions: IFieldConfigExchangeTradedFund[] = [
    { label: 'Cantidad unidades', key: 'compliance_quantity_units' },
    { label: 'Moneda origen', key: 'compliance_currency' },
    {
      label: 'Valor moneda origen',
      key: 'compliance_value',
      format: formatCurrencyString,
    },
    { label: 'Factor de conversión', key: 'compliance_factor_conversion' },
    { label: 'Moneda cumplimiento', key: 'compliance_origin_currency' },
    {
      label: 'Valor moneda negociación',
      key: 'compliance_origin_value',
      format: formatCurrencyString,
    },
    { label: 'Fecha cumplimiento', key: 'compliance_date' },
    {
      label: 'Fecha de colocación de recursos',
      key: 'colocation_resources_date',
    },
  ]

  const complianceValues: IFieldConfigExchangeTradedFund[] = [
    { label: 'Moneda origen', key: 'value_compliance_origin_currency' },
    {
      label: 'Valor unidad compra moneda origen',
      key: 'value_compliance_origin_unit',
      format: formatCurrencyString,
    },
    {
      label: 'Valor comisión moneda origen',
      key: 'value_compliance_origin_commission',
      format: formatCurrencyString,
    },
    {
      label: 'Valor total moneda origen',
      key: 'value_compliance_origin_total',
      format: formatCurrencyString,
    },
    { label: 'Moneda local', key: 'value_compliance_local_currency' },
    {
      label: 'Valor unidad compra moneda local',
      key: 'value_compliance_local_unit',
      format: formatCurrencyString,
    },
    {
      label: 'Valor comisión moneda local',
      key: 'value_compliance_local_commission',
      format: formatCurrencyString,
    },
    {
      label: 'Valor total moneda local',
      key: 'value_compliance_local_total',
      format: formatCurrencyString,
    },
    { label: 'Moneda cumplimiento', key: 'value_compliance_currency' },
    {
      label: 'Valor unidad compra moneda cumplimiento',
      key: 'value_compliance_unit',
      format: formatCurrencyString,
    },
    {
      label: 'Valor comisión moneda cumplimiento',
      key: 'value_compliance_commission',
      format: formatCurrencyString,
    },
    {
      label: 'Valor total moneda cumplimiento',
      key: 'value_compliance_total',
      format: formatCurrencyString,
    },
  ]

  return {
    isView,
    formData,
    onSelectETF,
    selectOptions,
    complianceValues,
    informationFormRef,
    complianceConditions,
  }
}
export default useInformationForm
