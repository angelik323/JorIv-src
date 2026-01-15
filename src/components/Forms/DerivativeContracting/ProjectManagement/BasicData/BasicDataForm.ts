// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionTypeEnum } from '@/interfaces/global'
import { IProjectManagementBasicDataForm } from '@/interfaces/customs/derivative-contracting/ProjectManagement'

// Constants
import { default_statuses } from '@/constants/resources'

const useBasicDataForm = (
  props: {
    action: ActionTypeEnum
    basicDataForm?: IProjectManagementBasicDataForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const models = ref<IProjectManagementBasicDataForm>({
    name: null,
    description: null,
    start_date: null,
    end_date: null,
    expenditure_computer: null,
    status_id: null,
  })

  const setValueModel = (data: IProjectManagementBasicDataForm | null) => {
    Object.assign(models.value, data)
  }

  watch(
    () => props.basicDataForm,
    (val) => {
      if (!val) return
      setValueModel(val)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      emit('update:basicDataForm', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    models,
    formElementRef,
    default_statuses,
  }
}

export default useBasicDataForm
