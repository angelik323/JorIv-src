// Vue
import { ref, watch } from 'vue'

// Interfaces
import { ISecondAuthorizationForeignCurrency } from '@/interfaces/customs/accounts-payable/SecondAuthorization'

const useForeignCurrencyDataForm = (props: {
  data?: ISecondAuthorizationForeignCurrency | null
}) => {
  const models = ref<ISecondAuthorizationForeignCurrency>({
    initial_value_pesos: '',
    initial_trm: '',
    final_value_pesos: '',
    final_trm: '',
    final_value_foreign_currency: '',
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

export default useForeignCurrencyDataForm
