import { IPortfolioClassificationForm } from '@/interfaces/customs'
import { nextTick, ref, watch } from 'vue'
import { useRules } from '@/composables'
import { isEmptyOrZero } from '@/utils'
import { ActionType } from '@/interfaces/global'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IPortfolioClassificationForm | null
  },
  emit: Function
) => {
  const {
    is_required,
    max_length,
    no_leading_zeros,
    only_alphanumeric,
    only_number,
    max_value,
    is_major_than,
  } = useRules()

  const formElementRef = ref()
  const isSettingModel = ref(false)

  const initialModelsValues: IPortfolioClassificationForm = {
    type: null,
    days_start: null,
    days_end: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setModelValue,
      edit: _setModelValue,
      view: _setModelValue,
    }
    actionHandlers[action]?.()
  }

  const _setModelValue = () => {
    isSettingModel.value = true
    const data: IPortfolioClassificationForm | null = props.data ?? null
    if (data) {
      models.value = { ...data }
    }
    nextTick(() => {
      isSettingModel.value = false
    })
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  watch(
    models,
    (val) => {
      if (isSettingModel.value) return
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    is_required,
    max_length,
    no_leading_zeros,
    only_alphanumeric,
    only_number,
    is_major_than,
    max_value,
  }
}

export default useBasicDataForm
