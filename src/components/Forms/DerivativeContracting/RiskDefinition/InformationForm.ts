// Vue - Pinia - Router - Quasar
import { computed, ref, watch } from 'vue'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IRiskDefinitionForm } from '@/interfaces/customs/derivative-contracting/RiskDefinition'
import { IGenericResource } from '@/interfaces/customs'

const useRiskDefinitionsInformationForm = (
  props: {
    action: ActionType
    basicDataForm?: IRiskDefinitionForm | null
    riskNature?: IGenericResource[]
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()
  const formElementRef = ref()

  const models = ref<IRiskDefinitionForm>({
    code: '',
    name: '',
    nature: '',
    minimum_percentage: '',
    maximum_percentage: '',
    status_id: 1,
  })

  const _setValueModel = () => {
    if (!props.basicDataForm) return
    Object.assign(models.value, props.basicDataForm)
  }

  watch(
    () => props.basicDataForm,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      emit('update:basic-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const riskNature = computed(() => props.riskNature ?? [])

  return {
    models,
    formElementRef,
    riskNature
  }
}

export default useRiskDefinitionsInformationForm
