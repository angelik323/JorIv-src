// core
import { onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils, useRules } from '@/composables'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IMovementManagementForm } from '@/interfaces/customs/accounts-payable/MovementManagement'

// constants
import { disbursementTypeOptions } from '@/constants/resources'

// store
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useBasicDataForm = (
  props: {
    action?: ActionType
    data?: IMovementManagementForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero } = useUtils()
  const { is_required, max_length, only_alphanumeric } = useRules()

  // stores
  const { code_movements_types_contracting, budget_document_transfer_type } =
    storeToRefs(useBudgetResourceStore('v1'))
  const { sub_receipt_types_voucher } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { treasury_movement_codes } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { movements_codes_nfi } = storeToRefs(useFicResourceStore('v1'))

  // refs
  const disbursementType = ref()

  // configs
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

  const setValueBudget = (val: boolean) => {
    if (!val) {
      models.value.budget_reference_document_type_id = null
      models.value.budget_generate_document_type_id = null
      models.value.budget_generate_movement_id = null
    }
  }

  const setValueTreasury = (val: boolean) => {
    if (!val) {
      models.value.treasury_funds_payment_movement_id = null
      models.value.treasury_bank_payment_movement_id = null
    }
  }

  const setValueAmortization = (val: boolean) => {
    if (!val) {
      models.value.fund_movement_code_id = null
    }
  }

  // lifecycle hooks
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  onBeforeMount(() => {
    disbursementType.value = disbursementTypeOptions.filter(
      (item) => item.value != 'Todos'
    )
  })

  return {
    basicDataFormRef,
    models,

    // selects
    disbursementType,
    code_movements_types_contracting,
    sub_receipt_types_voucher,
    budget_document_transfer_type,
    treasury_movement_codes,
    movements_codes_nfi,

    // rules
    is_required,
    max_length,
    only_alphanumeric,

    setValueBudget,
    setValueTreasury,
    setValueAmortization,
  }
}

export default useBasicDataForm
