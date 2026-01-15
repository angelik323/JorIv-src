import { computed, ref } from 'vue'
import { QForm } from 'quasar'
import { storeToRefs } from 'pinia'
import { useUtils } from '@/composables'
import { IEmitterForm, IOption, ISelectOptions } from '@/interfaces/customs'
import {
  useInvestmentPortfolioResourceStore,
  useRegisterShareSaleLocalCurrencyStore,
} from '@/stores'

const useEmitterForm = () => {
  const { watchAndUpdateDescription } = useUtils()
  const { hasCommission } = storeToRefs(
    useRegisterShareSaleLocalCurrencyStore('v1')
  )

  const resources = useInvestmentPortfolioResourceStore('v1')
  const {
    issuer_seller,
    local_currency_share_class,
    issuer_counterparty_local_currency,
  } = storeToRefs(resources)
  const emitterFormRef = ref<QForm | null>(null)

  const formData = ref<IEmitterForm>({
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
  })

  const selectOptions = computed<ISelectOptions>(() => ({
    issuers: (issuer_seller.value ?? []) as IOption[],
    actionClass: (local_currency_share_class.value ?? []) as IOption[],
    issuersCounterparties: (issuer_counterparty_local_currency.value ??
      []) as IOption[],
  }))

  ;(
    [
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
        sourceKey: 'issuers_counterparty_commissioner_id',
        optionsKey: 'issuersCounterparties',
        descriptionKey: 'issuers_counterparty_commissioner_description',
      },
    ] as const
  ).forEach(({ sourceKey, optionsKey, descriptionKey }) => {
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
      commission_base: null,
      percentage_or_fixed_value: null,
      unit_or_share: '',
    } as IEmitterForm
  }

  return { emitterFormRef, formData, selectOptions, hasCommission, resetForm }
}

export default useEmitterForm
