// Vue - pinia
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IPaymentConceptsForm } from '@/interfaces/customs/accounts-payable/PaymentConcepts'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

const useBasicDataForm = (
  props: {
    data?: IPaymentConceptsForm | null
    action: ActionType
  },
  emit: Function
) => {
  const { account_structures_payment_concepts } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const {
    payment_concept_types,
    payment_concept_nature_types,
    payment_concept_activity_types,
    payment_concept_obligation_types,
    payment_concept_pension_types,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const { isEmptyOrZero } = useUtils()

  const basicDataFormRef = ref()

  const obligationTypeIsPensional = ref(false)
  const liquidatedTaxedIsDisabled = ref(false)
  const isAdvanceIsDisabled = ref(false)

  const models = ref<IPaymentConceptsForm>({
    structure_id: null,
    concept_code: '',
    concept_name: '',
    concept_type: null,
    nature_type: 'egreso',
    activity_type: 'no_aplica',
    obligation_type: 'no_aplica',
    pension_type: null,
    liquidates_taxes: true,
    is_advance: true,
  })

  const selectedStructure = ref<{
    purpose: string | null
    structure: string | null
  }>({
    purpose: '-',
    structure: '-',
  })

  const conceptCodeLength = ref(1)

  watch(
    () => models.value.structure_id,
    (val) => {
      selectedStructure.value.purpose = '-'
      selectedStructure.value.structure = '-'
      conceptCodeLength.value = 1
      if (!val) {
        models.value.concept_type = null
        return
      }
      const selected_structure = account_structures_payment_concepts.value.find(
        (account_structure) => account_structure.id === val
      )
      if (selected_structure) {
        selectedStructure.value.purpose = selected_structure.purpose ?? '-'
        selectedStructure.value.structure = selected_structure.structure ?? '-'

        if (selected_structure.structure) {
          const coincidences = selected_structure.structure.match(/0/g)
          conceptCodeLength.value = coincidences ? coincidences.length : 1
        }
      }
    }
  )

  watch(
    () => models.value.concept_code,
    (val) => {
      if (val) {
        if (
          models.value.concept_type === 'operativo' &&
          val.length < conceptCodeLength.value
        ) {
          models.value.concept_type = 'totalizador'
        }

        if (val.length === conceptCodeLength.value) {
          models.value.concept_type = 'operativo'
        }
      } else {
        models.value.concept_type = null
      }
    }
  )

  watch(
    () => models.value.concept_type,
    (val) => {
      if (
        (val === 'operativo' &&
          conceptCodeLength.value !== models.value.concept_code?.length) ||
        models.value.structure_id === null
      ) {
        models.value.concept_type = 'totalizador'
      }
    }
  )

  watch(
    () => models.value.obligation_type,
    (val) => {
      if (val !== 'pensional') {
        models.value.pension_type = null
      }
      models.value.liquidates_taxes = true
      models.value.is_advance = true
      obligationTypeIsPensional.value = false
      liquidatedTaxedIsDisabled.value = false
      isAdvanceIsDisabled.value = false
      if (!val) return
      obligationTypeIsPensional.value = val === 'pensional'

      if (['credito', 'obligacion_financiera'].includes(val)) {
        models.value.liquidates_taxes = false
        models.value.is_advance = false
        liquidatedTaxedIsDisabled.value = true
        isAdvanceIsDisabled.value = true
      }
    }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    {
      deep: true,
    }
  )

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  return {
    basicDataFormRef,
    models,
    account_structures_payment_concepts,
    payment_concept_types,
    payment_concept_nature_types,
    payment_concept_activity_types,
    payment_concept_obligation_types,
    payment_concept_pension_types,
    selectedStructure,
    conceptCodeLength,
    obligationTypeIsPensional,
    liquidatedTaxedIsDisabled,
    isAdvanceIsDisabled,
  }
}

export default useBasicDataForm
