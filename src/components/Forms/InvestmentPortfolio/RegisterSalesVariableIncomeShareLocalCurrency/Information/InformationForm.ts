import { computed, ref, watch } from 'vue'
import { QForm } from 'quasar'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { useUtils } from '@/composables'
import {
  useInvestmentPortfolioResourceStore,
  useRegisterShareSaleLocalCurrencyStore,
} from '@/stores'
import {
  IOption,
  IInformationFormData,
  IInformationSelectOptions,
} from '@/interfaces/customs'

const useInformationForm = () => {
  const { watchAndUpdateDescription } = useUtils()

  const { _setHasCommission } = useRegisterShareSaleLocalCurrencyStore('v1')

  const resources = useInvestmentPortfolioResourceStore('v1')
  const {
    operation_type_code_local_currency,
    investment_portfolio_code_local_currency,
  } = storeToRefs(resources)

  const informationFormRef = ref<QForm | null>(null)

  const formData = ref<IInformationFormData>({
    investment_portfolio_id: null,
    description_portfolio_name: '',
    operation_date: moment().format('YYYY-MM-DD'),
    operation_type_id: null,
    operation_type_description: '',
    has_commission: false,
  })

  const selectOptions = computed<IInformationSelectOptions>(() => ({
    operation_type: (operation_type_code_local_currency.value ??
      []) as IOption[],
    investment_portfolio: (investment_portfolio_code_local_currency.value ??
      []) as IOption[],
  }))

  const resetForm = () => {
    formData.value = {
      investment_portfolio_id: null,
      description_portfolio_name: '',
      operation_date: moment().format('YYYY-MM-DD'),
      operation_type_id: null,
      operation_type_description: '',
      has_commission: false,
    }
  }

  ;(
    [
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
  ).forEach(({ sourceKey, optionsKey, descriptionKey }) => {
    watchAndUpdateDescription(
      formData,
      selectOptions,
      sourceKey,
      optionsKey,
      descriptionKey
    )
  })

  watch(
    () => formData.value.has_commission,
    (hasCommission) => {
      _setHasCommission(hasCommission)
    }
  )

  return {
    informationFormRef,
    formData,
    selectOptions,
    resetForm,
  }
}

export default useInformationForm
