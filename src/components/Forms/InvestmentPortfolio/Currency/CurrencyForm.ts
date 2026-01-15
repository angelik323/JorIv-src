// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ICurrencyInformationForm } from '@/interfaces/customs/investment-portfolio/Currency'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

const useInformationForm = (
  props: {
    action: ActionType
    data: ICurrencyInformationForm | null
  },
  emit: Function
) => {
  const { type_of_coins } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { isEmptyOrZero, sanitizeNumericInput, formatUnitsString } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: ICurrencyInformationForm = {
    code: null,
    description: null,
    currency_type: null,
    value: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  // Sincroniza el modelo con la prop 'data'
  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    type_of_coins,
    formElementRef,
    models,
    sanitizeNumericInput,
    formatUnitsString,
  }
}

export default useInformationForm
