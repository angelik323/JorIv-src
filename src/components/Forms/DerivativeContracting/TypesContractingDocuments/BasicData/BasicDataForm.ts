// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  MaximumAmountAllowed,
  NumberingType,
  ContractTypeStatusBudgetValidity,
} from '@/interfaces/global/DerivativeContracting'
import { ITypesContractingDocumentsBasicDataForm } from '@/interfaces/customs'

// Stores
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useBasicDataForm = (
  props: {
    action: ActionType
    basicDataForm?: ITypesContractingDocumentsBasicDataForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()

  const {
    type_contract_status,
    contract_type,
    contract_type_category,
    contract_type_modality,
    contract_type_valuein,
    contract_type_max_amount_allowed,
    contract_type_numbering_type,
    contract_type_business_numbering_type,
    contract_type_status_budget_validy,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const { budget_document_types, code_movements_types_contracting } =
    storeToRefs(useBudgetResourceStore('v1'))

  const formElementRef = ref()

  const models = ref<ITypesContractingDocumentsBasicDataForm>({
    document_code: null,
    document_name: null,
    category: null,
    numbering_type: null,
    business_numbering_type: null,
    contract_type: null,
    contract_value_in: null,
    max_amount_allowed: null,
    max_allowed_value: null,
    modality: null,
    has_work_plan: false,
    has_supervisor: false,
    has_stamp_tax: false,
    status_id: null,
    budget_validity: null,
    avail_document_id: null,
    avail_movement_id: null,
    comm_document_id: null,
    comm_movement_id: null,
    bud_document_id: null,
    bud_movement_id: null,
  })

  const showBusinessNumerationType = ref(false)
  const showMaxAllowedValue = ref(false)
  const showAvailabilityCommitmentFields = ref(false)
  const isLocalCurrency = ref(false)

  const setValueModel = () => {
    Object.assign(models.value, props.basicDataForm)
    handleNumerationTypeChange(models.value?.numbering_type ?? null)
    handleMaxAmountTypeChange(models.value?.max_amount_allowed ?? null)
    handleBudgetValidityChange(models.value?.budget_validity ?? null)
  }

  const handleNumerationTypeChange = (value: number | null) => {
    models.value.numbering_type = value

    if (!value) {
      models.value.business_numbering_type = null
      showBusinessNumerationType.value = false
      return
    }

    const numberingType = contract_type_numbering_type.value.find(
      (item) => item.value === value
    )
    if (numberingType?.label?.toLowerCase() === NumberingType.MANUAL) {
      models.value.business_numbering_type = null
      showBusinessNumerationType.value = false
    } else {
      showBusinessNumerationType.value = true
    }
  }

  const handleMaxAmountTypeChange = (value: number | null) => {
    models.value.max_amount_allowed = value

    if (!value) {
      models.value.max_allowed_value = null
      showMaxAllowedValue.value = false
      return
    }

    const maxAmountType = contract_type_max_amount_allowed.value.find(
      (item) => item.value === value
    )

    const normalizedLabel = maxAmountType?.label?.trim().toLowerCase() || ''
    const normalizedUndefined = String(MaximumAmountAllowed.UNDEFINED)
      .trim()
      .toLowerCase()

    if (normalizedLabel === normalizedUndefined) {
      models.value.max_allowed_value = null
      showMaxAllowedValue.value = false
    } else {
      const normalizedLocalCurrency = String(
        MaximumAmountAllowed.LOCAL_CURRENCY
      )
        .trim()
        .toLowerCase()
      showMaxAllowedValue.value = true
      isLocalCurrency.value = normalizedLabel === normalizedLocalCurrency
    }
  }

  const handleBudgetValidityChange = (value: number | null) => {
    models.value.budget_validity = value

    if (!value) {
      models.value.avail_document_id = null
      models.value.avail_movement_id = null
      models.value.comm_document_id = null
      models.value.comm_movement_id = null
      showAvailabilityCommitmentFields.value = false
      return
    }
    const budgetValidity = contract_type_status_budget_validy.value.find(
      (item) => item.value === value
    )

    if (
      budgetValidity?.label?.toLowerCase() !==
      ContractTypeStatusBudgetValidity.PROJECTED_BUDGET
    ) {
      models.value.avail_document_id = null
      models.value.avail_movement_id = null
      models.value.comm_document_id = null
      models.value.comm_movement_id = null
      showAvailabilityCommitmentFields.value = false
    } else {
      showAvailabilityCommitmentFields.value = true
    }
  }

  watch(
    () => props.basicDataForm,
    (val) => {
      if (!val) return
      setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.basicDataForm)) return
      emit('update:basic-data-form', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    models,
    formElementRef,
    showBusinessNumerationType,
    showMaxAllowedValue,
    showAvailabilityCommitmentFields,
    isLocalCurrency,

    contract_type_category,
    contract_type_numbering_type,
    contract_type_business_numbering_type,
    contract_type_valuein,
    contract_type_max_amount_allowed,
    type_contract_status,
    contract_type,
    contract_type_modality,
    contract_type_status_budget_validy,
    budget_document_types,
    code_movements_types_contracting,

    handleNumerationTypeChange,
    handleMaxAmountTypeChange,
    handleBudgetValidityChange,
  }
}

export default useBasicDataForm
