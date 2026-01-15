import { ref, watch } from 'vue'
import { useRules, useUtils } from '@/composables'
import { isEmptyOrZero } from '@/utils'
import { ActionType } from '@/interfaces/global'
import { useBillingCollectStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { IAdjustmentNoteRecordInformationForm } from '@/interfaces/customs'
const useBasicDataForm = (
  props: {
    action: ActionType
    data: IAdjustmentNoteRecordInformationForm | null
  },
  emit: Function
) => {
  const { is_required } = useRules()
  const { invoices_notes } = storeToRefs(useBillingCollectStore('v1'))
  const formElementRef = ref()
  const { formatCurrencyString } = useUtils()

  const initialModelsValues: IAdjustmentNoteRecordInformationForm = {
    invoice_id: null,
    invoice_number: null,
    note_type: '',
    affects: '',
    amount: null,
    adjustment_date: '',
    observations: '',
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  watch(
    () => props.data,
    () => _setValueModel(),
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
    formElementRef,
    models,
    is_required,
    invoices_notes,
    formatCurrencyString,
  }
}

export default useBasicDataForm
