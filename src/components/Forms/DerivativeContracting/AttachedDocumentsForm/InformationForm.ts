import { ActionType } from '@/interfaces/global'
import { ref, watch } from 'vue'
import { useRules, useUtils } from '@/composables'
import { IAttachedDocumentForm } from '@/interfaces/customs/AttachedDocuments'
import { stage } from '@/constants/resources'

const useInformationForm = (
  props: {
    action: ActionType
    data: IAttachedDocumentForm | null
  },
  emit: Function
) => {
  const { is_required, max_length } = useRules()
  const formElementRef = ref()

  const { isEmptyOrZero } = useUtils()

  const initialModelsValues: IAttachedDocumentForm = {
    code: '',
    stage: '',
    name: '',
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  // Sincroniza el modelo con la props data
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
    stage,
    formElementRef,
    models,
    is_required,
    max_length,
  }
}

export default useInformationForm
