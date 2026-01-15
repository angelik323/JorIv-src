// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IPaymentAuthorizersForm } from '@/interfaces/customs/accounts-payable/PaymentAuthorizers'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useUserResourceStore } from '@/stores/resources-manager/users'

const useBasicDataForm = (
  props: {
    data?: IPaymentAuthorizersForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const { users_label_email } = storeToRefs(useUserResourceStore('v1'))

  const basicDataFormRef = ref()

  const models = ref<IPaymentAuthorizersForm>({
    autorized_user_id: null,
    amount_from: '',
    amount_to: '',
    created_at: '',
  })

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    {
      deep: true,
    }
  )

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
    basicDataFormRef,
    models,
    users_label_email,
  }
}

export default useBasicDataForm
