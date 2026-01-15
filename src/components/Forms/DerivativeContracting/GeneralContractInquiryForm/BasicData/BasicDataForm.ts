// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IGeneralContractInquiryForm } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

// Composables
import { useUtils } from '@/composables/useUtils'

const useBasicDataForm = (
  props: {
    action: ActionType
    basicDataForm?: IGeneralContractInquiryForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const models = ref<IGeneralContractInquiryForm>({
    id: 0,
    consolidator_business: null,
    business: '',
    category: '',
    stage: {
      id: 0,
      name: '',
      description: '',
      created_at: '',
      updated_at: '',
      deleted_at: null,
    },
    contract_type: '',
    status: {
      id: 0,
      name: '',
    },
    currency: '',
    modality: '',
    main_contract_number: '',
    addition_contract_number: null,
    accumulated_contract_value: 0,
    contractor: null,
    created_at: '',
    internal_number: null,
    contract_name: '',
    object: '',
    subscription_date: '',
    duration: 0,
    execution_start_date: '',
    execution_end_date: '',
    foreign_amount: '',
    trm: '',
    amount: '',
    has_stamp_tax: false,
    requires_publication: false,
    project: '',
    codigo_plan_obra: null,
    internal_notes: '',
    supervision_role: '',
    supervision1: null,
    other_supervision_role: '',
    supervision2: null,
    execution_city_id: '',
  })

  const setValueModel = () => {
    Object.assign(models.value, props.basicDataForm)
  }

  watch(
    () => props.basicDataForm,
    (val) => {
      if (!val) return
      setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.basicDataForm)) return
      emit('update:basic-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    models,
    formElementRef,
  }
}

export default useBasicDataForm
