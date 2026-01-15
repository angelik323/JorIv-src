// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'

// Interfaces
import { IPaymentMilestoneForm } from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

const useContractInformationView = (props: {
  data: IPaymentMilestoneForm | null
}) => {
  const formElementRef = ref()

  const initialModelsValues: IPaymentMilestoneForm = {
    C_number: '',
    BT_name: '',
    DT_contract_type: '',
    C_stage: '',
    C_subscription_date: '',
    contractor: '',
    currency: '',
    DT_Modality: '',
    milestone: '',
    payment_type: '',
    date: '',
    foreign_amount: '',
    cop_value: '',
  }
  const models = ref<IPaymentMilestoneForm>({ ...initialModelsValues })

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

  return {
    formElementRef,
    models,
  }
}

export default useContractInformationView
