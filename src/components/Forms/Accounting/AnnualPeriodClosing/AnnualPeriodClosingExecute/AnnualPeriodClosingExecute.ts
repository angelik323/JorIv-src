import { IAnnualPeriodClosingModel } from '@/interfaces/customs'
import { useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const useExecuteForm = (props: {
  action: 'create' | 'edit'
  data?: IAnnualPeriodClosingModel
}) => {
  const { business_trust } = storeToRefs(useResourceStore('v1'))

  const executeForm = ref()

  const selectedFromBusiness = ref()
  const selectedStructure = ref()
  const selectedToBusiness = ref()

  const modelsbusiness = ref<IAnnualPeriodClosingModel>({
    from_business_trust_id: '',
    to_business_trust_id: '',
  })

  const isEdit = computed(() => props.action === 'edit')

  return {
    selectedFromBusiness,
    selectedToBusiness,
    selectedStructure,
    business_trust,
    modelsbusiness,
    executeForm,
    isEdit,
  }
}

export default useExecuteForm
