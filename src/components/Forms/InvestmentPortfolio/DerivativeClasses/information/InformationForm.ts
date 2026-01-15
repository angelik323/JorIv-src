// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IDerivativeClassesForm } from '@/interfaces/customs/investment-portfolio/DerivativeClasses'

// Composables - constants
import { useUtils, useRules } from '@/composables'
import {
  operation_type,
  end_early,
  default_statuses,
} from '@/constants/resources'

// Stores
import { useInvestmentPortfolioResourceStore } from '@/stores'

export const useInformationForm = (
  props: {
    action: ActionType
    data: IDerivativeClassesForm | null
  },
  emit: Function
) => {
  const {
    coins,
    paper_type,
    interest_rates,
    derivative_type,
    derivative_underlying,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { isEmptyOrZero } = useUtils()
  const { max_length, min_length, is_required } = useRules()

  const formElementRef = ref()

  const initialModelsValues: IDerivativeClassesForm = {
    code: '',
    derivative_type_id: '',
    derivative_type: '',
    description: '',
    derivative_underlying_id: '',
    derivative_underlying: '',
    currency_id: '',
    currency: '',
    operation_type: 'Compra',
    end_early: false,
    paper_type_id: 0,
    paper_type: '',
    currency_payment_id: '',
    currency_payment: '',
    badge_x_id: '',
    badge_x: '',
    badge_y_id: '',
    badge_y: '',
    rate_point_id: 0,
    rate_point: '',
    rate_x_id: 0,
    rate_x: '',
    rate_y_id: 0,
    rate_y: '',
    status_id: 1,
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
    formElementRef,
    models,
    coins,
    paper_type,
    interest_rates,
    derivative_type,
    derivative_underlying,
    operation_type,
    end_early,
    default_statuses,
    max_length,
    min_length,
    is_required,
  }
}
