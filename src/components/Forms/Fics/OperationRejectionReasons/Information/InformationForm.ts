// Vue
import { ref, watch } from 'vue'

// Interfaces
import { IRejectionReasonInformationForm } from '@/interfaces/customs/fics/OperationRejectionReasons'
import { StatusID, WriteActionType } from '@/interfaces/global'

// Composables
import { useRules, useUtils } from '@/composables'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: IRejectionReasonInformationForm | null
  },
  emit: Function
) => {
  const { is_required, max_length, no_leading_zeros, only_alphanumeric } =
    useRules()
  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: IRejectionReasonInformationForm = {
    code: null,
    description: null,
    status: StatusID.ACTIVE, // Estado por defecto
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
      // Evita bucle infinito
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    is_required,
    max_length,
    no_leading_zeros,
    only_alphanumeric,
  }
}

export default useInformationForm
