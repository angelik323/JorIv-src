// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IFormatGenerationInformationForm } from '@/interfaces/customs/normative/FormatGeneration'

// Composables
import { useRules, useUtils } from '@/composables'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: IFormatGenerationInformationForm | null
    format_type: string
  },
  emit: Function
) => {
  const { funds } = storeToRefs(useFicResourceStore('v1'))

  const { defaultIconsLucide, isEmptyOrZero } = useUtils()
  const { is_required } = useRules()

  const formElementRef = ref()

  const initialModelsValues: IFormatGenerationInformationForm = {
    date: null,
    fund: null,
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
    defaultIconsLucide,
    formElementRef,
    models,
    funds,
    is_required,
  }
}

export default useInformationForm
