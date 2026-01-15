// Vue - pinia - moment
import { ref, watch } from 'vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { Nullable } from '@/interfaces/customs'
import { IBudgetClosureProcessInfo } from '@/interfaces/customs/budget/BudgetClosure'

const useInformationForm = (props: {
  action: ActionType
  data: IBudgetClosureProcessInfo | null
}) => {
  // Refs and computed props
  const initialFormData: Nullable<IBudgetClosureProcessInfo> = {
    id: null,
    status: null,
    status_name: null,
    user_id: null,
    user_name: null,
    created_at: null,
    started_at: null,
    completed_at: null,
    type_closure: null,
    action_type: null,
    period: null,
    request_data: null,
  }

  const formData = ref<Nullable<IBudgetClosureProcessInfo>>(initialFormData)

  // Watchers
  watch(
    () => props.data,
    (data) => {
      if (!data) return
      formData.value = { ...data }
    },
    { deep: true, immediate: true }
  )

  return {
    formData,
  }
}

export default useInformationForm
