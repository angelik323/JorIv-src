// Vue - pinia
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { ITypesCoverageInformationForm } from '@/interfaces/customs/investment-portfolio/TypesCoverage'

// Composables - constants
import { useRules, useUtils } from '@/composables'

// Stores
import { useInvestmentPortfolioResourceStore } from '@/stores'

export const useInformationForm = (
  props: {
    action: WriteActionType
    data: ITypesCoverageInformationForm | null
  },
  emit: Function
) => {
  const { operation_coverage } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { isEmptyOrZero } = useUtils()
  const {
    is_required,
    max_length,
    no_leading_zeros,
    only_alphanumeric,
    only_number,
  } = useRules()

  const formElementRef = ref()

  const initialModelsValues: ITypesCoverageInformationForm = {
    code: '',
    description: '',
    operation_coverage_type_id: 0,
    operation_coverage_type_element_id: 0,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
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

  const operationCoverageSelected = computed(
    () =>
      operation_coverage.value
        .find((item) => item.value === models.value.operation_coverage_type_id)
        ?.operation_coverages_types_elements.map((item) => ({
          label: item.label ?? '',
          value: item.value ?? 0,
        })) || []
  )

  return {
    operation_coverage,
    formElementRef,
    models,
    operationCoverageSelected,
    is_required,
    max_length,
    no_leading_zeros,
    only_alphanumeric,
    only_number,
  }
}
