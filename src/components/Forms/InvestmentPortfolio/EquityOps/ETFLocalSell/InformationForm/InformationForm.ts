import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { useUtils } from '@/composables'

import { IEtfLocalBuyOperationResponse } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

import {
  useResourceManagerStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useInformationForm = (props: { action: ActionType; data?: {} }) => {
  const { watchAndUpdateDescription } = useUtils()

  const { _getResources } = useResourceManagerStore('v1')
  const {
    investment_portfolio_code_local_currency,
    operation_type_code_local_currency,
    exchange_traded_fund_local,
    paper_type_local_currency,
    issuer_seller,
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
    operation_number_days: null,
    commission_base: 'Manual',
    commission_value: null,

    status: '',
    title_number: '',
    operation_number: '',
    compliance_quantity_units: '',
    compliance_value_unit_buy: '',
    compliance_value_compliance: '',
    compliance_operation_date: '',
  })

  const selectOptions = computed(() => ({
    investment_portfolio: investment_portfolio_code_local_currency.value,
    operation_type: operation_type_code_local_currency.value,
    paper_type: paper_type_local_currency.value,
    etfs: exchange_traded_fund_local.value,
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

  const onSelectETF = async (selectedId: string) => {
    const selected = selectOptions.value.etfs.find(
      (etf) => etf.value === selectedId
    )

    if (!selected) return

    formData.value.exchange_traded_fund_id = selectedId

    await _getResources(
      {
        investment_portfolio: ['available_title_for_sell_exchange_traded_fund'],
      },
      `filter[exchange_traded_fund_id]=${selectedId}`
    )

    Object.assign(formData.value, {
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
    const api: IEtfLocalBuyOperationResponse = props.data

    Object.assign(formData.value, {
      title_number: api.basic_information?.title_number,
      operation_number: api.basic_information?.operation_number,
      operation_date: api.basic_information?.operation_date,
      operation_type_id: api.basic_information?.operation_type?.code,
      operation_type_description:
        api.basic_information?.operation_type?.description,
      status: api.basic_information?.status?.status,

      investment_portfolio_id:
        api.basic_information?.investment_portfolio?.code,
      investment_portfolio_description:
        api.basic_information?.investment_portfolio?.description,

      exchange_traded_fund_id:
        api.business_condition?.exchange_traded_fund?.code,
      exchange_traded_fund_description:
        api.business_condition?.exchange_traded_fund?.description,
      exchange_traded_fund_isin:
        api.business_condition?.exchange_traded_fund?.isin?.description,
      exchange_traded_fund_mnemonic:
        api.business_condition?.exchange_traded_fund?.isin?.mnemonic,
      exchange_traded_fund_administrator_nit:
        api.business_condition?.exchange_traded_fund?.administrator?.nit,
      exchange_traded_fund_administrator_description:
        api.business_condition?.exchange_traded_fund?.administrator
          ?.description,
      exchange_traded_fund_transmitter_nit:
        api.business_condition?.exchange_traded_fund?.transmitter?.nit,
      exchange_traded_fund_transmitter_description:
        api.business_condition?.exchange_traded_fund?.transmitter?.description,

      seller_id: api.business_condition?.seller?.number_document,
      seller_description: api.business_condition?.seller?.description,

      paper_type_id: api.business_condition?.paper_type?.code,

      operation_number_days: api.business_condition?.operation_number_days,

      commission_base:
        api.business_condition?.commission?.description ?? 'Valor manual',
      commission_value: api.business_condition?.commission?.value,

      compliance_quantity_units: api.compliance_condition?.quantity_units,
      compliance_value_unit_buy: api.compliance_condition?.value_unit_buy,
      compliance_value_compliance: api.compliance_condition?.value_compliance,
      compliance_operation_date: api.compliance_condition?.operation_date,
    })
  }

  return {
    isView,
    formData,
    onSelectETF,
    selectOptions,
    informationFormRef,
  }
}
export default useInformationForm
