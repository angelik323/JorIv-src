// core
import { ref, watch } from 'vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { IMovementManagementForm } from '@/interfaces/customs/accounts-payable/MovementManagement'

const useBasicDataView = (props: {
  action?: ActionType
  data?: IMovementManagementForm | null
}) => {
  const basicDataFormRef = ref()

  const models = ref<IMovementManagementForm>({
    name: null,
    code_name: null,
    disbursement_type: null,
    disbursement_type_label: null,
    has_handle_budget: false,
    has_requests_invoice: false,
    has_contract_execution: false,
    has_validates_final_act: false,
    has_generates_accrual: false,
    has_compliance_without_treasury: false,
    has_generates_treasury: false,
    has_amortizes_fund: false,
    budget_reference_document_type_id: null,
    budget_generate_document_type_id: null,
    budget_generate_movement_id: null,
    treasury_funds_payment_movement_id: null,
    treasury_bank_payment_movement_id: null,
    fund_movement_code_id: null,
    accounting_accrual_subtype_id: null,
    code: null,
    status_id: null,
    budget_reference_document_type_label: null,
    budget_generate_document_type_label: null,
    budget_generate_movement_label: null,
    treasury_funds_payment_movement_label: null,
    treasury_bank_payment_movement_label: null,
    fund_movement_code_label: null,
    accounting_accrual_subtype_label: null,
    status: null,
    created_at: null,
    updated_at: null,
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
  }
}

export default useBasicDataView
