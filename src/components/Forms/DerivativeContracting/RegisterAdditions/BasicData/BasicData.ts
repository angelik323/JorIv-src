// Vue
import { computed, ref, watch } from 'vue'

// Interfaces
import { IBasicDataFormAdditions } from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { storeToRefs } from 'pinia'
import {
  useDerivativeContractingResourceStore,
  useRegisterAdditionsStore,
} from '@/stores'

const useBasicDataForm = (
  props: {
    data: IBasicDataFormAdditions | null
    action: ActionType
  },
  emit: Function
) => {
  const { _getDocumentosByContract } = useRegisterAdditionsStore('v1')
  const {
    contract_addition_business_trust,
    contract_modification_type,
    contract_type_id_name,
    contract_periodicity,
    contract_type_for_addition,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))
  const { contractData } = storeToRefs(useRegisterAdditionsStore('v1'))

  const { isEmptyOrZero, formatCurrencyString, formatDate } = useUtils()

  const formElementRef = ref()
  const today = new Date().toISOString().split('T')[0]

  const manual_document_type = computed(() => {
    const found = contract_type_id_name.value.find(
      (e) => String(e.value) === String(models.value.document_type_id)
    )

    const isManual =
      found?.numbering_type_name?.toLocaleLowerCase() === 'manual'

    if (!isManual) models.value.additional_number = null
    return isManual
  })

  const modify_types_formatted = computed(() => {
    const found = contract_type_id_name.value.find(
      (e) => String(e.value) === String(models.value.document_type_id)
    )
    const isComplementary =
      found?.category_name?.toLocaleLowerCase() === 'complementario'
    const options = contract_modification_type.value ?? []

    return isComplementary
      ? options
      : options.filter((e) => e.label !== 'Aclaraciones')
  })

  const initialModelsValues: IBasicDataFormAdditions = {
    contractor: null,
    internal_number: null,
    contract_id: null,
    contract_type_id: null,
    additional_amount: null,
    additional_number: null,
    additional_value: null,
    application_start_date: null,
    business_trust_id: null,
    contract_end_date: null,
    contract_object: null,
    duration: null,
    document_type_id: null,
    justification: null,
    modification_type: null,
    periodicity: null,
    status: null,
    subscription_date: null,
    has_stamp_tax: false,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const fieldRules = {
    // Value fields
    additional_amount: [1, 3],
    trm: [1, 3],
    additional_value: [1, 3],

    // Term fields
    duration: [2, 3],
    start_date: [2, 3],
    end_date: [2, 3],

    // Common fields
    stamp_duty_tax: [1, 2, 3],
  }

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const isEnabled = (ruleList: number[]) => {
    return ruleList.includes(models.value.modification_type as number)
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

  watch(
    () => models.value.contract_type_id,
    (val) => {
      if (val && props.action !== 'view') {
        _getDocumentosByContract(Number(val))
      }
    }
  )

  watch(
    () => models.value.justification,
    (val) => {
      if (val) models.value.contract_object = val
    }
  )

  watch(
    () => contractData.value,
    (val) => {
      if (val) {
        models.value.has_stamp_tax = val?.has_stamp_tax ?? false
        models.value.subscription_date = today
        models.value.application_start_date = today
        models.value.contract_end_date = today
        models.value.business_trust_id = val?.business_trusts_id
      }
    }
  )

  return {
    formElementRef,
    models,
    contractData,
    contract_addition_business_trust,
    contract_modification_type,
    contract_type_id_name,
    contract_periodicity,
    contract_type_for_addition,
    modify_types_formatted,
    manual_document_type,
    fieldRules,
    isEnabled,
    formatDate,
    formatCurrencyString,
  }
}

export default useBasicDataForm
