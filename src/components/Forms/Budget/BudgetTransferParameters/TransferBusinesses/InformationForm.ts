//Core
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
//Interfaces
import { IBudgetTransferBusinessCreate } from '@/interfaces/customs/budget/BudgetTransferParameter'
import { ActionType } from '@/interfaces/global/Action'
//Composables
import { useRules, useUtils } from '@/composables'
//Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useTransferBusinessesForm = (props: {
  action: ActionType
  data?: IBudgetTransferBusinessCreate
}) => {
  const { getLabel } = useUtils()
  const { budget_document_transfer_type } = storeToRefs(
    useBudgetResourceStore('v1')
  )
  const { business_transfer_trusts_selector } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const formRef = ref()

  const isDisabled = computed(() => ['edit', 'view'].includes(props.action))

  const models = ref<IBudgetTransferBusinessCreate>({
    budget_document_type_id: null,
    code: null,
    from_business_source_id: null,
    to_business_source_id: null,
    from_business_target_id: null,
    to_business_target_id: null,
    one_to_one: false,
  })

  watch(
    () => props.data,
    () => {
      if (props.data) models.value = { ...props.data }
    },
    { immediate: true, deep: true }
  )

  return {
    models,
    isDisabled,
    budget_document_transfer_type,
    business_transfer_trusts_selector,
    formRef,
    useRules,
    getLabel,
  }
}

export default useTransferBusinessesForm
