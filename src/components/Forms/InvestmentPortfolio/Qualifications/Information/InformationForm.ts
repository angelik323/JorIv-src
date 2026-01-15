// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// store
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

// utils
import { useUtils } from '@/composables'

// interfaces
import { IQualificationsForm } from '@/interfaces/customs/investment-portfolio/Qualifications'
import { ActionType } from '@/interfaces/global'

const useInformationForm = (
  props: {
    action: ActionType
    data: IQualificationsForm | null
  },
  emit: Function
) => {
  const { qualification_actions } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { isEmptyOrZero } = useUtils()

  // props
  const formElementRef = ref()

  const initialModelsValues: IQualificationsForm = {
    id: null,
    action_rating: '',
    rating_code: '',
    group: null,
    history_qualification: {
      created_at: '',
      creator_data: '',
      updated_at: '',
      update_data: '',
    },
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  // Sincroniza el modelo con la prop 'data'
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
    qualification_actions,
    formElementRef,
    models,
  }
}

export default useInformationForm
