// Vue - Pinia
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useBusinessLineStore } from '@/stores/fics/business-line'

const useInformationForm = () => {
  const { status_business_line } = storeToRefs(useFicResourceStore('v1'))
  const { business_line, selected_type } = storeToRefs(
    useBusinessLineStore('v1')
  )

  const informationForm = ref()
  const checkParticipationType = ref<boolean | null>(false)

  const validateBusinessLine = () => {
    return informationForm.value?.validate()
  }

  const getPayloadData = () => {
    return business_line.value
  }

  watch(
    () => business_line.value,
    (val) => {
      if (val) {
        checkParticipationType.value = val.consolidated_participation_type ??= false
      }
    },
    { deep: true }
  )
  return {
    selected_type,
    business_line,
    informationForm,
    status_business_line,
    checkParticipationType,

    // Methods
    getPayloadData,
    validateBusinessLine,
  }
}

export default useInformationForm
