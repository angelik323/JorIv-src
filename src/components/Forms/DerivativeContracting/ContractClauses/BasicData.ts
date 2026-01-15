import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Stores
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'

// Interfaces
import { IContractClausesForm } from '@/interfaces/customs'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'

const useBasicDataForm = (
  props: {
    data: IContractClausesForm | null
  },
  emit: Function
) => {
  const { clause_types } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const { isEmptyOrZero } = useUtils()
  const formElementRef = ref()

  const contractType = computed(() => {
    return (
      clause_types.value.find(
        (type) => type.value === models.value.clause_type_id
      )?.label || ''
    )
  })

  const initialModelsValues: IContractClausesForm = {
    clause_type_id: null,
    clausule: null,
    code: null,
    name: null,
    WhichClause: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })
  const content = computed(() => models.value.clausule)

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

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
    clause_types,
    contractType,
    content,
    rules: useRules(),
  }
}

export default useBasicDataForm
