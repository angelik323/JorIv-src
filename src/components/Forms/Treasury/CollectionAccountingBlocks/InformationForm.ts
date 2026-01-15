import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useUtils, useRules } from '@/composables'

import { ICollectionAccountingBlocksResponse } from '@/interfaces/customs'

import { useResourceStore } from '@/stores/resources-selects'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useCollectionAccountingBlocksStore } from '@/stores/treasury/collection-accounting-blocks'

const useInformationForm = (props: {
  action: 'create' | 'edit' | 'view'
  data?: ICollectionAccountingBlocksResponse | null
}) => {
  const { data_information_form } = storeToRefs(
    useCollectionAccountingBlocksStore('v1')
  )

  const {
    budget_structures,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { _setDataInformationForm } = useCollectionAccountingBlocksStore('v1')
  const { _getResourcesTreasuries } = useResourceStore('v1')
  const {
    max_code_collection_blocks,
    collection_concepts,
    accounting_accounts,
    cost_centers,
    cash_flow,
  } = storeToRefs(useResourceStore('v1'))

  const keys = ['accounting_blocks_collection_code']

  const {is_required, max_length} = useRules()

  const formInformation = ref()

  const models = ref<ICollectionAccountingBlocksResponse & { code?: string }>({
    collection_structure_id: 0,
    accounting_structure_id: 0,
    cost_center_structure_id: null,
    budget_structure_id: null,
    cash_flow_structure_id: null,
    description: '',
    code: '',
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }
  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value.description = data_information_form.value.description ?? ''
      models.value.accounting_structure_id =
        data_information_form.value.accounting_structure_id ?? 0
      models.value.collection_structure_id =
        data_information_form.value.collection_structure_id ?? 0
      models.value.cost_center_structure_id =
        data_information_form.value.cost_center_structure_id ?? null
      models.value.budget_structure_id =
        data_information_form.value.budget_structure_id ?? 0
      models.value.cash_flow_structure_id =
        data_information_form.value.cash_flow_structure_id ?? 0
      models.value.code = data_information_form.value.code ?? ''
    }
  }
  const setFormEdit = async () => {
    clearForm()
    const data = data_information_form.value
    if (data) {
      models.value.description = data.description ?? ''
      models.value.accounting_structure_id = data.accounting_structure_id ?? 0
      models.value.collection_structure_id = data.collection_structure_id ?? 0
      models.value.cost_center_structure_id = data.cost_center_structure_id ?? null
      models.value.budget_structure_id = data.budget_structure_id ?? null
      models.value.cash_flow_structure_id = data.cash_flow_structure_id ?? null
      models.value.code = data.code ?? ''
    }
  }

  const clearForm = () => {
    models.value.description = ''
    models.value.accounting_structure_id = 0
    models.value.collection_structure_id = 0
    models.value.cost_center_structure_id = null
    models.value.budget_structure_id = null
    models.value.cash_flow_structure_id = null
    models.value.code = ''
  }
  const _setFormView = async () => {
    clearForm()
    const data = data_information_form.value
    if (data) {
      models.value.description = data.description ?? ''
      models.value.accounting_structure_id = data.accounting_structure_id ?? 0
      models.value.collection_structure_id = data.collection_structure_id ?? 0
      models.value.cost_center_structure_id = data.cost_center_structure_id ?? null
      models.value.budget_structure_id = data.budget_structure_id ?? null
      models.value.cash_flow_structure_id = data.cash_flow_structure_id ?? null
      models.value.code = data.code ?? ''
    }
  }

  onMounted(async () => {
    _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
    handlerActionForm(props.action)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val && (val.collection_structure || val.collection_structure_id)) {
        models.value.description = val.description ?? ''
        models.value.code = val.code ?? ''
        models.value.collection_structure_id =
          val.collection_structure?.id ?? val.collection_structure_id ?? 0
        models.value.accounting_structure_id =
          val.accounting_structure?.id ?? val.accounting_structure_id ?? 0
        models.value.cost_center_structure_id =
          val.cost_center_structure?.id ?? val.cost_center_structure_id ?? null
        models.value.budget_structure_id =
          val.budget_structure?.id ?? val.budget_structure_id ?? null
      } else if (!val) {
        clearForm()
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (useUtils().isEmptyOrZero(models.value)) {
        return
      }

      _setDataInformationForm({
        description: models.value.description ?? '',
        collection_structure_id: models.value.collection_structure_id ?? 0,
        accounting_structure_id: models.value.accounting_structure_id ?? 0,
        cost_center_structure_id: models.value.cost_center_structure_id ?? null,
        budget_structure_id: models.value.budget_structure_id ?? null,
        cash_flow_structure_id: models.value.cash_flow_structure_id ?? null,
        code: models.value.code ?? '',
      })
    },
    { deep: true }
  )

  return {
    models,
    formInformation,
    collection_concepts,
    accounting_accounts,
    cost_centers,
    cash_flow,
    max_code_collection_blocks,
    budget_structures,
    is_required,
    max_length,
  }
}

export default useInformationForm
