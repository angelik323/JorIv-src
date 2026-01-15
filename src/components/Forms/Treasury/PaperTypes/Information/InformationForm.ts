// Vue - pinia
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { NonEditActionType } from '@/interfaces/global'
import { IPaperTypeInformationForm } from '@/interfaces/customs/investment-portfolio/TypePaper'
import { InversionTypeID } from '@/interfaces/global/InvestmentPortfolio'

// Composables - constants
import { useUtils } from '@/composables'
import {
  RATE_TYPE_OPTIONS,
  RATE_CLASS_OPTIONS,
  RATE_MODE_OPTIONS,
  FLOW_RATE_BASE_OPTIONS,
  FLOW_TYPE_OPTIONS,
  PAYMENT_FLOW_OPTIONS,
  AMORTIZATION_TYPE_OPTIONS,
} from '@/constants/resources/investment-portfolio'

// Stores
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

const useInformationForm = (
  props: {
    action: NonEditActionType
    data: IPaperTypeInformationForm | null
  },
  emit: Function
) => {
  const {
    inversion_types,
    class_investment,
    interest_rates_code_as_value,
    coins,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: IPaperTypeInformationForm = {
    code: null,
    description: null,
    currency: null,
    investment_type: null,
    investment_class: null,
    rate_type: null,
    rate_class: null,
    rate: null,
    rate_mode: null,
    base_flow_rate: null,
    flow_type: null,
    payment_flow: null,
    hasAmortization: false,
    amortization_type: null,
    created_at: null,
    creator_data: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const isRateRequired = computed<boolean>(() => {
    return models.value.investment_type === InversionTypeID.FIXED_INCOME_TYPE
  })

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

  // Campos dependientes del tipo de inversión seleccionado
  watch(
    () => models.value.investment_type,
    () => {
      if (props.action !== 'create') return

      models.value.rate_type = null
      models.value.rate_class = null
      models.value.rate = null
      models.value.rate_mode = null
      models.value.base_flow_rate = null
      models.value.flow_type = null
      models.value.payment_flow = null
      models.value.hasAmortization = false
      models.value.amortization_type = null
    }
  )

  watch(
    () => models.value.rate_type,
    () => {
      if (props.action !== 'create') return
      models.value.rate = null
    }
  )

  watch(
    () => models.value.hasAmortization,
    () => {
      if (props.action !== 'create') return
      models.value.amortization_type = null
    }
  )

  return {
    inversion_types,
    class_investment,
    interest_rates_code_as_value,
    coins,
    RATE_TYPE_OPTIONS,
    RATE_CLASS_OPTIONS,
    RATE_MODE_OPTIONS,
    FLOW_RATE_BASE_OPTIONS,
    FLOW_TYPE_OPTIONS,
    PAYMENT_FLOW_OPTIONS,
    AMORTIZATION_TYPE_OPTIONS,
    formElementRef,
    models,
    isRateRequired,
  }
}

export default useInformationForm
