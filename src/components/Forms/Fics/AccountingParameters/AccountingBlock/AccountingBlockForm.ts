// Vue - Pinia
import { ref, watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType, ActionHandlers } from '@/interfaces/global'
import {
  IAccountingParametersAccountingBlockList,
  IAccountingParametersAccountingBlockForm,
  IAccountingParametersAccountingBlockView,
  IAccountingBlockEmits,
} from '@/interfaces/customs/fics/AccountingBlocks'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useAccountingParametersAccountingBlockStore } from '@/stores/fics/accounting-parameters/accounting-block'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountingBlockForm = (
  props: {
    action: ActionType
  },
  emit: IAccountingBlockEmits
) => {
  const { openMainLoader } = useMainLoader()
  const { isEmptyOrZero } = useUtils()

  const {
    accounting_block_list,
    accounting_block_form,
    accounting_block_view,
  } = storeToRefs(useAccountingParametersAccountingBlockStore('v1'))
  const {
    _setAccountingBlockForm,
    _createAccountingBlock,
    _updateAccountingBlock,
  } = useAccountingParametersAccountingBlockStore('v1')

  const { business_trust_types, cost_centers_structures, account_structures } =
    storeToRefs(useTrustBusinessResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: [
      'business_trust_types',
      'cost_centers_structures',
      'account_structures',
    ],
  }

  const accountingBlockFormElementRef = ref()

  const initialModels: IAccountingParametersAccountingBlockForm = {
    consecutive: null,
    business_group_id: null,
    accounting_plan_id: null,
    plan_cost_center_id: null,
    budget_block_id: null,
    created_by_form: true,
  }

  const models = ref<IAccountingParametersAccountingBlockForm>({
    ...initialModels,
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: ActionHandlers = {
      create: setFormCreate,
      edit: () => setFormEdit(accounting_block_view.value),
    }

    actionHandlers[action]?.()
  }

  const getNextConsecutive = (): number => {
    const maxId =
      accounting_block_list.value.length > 0
        ? Math.max(
            ...accounting_block_list.value.map(
              (item: IAccountingParametersAccountingBlockList) => item.id || 0
            )
          )
        : 0

    return maxId + 1
  }

  const setFormCreate = () => {
    clearForm()

    Object.assign(models.value, {
      ...accounting_block_form.value,
      consecutive: getNextConsecutive(),
    })
  }

  const setFormEdit = (
    data: IAccountingParametersAccountingBlockView | null
  ) => {
    clearForm()
    const dataEdit = data as IAccountingParametersAccountingBlockView
    if (!dataEdit) return

    Object.assign(models.value, dataEdit)
    models.value.consecutive = dataEdit.id ?? null
  }

  const clearForm = () => {
    Object.assign(models.value, initialModels)
  }

  const makeDataRequest = (): IAccountingParametersAccountingBlockForm => {
    const form = accounting_block_form.value

    return {
      business_group_id: form?.business_group_id ?? null,
      accounting_plan_id: form?.accounting_plan_id ?? null,
      plan_cost_center_id: form?.plan_cost_center_id ?? null,
      budget_block_id: form?.budget_block_id ?? null,
      created_by_form: form?.created_by_form ?? true,
    }
  }

  const validateForm = async () => {
    return (await accountingBlockFormElementRef.value?.validate()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    const payload = makeDataRequest()
    let success = false

    if (props.action === 'edit' && accounting_block_view.value?.id) {
      success = await _updateAccountingBlock(
        payload,
        accounting_block_view.value?.id
      )
    } else {
      success = await _createAccountingBlock(payload)
    }

    if (success) {
      emit('update-fetch-table')
      emit('close-modal')
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    await handlerActionForm(props.action)
    _getResources(keys)
  })

  onUnmounted(async () => {
    _setAccountingBlockForm(null)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setAccountingBlockForm(null)
      } else {
        _setAccountingBlockForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    accountingBlockFormElementRef,
    business_trust_types,
    cost_centers_structures,
    account_structures,
    onSubmit,
  }
}

export default useAccountingBlockForm
