import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useUtils } from '@/composables'

import {
  useResourceManagerStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useComplianceForm = () => {
  const { watchAndUpdateDescription } = useUtils()

  const {
    available_title_for_foreign_sell_exchange_traded_fund: available_title,
    exchange_traded_fund_foreign,
    coins_exchange_traded_fund,
    issuer_counterparty_all,
    emitter_buyer,
    paper_type,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')

  const complianceFormRef = ref()

  const formData = ref({
    exchange_traded_fund_id: null as string | null,
    title_id: null,
    title_description: '',
    exchange_traded_fund_transmitter_nit: '',
    exchange_traded_fund_transmitter_description: '',
    buyer_id: null,
    buyer_description: '',
    commission_agent_id: null,
    commission_agent_description: '',
    seller_id: null,
    origin_currency_id: null,
    origin_currency_description: '',
    value_origin_currency: 0,
    value_commission_origin_currency: 0,
    quantity_sell_units: null as number | null,
    value_unit_origin_currency: null,
    unit_origin_currency: null,
    commission_base: '',
    commission_value: 0,
    operation: '',
  })

  const selectOptions = computed(() => ({
    commission_agents: issuer_counterparty_all.value,
    etfs: exchange_traded_fund_foreign.value,
    coins: coins_exchange_traded_fund.value,
    available_title: available_title.value,
    paper_type: paper_type.value,
    emitter: emitter_buyer.value,
  }))

  const descriptionBindings = [
    {
      sourceKey: 'title_id',
      optionsKey: 'available_title',
      descriptionKey: 'title_description',
    },
    {
      sourceKey: 'buyer_id',
      optionsKey: 'emitter',
      descriptionKey: 'buyer_description',
    },
    {
      sourceKey: 'commission_agent_id',
      optionsKey: 'commission_agents',
      descriptionKey: 'commission_agent_description',
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

  const onSelectETF = async (selectedId: string) => {
    const selected = selectOptions.value.etfs.find(
      (etf) => etf.value === selectedId
    )

    if (!selected) return

    formData.value.exchange_traded_fund_id = selectedId

    await _getResources(
      {
        investment_portfolio: [
          'available_title_for_foreign_sell_exchange_traded_fund',
        ],
      },
      `filter[exchange_traded_fund_id]=${selectedId}`
    )

    Object.assign(formData.value, {
      exchange_traded_fund_transmitter_nit: selected.transmitter?.nit,
      exchange_traded_fund_transmitter_description:
        selected.transmitter?.description,
      origin_currency_id: selected.currency?.id ?? null,
    })
  }

  watch(
    () => formData.value.origin_currency_id,
    (newId) => {
      const selected = selectOptions.value.coins.find(
        (coin) => coin.value === String(newId)
      )

      if (selected) {
        formData.value.origin_currency_description = selected.label
        formData.value.value_origin_currency = parseFloat(
          Number(selected.rate).toFixed(6)
        )
      } else formData.value.value_origin_currency = 0
    }
  )

  watch(
    () => formData.value.title_id,
    (newId) => {
      const selectedOption = available_title.value.find(
        (item) => item.value === newId
      )

      if (selectedOption)
        formData.value.quantity_sell_units = Number(selectedOption.label)
      else formData.value.quantity_sell_units = null
    }
  )

  watch(
    [
      () => formData.value.value_unit_origin_currency,
      () => formData.value.quantity_sell_units,
      () => formData.value.commission_value,
      () => formData.value.commission_base,
      () => formData.value.operation,
    ],
    ([unit, qty, commVal, base, operation]) => {
      const valueUnit = Number(unit) || 0
      const quantity = Number(qty) || 0
      const commissionPercent = Number(commVal) || 0
      const baseNormalized = base || ''

      let commission = 0

      if (baseNormalized === 'Valor Operación') {
        if (operation === 'Spot')
          commission =
            valueUnit *
            quantity *
            (commissionPercent / 100) *
            Number(formData.value.value_origin_currency.toFixed(6))
        else commission = valueUnit * quantity * (commissionPercent / 100)
      } else if (baseNormalized === 'Valor Manual') {
        commission = commissionPercent
      }

      formData.value.value_commission_origin_currency = parseFloat(
        commission.toFixed(2)
      )
    },
    { immediate: true }
  )

  return {
    formData,
    onSelectETF,
    selectOptions,
    complianceFormRef,
  }
}
export default useComplianceForm
