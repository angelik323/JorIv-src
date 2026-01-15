import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useUtils } from '@/composables'

import { IEmitterFormData } from '@/interfaces/customs'

import {
  useInvestmentPortfolioResourceStore,
  useRegisterSharePurchaseLocalCurrencyStore,
} from '@/stores'

const useEmitterForm = () => {
  const { _setPercentageOrFixedValue } =
    useRegisterSharePurchaseLocalCurrencyStore('v1')
  const { watchAndUpdateDescription } = useUtils()

  const {
    issuer_seller,
    currency_local,
    administrators_codes,
    isin_code_mnemonics_local,
    paper_type_local_currency,
    local_currency_share_class,
    issuer_counterparty_local_currency,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const emitterFormRef = ref()

  const formData = ref<IEmitterFormData>({
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
    commission_base: null,
    percentage_or_fixed_value: null,
    unit_or_share: '',
    has_commision: true,
  })

  const selectOptions = computed(() => ({
    issuers: issuer_seller.value,
    isin: isin_code_mnemonics_local.value,
    currencyLocal: currency_local.value,
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
      optionsKey: 'currencyLocal',
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
    (newValue) => {
      _setPercentageOrFixedValue(newValue)
    }
  )

  return {
    formData,
    resetForm,
    selectOptions,
    emitterFormRef,
  }
}
export default useEmitterForm
