import { ref, watch } from 'vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { ITaxesAndWithholdingsForm } from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Composables
import { useUtils, useRules } from '@/composables'

const useInformationForm = (
  props: {
    action: ActionType
    data?: ITaxesAndWithholdingsForm | null
  },
  emits: Function
) => {
  const formInformationRef = ref()

  const initialModelsValues: ITaxesAndWithholdingsForm = {
    legal_notes: null,
    invoice_label: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
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
    models,
    (val) => {
      emits('update:data', useUtils().isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    models,
    formInformationRef,
    rules: useRules(),
  }
}

export default useInformationForm
