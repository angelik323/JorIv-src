// vue - pinia
import { onMounted, ref } from 'vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ITrustBusinessFinanceForm } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

const useFinanceForm = (props: {
  data?: ITrustBusinessFinanceForm | null
  action: ActionType
}) => {
  // computed
  const models = ref<ITrustBusinessFinanceForm>({
    business_trust_general_orders: [],
    bank_accounts: [],
  })
  const isLoading = ref(true)

  // init
  const _setValueModel = async () => {
    if (props.data) {
      models.value = props.data
    }
  }

  // lifecycles
  onMounted(async () => {
    isLoading.value = true
    await _setValueModel()
    isLoading.value = false
  })

  return {
    models,
    isLoading,
  }
}

export default useFinanceForm
