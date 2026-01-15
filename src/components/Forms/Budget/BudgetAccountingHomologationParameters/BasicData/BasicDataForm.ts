// Core
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IBudgetAccountingHomologationParameterModel,
  IBudgetAccountingParameterItem,
} from '@/interfaces/customs/budget/BudgetAccountingHomologationParameters'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBasicDataForm = (props: {
  action: ActionType
  data?: IBudgetAccountingParameterItem
}) => {
  const { getLabel } = useUtils()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    cost_center,
    receipt_types,
    structure_by_business,
    business_trusts_selector,
    account_chart_by_account_structure,
    third_parties_label: third_parties,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const {
    budget_resource_codes,
    areas_resposabilities_codes,
    budget_document_types,
    budget_item_codes,
    code_movements,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const { treasury_movement_codes } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const formRef = ref()

  const models = ref<Partial<IBudgetAccountingHomologationParameterModel>>({
    business_trust_id: null,
    business_trust_description: null,
    budget_item_id: null,
    responsability_area_id: null,
    budget_resource_id: null,
    budget_document_type_id: null,
    code_movement_id: null,
    voucher_type_id: null,
    sub_voucher_type_id: null,
    source_accounting_account_id: null,
    counterpart_accounting_account_id: null,
    source_cost_center_id: null,
    counterpart_cost_center_id: null,
    source_auxiliary_id: null,
    counterpart_auxiliary_id: null,
    nature: null,
  })

  const getAccountingAccounts = async (businessId: number) => {
    await _getResources(
      { accounting: ['structure_by_business'] },
      `filter[business_id]=${businessId}`
    )
    if (structure_by_business.value.length) {
      _getResources(
        { accounting: ['account_chart_by_account_structure'] },
        `filter[account_structure_id]=${structure_by_business.value[0].value}`,
        'v2'
      )
    }
  }

  const selectBusiness = async (businessId: number) => {
    models.value.business_trust_id = businessId
    _resetKeys({ accounting: ['account_chart_by_account_structure'] })
    models.value.source_accounting_account_id = null
    models.value.counterpart_accounting_account_id = null
    if (!businessId) return
    const description = getLabel(
      businessId,
      business_trusts_selector.value,
      'value',
      'name'
    )
    if (description)
      models.value.business_trust_description = String(description)
    getAccountingAccounts(businessId)
  }

  const selectVoucherType = (voucherTypeId: number) => {
    models.value.voucher_type_id = voucherTypeId
    models.value.sub_voucher_type_id = null
  }

  const selectedBudgetItem = computed(() =>
    budget_item_codes.value.find(
      (item) => item.id === models.value.budget_item_id
    )
  )

  const selectedArea = computed(() =>
    areas_resposabilities_codes.value.find(
      (item) => item.value === models.value.responsability_area_id
    )
  )

  const selectedResource = computed(() =>
    budget_resource_codes.value.find(
      (item) => item.value === models.value.budget_resource_id
    )
  )

  const selectedDocumentType = computed(() =>
    budget_document_types.value.find(
      (item) => item.value === models.value.budget_document_type_id
    )
  )

  const selectedMovementCode = computed(() =>
    code_movements.value.find(
      (item) => item.id === models.value.code_movement_id
    )
  )

  const selectedCostCenter = computed(() =>
    cost_center.value.find(
      (item) => item.id === models.value.source_cost_center_id
    )
  )

  const selectedCounterpartCostCenter = computed(() =>
    cost_center.value.find(
      (item) => item.id === models.value.counterpart_cost_center_id
    )
  )

  const selectedVoucherType = computed(() =>
    receipt_types.value.find((item) => item.id === models.value.voucher_type_id)
  )

  const selectedVoucherSubType = computed(() =>
    selectedVoucherType?.value?.related?.find(
      (item) => item.value === models.value.sub_voucher_type_id
    )
  )

  const selectedAuxiliary = computed(() =>
    third_parties.value.find(
      (item) => item.id === models.value.source_auxiliary_id
    )
  )

  const selectedCounterpartAuxiliary = computed(() =>
    third_parties.value.find(
      (item) => item.id === models.value.counterpart_auxiliary_id
    )
  )

  const selectedAccount = computed(() =>
    account_chart_by_account_structure.value.find(
      (item) => item.id === models.value.source_accounting_account_id
    )
  )
  const selectedCounterpartAccount = computed(() =>
    account_chart_by_account_structure.value.find(
      (item) => item.id === models.value.counterpart_accounting_account_id
    )
  )

  watch(
    () => props.data,
    async () => {
      if (props.data) {
        models.value = {
          business_trust_id: props.data.business_trust_id,
          business_trust_description: props.data.business_trust?.name,
          source_accounting_account_id:
            props.data.source_accounting_account?.id,
          budget_item_id: props.data.budget_item?.id,
          budget_resource_id: props.data.budget_resource?.id,
          responsability_area_id: props.data.responsability_area?.id,
          budget_document_type_id: props.data.budget_document_type?.id,
          code_movement_id: props.data.code_movement?.id,
          voucher_type_id: props.data.voucher_type?.id,
          sub_voucher_type_id: props.data.sub_voucher_type?.value,
          counterpart_accounting_account_id:
            props.data.counterpart_accounting_account?.id,
          source_cost_center_id: props.data.source_cost_center?.id,
          counterpart_cost_center_id: props.data.counterpart_cost_center?.id,
          source_auxiliary_id: props.data.source_auxiliary?.id,
          counterpart_auxiliary_id: props.data.counterpart_auxiliary?.id,
          nature: props.data.nature,
        }

        getAccountingAccounts(props.data.business_trust_id)
      }
    }
  )

  return {
    models,
    formRef,
    cost_center,
    third_parties,
    receipt_types,
    selectedArea,
    selectedAccount,
    selectedResource,
    selectedAuxiliary,
    selectedBudgetItem,
    selectedCostCenter,
    selectedVoucherType,
    selectedMovementCode,
    selectedDocumentType,
    selectedVoucherSubType,
    selectedCounterpartAccount,
    selectedCounterpartAuxiliary,
    selectedCounterpartCostCenter,
    treasury_movement_codes,
    business_trusts_selector,
    account_chart_by_account_structure,
    budget_resource_codes,
    areas_resposabilities_codes,
    budget_document_types,
    budget_item_codes,
    code_movements,
    selectBusiness,
    selectVoucherType,
  }
}

export default useBasicDataForm
