import { computed, ref, watch } from 'vue'

import { IRiskRatingAgencies } from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

const useInformationForm = (props: {
  action: ActionType
  data?: IRiskRatingAgencies
}) => {
  const informationFormRef = ref()

  const formData = ref<IRiskRatingAgencies>({
    id: 0,
    code: 0,
    description: '',
    guy: '',
  })

  const isView = computed(() => ['view'].includes(props.action))

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        formData.value = { ...formData.value, ...newVal }
      }
    },
    { deep: true, immediate: true }
  )

  return {
    isView,
    formData,
    informationFormRef,
  }
}

export default useInformationForm
