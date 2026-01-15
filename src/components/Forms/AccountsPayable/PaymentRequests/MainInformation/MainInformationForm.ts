// core
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

// composables
import { useUtils, useRules, useMainLoader } from '@/composables'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IPaymentRequestMainInformationForm,
  IPaymentRequestValidate,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'

// constants
import { disbursementTypeOptions } from '@/constants/resources'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { usePaymentRequestsStore } from '@/stores/accounts-payable/payment-requests'

const useMainInformationForm = (
  props: {
    action?: ActionType
    data?: IPaymentRequestMainInformationForm | null
    validate: IPaymentRequestValidate
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero } = useUtils()
  const { openMainLoader } = useMainLoader()
  const {
    is_required,
    min_length,
    max_length,
    only_alphanumeric,
    valid_format_date,
    date_before_or_equal_to_the_current_date,
    only_business_day,
  } = useRules()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    budget_document_transfer_type,
    budget_document_number,
    budget_document_validities_by_business,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const { movement_management, document_type_code_name_with_id } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )
  const { business_trusts, accounts_payables } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { basic_info_contract, contract_payment_milestones } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const { business_id, business_label, has_budget } = storeToRefs(
    usePaymentRequestsStore('v1')
  )

  // refs
  const keysBusinessTrust = {
    trust_business: ['accounts_payables'],
  }
  const keysBudget = {
    budget: ['budget_document_validities_by_business'],
  }
  const keysFinancialObligations = {
    finantial_obligations: ['financial_obligations'],
  }
  const keysDerivativeContracting = {
    derivative_contracting: ['contract_payment_milestones'],
  }
  const disbursementType = ref()
  const validityYears = ref()

  // configs
  const mainInformationFormRef = ref()

  const models = ref<IPaymentRequestMainInformationForm>({
    document_type_id: null,
    business_id: null,
    business_code: '',
    payment_structure_id: null,
    internal_code: '',
    client_code: '',
    order_number: '',
    other_reference: '',
    legalization_date: '',
    due_date: '',
    movement_code_id: null,
    movement_date: '',
    city_id: null,
    contract_id: null,
    milestone_id: null,
    validity_year: null,
    budget_document_type_id: null,
    budget_document_number_id: null,
    budget_validity_year: null,
    observation: '',
    payment_structure_label: '',
    city_label: '',
  })

  // actions
  const changeBusiness = async ($event: number) => {
    models.value.business_id = $event

    const business = business_trusts.value.find((item) => item.value == $event)
    models.value.business_code = business
      ? business.code
      : models.value.business_code

    models.value.payment_structure_id = null
    models.value.payment_structure_label = ''

    await _resetKeys(keysBusinessTrust)

    if (models.value.business_id) {
      openMainLoader(true)
      await _getResources(
        keysBusinessTrust,
        `filter[business_trust_id]=${models.value.business_id}`
      )
      await _getResources(
        keysBudget,
        `filter[business_trust_id]=${models.value.business_id}`
      )
      await _getResources(
        keysFinancialObligations,
        `filter[business_trust_id]=${models.value.business_id}`
      )
      openMainLoader(false)

      if (accounts_payables.value.length > 0) {
        models.value.payment_structure_id =
          Number(accounts_payables.value[0].value) || null
        models.value.payment_structure_label = accounts_payables.value[0].label
      }
    }
  }

  const hasContractExecution = computed(() => {
    return !!(
      props.validate.hasDerivateContracting &&
      props.validate.movementHasContractExecution
    )
  })

  const filteredMovementManagement = computed(() => {
    if (props.validate.hasHandleBudgetBusiness) {
      return movement_management.value
    }

    return movement_management.value.filter((item) => !item.has_handle_budget)
  })

  const changeContract = async ($event: number) => {
    models.value.contract_id = $event

    const contract = basic_info_contract.value.find(
      (item) => item.value == models.value.contract_id
    )
    validityYears.value = contract?.validity_years ?? []

    await loadDerivativeContracting()
  }

  const changeMovementDate = async ($event: string) => {
    models.value.movement_date = $event
    await loadDerivativeContracting()
  }

  const loadDerivativeContracting = async () => {
    await _resetKeys(keysDerivativeContracting)

    if (models.value.contract_id && models.value.movement_date) {
      await _getResources(
        keysDerivativeContracting,
        `filter[contract_id]=${
          models.value.contract_id
        }&filter[scheduled_date_lte]=${moment(
          models.value.movement_date
        ).format('YYYY-MM-DD')}`
      )
    }
  }

  const changeMovementCode = ($event: number) => {
    models.value.movement_code_id = $event

    props.validate.movementHasContractExecution = false
    has_budget.value = false

    const movement = movement_management.value.find(
      (item) => item.value == $event
    )

    if (movement) {
      props.validate.movementHasContractExecution =
        movement.has_contract_execution
      has_budget.value = movement.has_handle_budget
    }
  }

  const changeDocumentType = ($event: number) => {
    models.value.document_type_id = $event

    props.validate.hasInternalConsecutive = false
    props.validate.hasClientConsecutive = false
    props.validate.hasOrder = false
    props.validate.hasOtherReferences = false
    props.validate.hasLegalizationDate = false
    props.validate.hasExpirationDate = false

    const type = document_type_code_name_with_id.value.find(
      (item) => item.value == $event
    )

    if (type) {
      props.validate.hasInternalConsecutive = type.has_internal_consecutive
      props.validate.hasClientConsecutive = type.has_client_consecutive
      props.validate.hasOrder = type.has_order
      props.validate.hasOtherReferences = type.has_other_references
      props.validate.hasLegalizationDate = type.has_legalization_date
      props.validate.hasExpirationDate = type.has_expiration_date
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
    () => models.value.business_id,
    (val) => {
      business_id.value = val || 0
      business_label.value = ''

      if (val)
        business_label.value =
          business_trusts.value.find((item) => item.value == val)?.label ?? ''
    }
  )

  watch(
    () => models.value.business_id,
    (val) => {
      if (!val) return

      const business = business_trusts.value.find((item) => item.value == val)

      if (business) {
        props.validate.hasHandleBudgetBusiness = business.has_budget ?? false
        props.validate.hasDerivateContracting =
          business.derivate_contracting ?? false
      }
    },
    { immediate: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    _resetKeys(keysBusinessTrust)
  })

  onBeforeMount(() => {
    disbursementType.value = disbursementTypeOptions.filter(
      (item) => item.value != 'Todos'
    )
  })

  return {
    mainInformationFormRef,
    models,
    hasContractExecution,
    has_budget,

    // selects
    document_type_code_name_with_id,
    business_trusts,
    filteredMovementManagement,
    basic_info_contract,
    contract_payment_milestones,
    validityYears,
    budget_document_transfer_type,
    budget_document_number,
    budget_document_validities_by_business,

    // methods
    changeBusiness,
    changeContract,
    changeMovementDate,
    changeMovementCode,
    changeDocumentType,

    // rules
    is_required,
    min_length,
    max_length,
    only_alphanumeric,
    valid_format_date,
    date_before_or_equal_to_the_current_date,
    only_business_day,
  }
}

export default useMainInformationForm
