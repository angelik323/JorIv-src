// Vue - Pinia - Router - Quasar
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IPaymentMilestoneForm } from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

// Composables
import { useRules, useUtils } from '@/composables'

// Stores
import { usePaymentMilestonesModificationStoreV1 } from '@/stores/derivative-contracting/payment-milestones-modification/payment-milestones-modification-v1'

const useInformationForm = (
  props: {
    action: ActionType
    data: IPaymentMilestoneForm | null
  },
  emit: Function
) => {
  const { is_required } = useRules()
  const formElementRef = ref()
  const route = useRoute()

  const { isEmptyOrZero } = useUtils()

  const { _getGeneralContractInformation } =
    usePaymentMilestonesModificationStoreV1()

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

  // Fetch payment types on mount
  onMounted(async () => {
    const contract_id = Number(route.params.contract_id)
    const adition_id = Number(route.params.adition_id)
    await _getGeneralContractInformation(contract_id, adition_id, {})
  })

  // Sincroniza el modelo con la props data
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
    formElementRef,
    models,
    is_required,
  }
}

export default useInformationForm
