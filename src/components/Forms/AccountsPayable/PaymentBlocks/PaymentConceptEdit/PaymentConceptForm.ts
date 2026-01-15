// core
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils, useRules } from '@/composables'

// interfaces
import { IGenericResource } from '@/interfaces/customs/resources/Common'
import { IPaymentConceptUpdate } from '@/interfaces/customs/accounts-payable/PaymentBlocks'

// stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const usePaymentConceptForm = (
  props: {
    data?: IPaymentConceptUpdate
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero } = useUtils()
  const { is_required } = useRules()

  // stores
  const { budget_item_codes_payment_block, budget_resource_codes } =
    storeToRefs(useBudgetResourceStore('v1'))

  // refs
  const paymentConceptFormRef = ref()

  // configs

  const models = ref<IPaymentConceptUpdate>({
    block_code: '',
    block_name: '',
    obligation_type: '',
    from_budget_item_id: null,
    to_budget_item_id: null,
    from_budget_resource_id: null,
    to_budget_resource_id: null,
    from_budget_item_code: '',
    to_budget_item_code: '',
    from_budget_resource_code: '',
    to_budget_resource_code: '',
  })

  const getCodeByValue = (list: IGenericResource[], val: number): string => {
    const found = list.find((item) => item.value === val)
    return found?.code ?? ''
  }

  const changeFromBudgetItem = (val: number) => {
    models.value.from_budget_item_id = val
    models.value.from_budget_item_code = getCodeByValue(
      budget_item_codes_payment_block.value,
      val
    )
  }

  const changeToBudgetItem = (val: number) => {
    models.value.to_budget_item_id = val
    models.value.to_budget_item_code = getCodeByValue(
      budget_item_codes_payment_block.value,
      val
    )
  }

  const changeFromBudgetResource = (val: number) => {
    models.value.from_budget_resource_id = val
    models.value.from_budget_resource_code = getCodeByValue(
      budget_resource_codes.value,
      val
    )
  }

  const changeToBudgetResource = (val: number) => {
    models.value.to_budget_resource_id = val
    models.value.to_budget_resource_code = getCodeByValue(
      budget_resource_codes.value,
      val
    )
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
    paymentConceptFormRef,
    models,

    // selects
    budget_item_codes_payment_block,
    budget_resource_codes,

    // rules
    is_required,

    // methods
    changeFromBudgetItem,
    changeToBudgetItem,
    changeFromBudgetResource,
    changeToBudgetResource,
  }
}

export default usePaymentConceptForm
