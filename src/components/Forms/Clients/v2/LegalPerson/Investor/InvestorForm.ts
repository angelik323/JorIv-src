import { ref, watch } from "vue";

//Interfaces
import { ActionType } from '@/interfaces/global'
import { IInvestorForm } from '@/interfaces/customs/clients/ClientIndirectLegalPerson'

//Composables
import { useRules, useUtils } from '@/composables'

const useInvestorForm = (props: {
  action: ActionType;
  data?: IInvestorForm | null
}, emit: Function) => {
  const { isEmptyOrZero } = useUtils()

  const formInvestor = ref()
  const models = ref<IInvestorForm>({
    investor_rating: "",
    quantitative_risk_rating: "",
    qualitative_risk_rating: ""
  })

  const _setValueModel = () => {
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
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:investor-indirect-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    models,
    formInvestor,

    useRules,
  }
}

export default useInvestorForm
