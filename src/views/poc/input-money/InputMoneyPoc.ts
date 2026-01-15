import { ref } from 'vue'
import { IInputMoneyPocForm } from '@/interfaces/customs/poc'
import { useUtils } from '@/composables'

const useInputMoneyPoc = () => {
  const { formatCurrency } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: IInputMoneyPocForm = {
    unit_value: '123456.78',
    value_finish: null,
    initial_fee_value: '123456.78',
    subsidy_fee_value: '123456,78',
    value_other_concepts: null,
    fixed_value_initial_fee: null,
    separation_value: null,
    credit_value: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const onSubmit = async () => {
    if (!(await formElementRef.value?.validate())) return
  }

  return {
    formElementRef,
    models,
    formatCurrency,
    onSubmit,
  }
}

export default useInputMoneyPoc
