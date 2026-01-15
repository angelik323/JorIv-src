// Vue
import { ref, watch } from 'vue'

// Interfaces
import { ISecondAuthorizationDataAuthorization } from '@/interfaces/customs/accounts-payable/SecondAuthorization'

const useAuthorizationDataForm = (props: {
  data?: ISecondAuthorizationDataAuthorization | null
}) => {
  const models = ref<ISecondAuthorizationDataAuthorization>({
    business_trust: null,
    reception_date: null,
    orpa_number: null,
    orpa_validity: null,
    orpa_value: '',
    upload_number: null,
    asset_number_id: null,
    internal_code: null,
    client_code: null,
    supplier: null,
    payment_type: null,
    observation: null,
    status: null,
  })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  return {
    models,
  }
}

export default useAuthorizationDataForm
