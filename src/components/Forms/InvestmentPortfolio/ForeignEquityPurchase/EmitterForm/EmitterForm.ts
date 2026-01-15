import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useUtils } from '@/composables'

import { IEmitterFormForeign } from '@/interfaces/customs'

import {
  useForeignEquityPurchaseStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'

const useEmitterForm = () => {
  const { watchAndUpdateDescription } = useUtils()
  const { _setPercentageOrFixedValue, _setCurrencyId } =
    useForeignEquityPurchaseStore('v1')

  const { hasCommission } = storeToRefs(useForeignEquityPurchaseStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    issuer_seller,
    currency_foreign,
    administrators_codes,
    isin_code_mnemonics,
    paper_type_local_currency,
    local_currency_share_class,
    issuer_counterparty_local_currency,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const emitterFormRef = ref()

  const formData = ref<IEmitterFormForeign>({
    issuers_counterparty_id: null,
    issuers_counterparty_description: '',
    action_class: '',
    paper_type_id: null,
    isin_code_id: null,
    nemoten_code_id: '',
    issuers_counterparty_seller_id: null,
    issuers_counterparty_seller_description: '',
    issuers_counterparty_administrator_id: null,
    issuers_counterparty_administrator_description: '',
    issuers_counterparty_commissioner_id: null,
    issuers_counterparty_commissioner_description: '',
    currency_id: null,
    value_currency: '',
    commission_base: false,
    percentage_or_fixed_value: null,
    unit_or_share: '',
  })

  const selectOptions = computed(() => ({
    issuers: issuer_seller.value,
    currencyForeign: currency_foreign.value,
    isin: isin_code_mnemonics.value,
    paperType: paper_type_local_currency.value,
    administrators: administrators_codes.value,
    actionClass: local_currency_share_class.value,
    issuersCounterparties: issuer_counterparty_local_currency.value,
  }))

  const descriptionBindings = [
    {
      sourceKey: 'issuers_counterparty_id',
      optionsKey: 'issuersCounterparties',
      descriptionKey: 'issuers_counterparty_description',
    },
    {
      sourceKey: 'issuers_counterparty_seller_id',
      optionsKey: 'issuers',
      descriptionKey: 'issuers_counterparty_seller_description',
    },
    {
      sourceKey: 'issuers_counterparty_administrator_id',
      optionsKey: 'administrators',
      descriptionKey: 'issuers_counterparty_administrator_description',
    },
    {
      sourceKey: 'issuers_counterparty_commissioner_id',
      optionsKey: 'issuersCounterparties',
      descriptionKey: 'issuers_counterparty_commissioner_description',
    },
    {
      sourceKey: 'currency_id',
      optionsKey: 'currencyForeign',
      descriptionKey: 'value_currency',
    },
    {
      sourceKey: 'isin_code_id',
      optionsKey: 'isin',
      descriptionKey: 'nemoten_code_id',
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

  const resetForm = () => {
    formData.value = {
      issuers_counterparty_id: null,
      issuers_counterparty_description: '',
      action_class: '',
      paper_type_id: null,
      isin_code_id: null,
      nemoten_code_id: '',
      issuers_counterparty_seller_id: null,
      issuers_counterparty_seller_description: '',
      issuers_counterparty_administrator_id: null,
      issuers_counterparty_administrator_description: '',
      issuers_counterparty_commissioner_id: null,
      issuers_counterparty_commissioner_description: '',
      currency_id: null,
      value_currency: '',
      commission_base: false,
      percentage_or_fixed_value: null,
      unit_or_share: '',
    }
  }

  watch(
    () => formData.value.percentage_or_fixed_value,
    (newVal) => {
      _setPercentageOrFixedValue(newVal)
    }
  )

  watch(
    () => formData.value.currency_id,
    (newVal) => {
      _setCurrencyId(newVal)
    }
  )

  watch(
    () => hasCommission.value,
    (newVal) => {
      formData.value.has_commission = newVal
      if (!newVal) {
        formData.value.commission_base = false
        formData.value.percentage_or_fixed_value = 0
      }
    },
    { immediate: true }
  )

  watch(
    () => formData.value.issuers_counterparty_id,
    async (issuerId) => {
      await _resetKeys({
        investment_portfolio: ['isin_code_mnemonics'],
      })
      formData.value.isin_code_id = null
      formData.value.nemoten_code_id = ''
      if (!issuerId) return
      await _getResources({
        investment_portfolio: [
          `isin_code_mnemonics&filter[issuer_id]=${issuerId}`,
        ],
      })
    }
  )

  watch(
    () => formData.value.isin_code_id,
    (isinId) => {
      if (!isinId) return
      const selectedIsin = isin_code_mnemonics.value.find(
        (isin) => isin.isin_code_id === isinId
      )
      formData.value.nemoten_code_id = selectedIsin?.mnemonic || ''
    }
  )

  return {
    formData,
    resetForm,
    selectOptions,
    emitterFormRef,
    hasCommission,
  }
}
export default useEmitterForm
