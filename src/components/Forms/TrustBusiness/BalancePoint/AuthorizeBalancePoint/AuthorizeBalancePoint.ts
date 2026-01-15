import { useBalancePointStore } from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

const useAuthorizeBalancePointForm = () => {
  const authorizeFormRef = ref()
  const models = ref<{ observation: string }>({
    observation: '',
  })

  const { balance_point_response } = storeToRefs(useBalancePointStore('v1'))
  const { _setDataAuthorizationForm } = useBalancePointStore('v1')

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataAuthorizationForm(null)
      } else {
        _setDataAuthorizationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    authorizeFormRef,
    balance_point_response,
  }
}

export default useAuthorizeBalancePointForm
