// Vue - Pinia
import { ref, watch } from 'vue'

// Interfaces
import { IParticipationTypeRegistration } from '@/interfaces/customs/fics/ParticipationTypeRegistration'
import { ActionType } from '@/interfaces/global'

// Composables
import { useRules } from '@/composables'

const useInformationForm = (
  props: {
    action: ActionType
    data: IParticipationTypeRegistration
  },
  emit: (e: 'update:data', value: IParticipationTypeRegistration) => void
) => {
  const { is_required, only_number } = useRules()

  const formElementRef = ref()

  const initialModelsValues: IParticipationTypeRegistration = {
    id: undefined,
    code: 0,
    description: '',
  }

  const models = ref<IParticipationTypeRegistration>({ ...initialModelsValues })

  const _setValueModel = () => {
    models.value = { ...props.data }
  }

  watch(
    () => props.data,
    () => _setValueModel(),
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', val)
    },
    { deep: true }
  )

  return {
    models,
    formElementRef,

    // Methods
    only_number,
    is_required,
  }
}

export default useInformationForm
