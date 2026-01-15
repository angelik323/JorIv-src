import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { useUtils } from '@/composables'

import { useInvestmentPortfolioResourceStore } from '@/stores'
import { IBasicDataForeignFormData } from '@/interfaces/customs'

const useBasicDataForm = () => {
  const { watchAndUpdateDescription } = useUtils()

  const {
    operation_type_code_local_currency,
    investment_portfolio_code_local_currency,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const basicDataFormRef = ref()

  const formData = ref<IBasicDataForeignFormData>({
    investment_portfolio_id: null,
    portfolio_operation_date: new Date().toISOString().substring(0, 10),
    operation_id: null,
    commission: false,
    negotiation: 'Operación de contado',
    number_days: 0,
    investment_portfolio_description: '',
    operation_description: '',
  })

  const selectOptions = computed(() => ({
    operation_type: operation_type_code_local_currency.value,
    investment_portfolio: investment_portfolio_code_local_currency.value,
  }))

  const resetForm = () => {
    formData.value = {
      investment_portfolio_id: null,
      portfolio_operation_date: moment().format('YYYY-MM-DD'),
      operation_id: null,
      commission: false,
      negotiation: 'Operación de contado',
      number_days: 0,
      investment_portfolio_description: '',
      operation_description: '',
    }
    basicDataFormRef.value?.reset()
  }

  const descriptionBindings = [
    {
      sourceKey: 'investment_portfolio_id',
      optionsKey: 'investment_portfolio',
      descriptionKey: 'investment_portfolio_description',
    },
    {
      sourceKey: 'operation_id',
      optionsKey: 'operation_type',
      descriptionKey: 'operation_description',
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

  return {
    formData,
    resetForm,
    selectOptions,
    basicDataFormRef,
  }
}
export default useBasicDataForm
