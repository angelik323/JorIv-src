// core
import { onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils, useRules } from '@/composables'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IPaymentBlockForm } from '@/interfaces/customs/accounts-payable/PaymentBlocks'

// constants
import { disbursementTypeOptions } from '@/constants/resources'

// stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

const useBasicDataForm = (
  props: {
    action?: ActionType
    data?: IPaymentBlockForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero } = useUtils()
  const { is_required, max_length, only_alphanumeric } = useRules()

  // stores
  const {
    account_structures_accounting_concepts,
    account_structures_payment_concepts,
    budget_structures,
  } = storeToRefs(useAccountingResourceStore('v1'))

  // refs
  const disbursementType = ref()

  // configs
  const basicDataFormRef = ref()

  const models = ref<IPaymentBlockForm>({
    id: null,
    block_code: '',
    block_name: '',
    accounting_structure_id: null,
    payment_structure_id: null,
    budget_requirement_id: null,
  })

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
    account_structures_accounting_concepts,
    account_structures_payment_concepts,
    budget_structures,

    // rules
    is_required,
    max_length,
    only_alphanumeric,
  }
}

export default useBasicDataForm
