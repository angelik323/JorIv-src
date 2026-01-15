// core
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils, useRules } from '@/composables'

// interfaces
import { ISettlementConceptsUpdate } from '@/interfaces/customs/accounts-payable/PaymentBlocks'

// stores
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

const useSettlementConceptForm = (
  props: {
    data?: ISettlementConceptsUpdate
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero } = useUtils()
  const { is_required } = useRules()

  // stores
  const { settlement_concept } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  // refs
  const SettlementConceptFormRef = ref()

  // configs

  const models = ref<ISettlementConceptsUpdate>({
    settlement_concept_id: null,
    settlement_concept_code: '',
    settlement_concept_name: '',
    is_main_concept: false,
  })

  const changeSettlementConcept = (val: number) => {
    models.value.settlement_concept_id = val

    const found = settlement_concept.value.find((item) => item.value === val)
    models.value.settlement_concept_code = found?.concept_code ?? ''
    models.value.settlement_concept_name = found?.description ?? ''
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

  return {
    SettlementConceptFormRef,
    models,

    // selects
    settlement_concept,

    // rules
    is_required,

    // methods
    changeSettlementConcept,
  }
}

export default useSettlementConceptForm
