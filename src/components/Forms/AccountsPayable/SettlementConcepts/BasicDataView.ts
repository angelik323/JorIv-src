// core
import { ref, watch, computed } from 'vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ISettlementConceptsForm } from '@/interfaces/customs/accounts-payable/SettlementConcepts'

const useBasicDataView = (props: {
  action?: ActionType
  data?: ISettlementConceptsForm | null
}) => {
  const basicDataFormRef = ref()

  const models = ref<ISettlementConceptsForm>({
    id: null,
    structure_id: null,
    structure_label: null,
    concept_code: null,
    description: null,
    type: null,
    apply_iva: false,
    class: null,
    class_label: null,
    percentage: null,
    has_minimum_uvt: false,
    min_withholding_uvt: null,
    min_withholding_iva_uvt: null,
    min_withholding_pesos: null,
    min_withholding_iva_pesos: null,
    plan_account_id: null,
    plan_account_label: null,
    liability_account_id: null,
    liability_account_label: null,
    expense_account_id: null,
    expense_account_label: null,
    fiscal_charge_id: null,
    fiscal_charge_label: null,
    credit_notes_account_id: null,
    credit_notes_account_label: null,
    status_id: null,
    created_at: null,
    updated_at: null,
  })

  const isITETax = computed(() => {
    return models.value.type === 'Impuesto' && models.value.class === 'ITE'
  })

  // lifecycle hooks
  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  return {
    basicDataFormRef,
    models,
    isITETax,
  }
}

export default useBasicDataView
