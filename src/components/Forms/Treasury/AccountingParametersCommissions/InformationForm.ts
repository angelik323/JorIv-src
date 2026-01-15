import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { ICommissionParametersForm } from '@/interfaces/customs/treasury/CommissionParameters'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: ICommissionParametersForm | null
  },
  emit: Function
) => {
  const {
    accounting_account_contrapart,
    aux_type,
    third_parties,
    operational_cost_centers,
    cash_flow_structures,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const {
    budget_item_codes_payment_block,
    areas_resposabilities_codes,
    budget_resource_codes,
    budget_document_types,
    code_movements_types_contracting,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const { isEmptyOrZero } = useUtils()
  const { is_required } = useRules()

  const formElementRef = ref()

  const initialModelsValues: ICommissionParametersForm = {
    accounting_blocks_collection_id: 0,
    account_chart_id: 0,
    cost_center_id: 0,
    aux_type: '',
    third_party_id: 0,
    cash_flow_structure_id: 0,
    contra_account_chart_id: 0,
    contra_cost_center_id: 0,
    contra_aux_type: '',
    contra_third_party_id: 0,
    contra_cash_flow_structure_id: 0,
    budget_item_id: null,
    budget_area_id: null,
    budget_resource_id: null,
    budget_document_type_id: null,
    budget_movement_code_id: null,
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const selectOptions = computed(() => ({
    accounting_account_contrapart: accounting_account_contrapart.value,
    aux_type: aux_type.value,
    third_parties: third_parties.value,
    operational_cost_centers: operational_cost_centers.value,
    cash_flow_structures: cash_flow_structures.value,

    budget_item_codes_payment_block: budget_item_codes_payment_block.value,
    areas_resposabilities_codes: areas_resposabilities_codes.value,
    budget_resource_codes: budget_resource_codes.value,
    budget_document_types: budget_document_types.value,
    code_movements: code_movements_types_contracting.value,
  }))

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
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    selectOptions,

    is_required,
  }
}

export default useInformationForm
