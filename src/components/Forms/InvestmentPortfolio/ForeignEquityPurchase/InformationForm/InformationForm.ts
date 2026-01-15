import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { useUtils } from '@/composables'

import {
  useForeignEquityPurchaseStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useInformationForm = () => {
  const { watchAndUpdateDescription } = useUtils()
  const { _setHasCommission, _setNumberDays } =
    useForeignEquityPurchaseStore('v1')
  const {
    operation_type_code_local_currency,
    investment_portfolio_code_local_currency,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const informationFormRef = ref()

  const formData = ref({
    investment_portfolio_id: null,
    description_portfolio_name: '',
    portfolio_operation_date: moment().format('YYYY-MM-DD'),
    operation_type_id: null,
    operation_type_description: '',
    has_commision: false,
    negotiation: false,
    number_days: null,
  })

  const selectOptions = computed(() => ({
    operation_type: operation_type_code_local_currency.value,
    investment_portfolio: investment_portfolio_code_local_currency.value,
  }))

  const resetForm = () => {
    formData.value = {
      investment_portfolio_id: null,
      description_portfolio_name: '',
      portfolio_operation_date: moment().format('YYYY-MM-DD'),
      operation_type_id: null,
      operation_type_description: '',
      has_commision: false,
      negotiation: false,
      number_days: null,
    }
  }

  const descriptionBindings = [
    {
      sourceKey: 'investment_portfolio_id',
      optionsKey: 'investment_portfolio',
      descriptionKey: 'description_portfolio_name',
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

  watch(
    () => formData.value.has_commision,
    (newVal) => {
      _setHasCommission(newVal)
    }
  )

  watch(
    () => formData.value.number_days,
    (newVal) => {
      _setNumberDays(newVal)
    }
  )

  return {
    formData,
    resetForm,
    selectOptions,
    informationFormRef,
  }
}
export default useInformationForm
