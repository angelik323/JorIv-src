// Core
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IAccountingBudgetHomologationParameterModel,
  IAccountingBudgetParameterItem,
} from '@/interfaces/customs/budget/BudgetAccountingHomologationParameters'

// Composables
import { useUtils } from '@/composables/useUtils'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

const useBasicDataForm = (props: {
  action: ActionType
  data?: IAccountingBudgetParameterItem
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

  const { treasury_movement_codes } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const formRef = ref()

  const models = ref<Partial<IAccountingBudgetHomologationParameterModel>>({
    business_trust_id: null,
    business_trust_description: '',
    accounting_account_id: null,
    accounting_account_description: '',
    nature: '',
    from_cost_center_id: null,
    from_cost_center_description: '',
    to_cost_center_id: null,
    to_cost_center_description: '',
    from_voucher_type_id: null,
    from_voucher_type_description: '',
    to_voucher_type_id: null,
    to_voucher_type_description: '',
    from_auxiliary_id: null,
    from_auxiliary_description: '',
    to_auxiliary_id: null,
    to_auxiliary_description: '',
    code_movement_treasury_id: null,
    code_movement_treasury_description: '',
  })

  const selectBusiness = async (businessId: number) => {
    models.value.business_trust_id = businessId
    _resetKeys({ accounting: ['account_chart_by_account_structure'] })
    models.value.accounting_account_id = null
    models.value.business_trust_description = null
    if (!businessId) return
    const description = getLabel(
      businessId,
      business_trusts_selector.value,
      'value',
      'name'
    )
    if (description)
      models.value.business_trust_description = String(description)
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

  const selectAccount = (accountId: number) => {
    models.value.accounting_account_id = accountId
    models.value.accounting_account_description = null
    if (!accountId) return

    const selection = account_chart_by_account_structure.value.find(
      (item) => Number(item.id) === Number(accountId)
    )
    if (selection) {
      models.value.accounting_account_description = selection.code_account
      models.value.nature = selection?.nature === 'Crédito' ? 'C' : 'D'
    }
  }

  const selectedFromCostCenter = computed(() =>
    cost_center.value.find(
      (item) => item.id === models.value.from_cost_center_id
    )
  )

  const selectedToCostCenter = computed(() =>
    cost_center.value.find((item) => item.id === models.value.to_cost_center_id)
  )

  const selectedFromVoucherType = computed(() =>
    receipt_types.value.find(
      (item) => item.id === models.value.from_voucher_type_id
    )
  )

  const selectedToVoucherType = computed(() =>
    receipt_types.value.find(
      (item) => item.id === models.value.to_voucher_type_id
    )
  )

  const selectedFromAuxiliary = computed(() =>
    third_parties.value.find(
      (item) => item.id === models.value.from_auxiliary_id
    )
  )

  const selectedToAuxiliary = computed(() =>
    third_parties.value.find((item) => item.id === models.value.to_auxiliary_id)
  )

  const selectedTreasuryCodeMovement = computed(() =>
    treasury_movement_codes.value.find(
      (item) => item.value === models.value.code_movement_treasury_id
    )
  )

  watch(
    () => props.data,
    () => {
      if (props.data)
        models.value = {
          business_trust_id: props.data.business_trust_id,
          business_trust_description: props.data.business_trust?.name,
          accounting_account_id: props.data.accounting_account?.id || null,
          accounting_account_description:
            props.data.accounting_account?.code_account,
          nature: props.data.nature || null,
          from_cost_center_id: props.data.from_cost_center?.id || null,
          from_cost_center_description: `${
            props.data.from_cost_center?.name || null
          }`,
          to_cost_center_id: props.data.to_cost_center?.id || null,
          to_cost_center_description: `${
            props.data.to_cost_center?.name || null
          }`,
          from_voucher_type_id: props.data.from_voucher_type?.id || null,
          from_voucher_type_description: `${
            props.data.from_voucher_type?.label || null
          }`,
          to_voucher_type_id: props.data.to_voucher_type?.id || null,
          to_voucher_type_description: `${
            props.data.to_voucher_type?.label || null
          }`,
          from_auxiliary_id: props.data.from_auxiliary?.id || null,
          from_auxiliary_description: `${
            props.data.from_auxiliary?.full_name_code || null
          }`,
          to_auxiliary_id: props.data.to_auxiliary?.id || null,
          to_auxiliary_description: `${
            props.data.to_auxiliary?.full_name_code || null
          }`,
          code_movement_treasury_id:
            props.data.code_movement_treasury?.id || null,
          code_movement_treasury_description: `${
            props.data.code_movement_treasury?.description || null
          }`,
        }
    }
  )

  return {
    models,
    formRef,
    cost_center,
    third_parties,
    receipt_types,
    selectedToAuxiliary,
    selectedToCostCenter,
    selectedToVoucherType,
    selectedFromAuxiliary,
    selectedFromCostCenter,
    selectedFromVoucherType,
    selectedTreasuryCodeMovement,
    treasury_movement_codes,
    business_trusts_selector,
    account_chart_by_account_structure,
    selectBusiness,
    selectAccount,
  }
}

export default useBasicDataForm
