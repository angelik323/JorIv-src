import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

// Composables
import { useRules, useUtils } from '@/composables'

// Interfaces
import { WriteActionType } from '@/interfaces/global'
import { IAccountingParametersCollectionsForm } from '@/interfaces/customs/treasury/AccountingParametersCollection'
import { ICollectionAccountingBlocksForm } from '@/interfaces/customs/treasury/CollectionAccountingBlocks'

// Stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useInformationForm = (
  props: {
    action: WriteActionType
    data: IAccountingParametersCollectionsForm | null
    dataBlock: ICollectionAccountingBlocksForm | null
  },
  emit: Function
) => {
  const {
    third_parties,
    third_party_types,
    cash_flow_structures,
    operational_cost_centers,
    collection_concepts_codes,
    accounting_account_contrapart,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const {
    budget_item_codes_payment_block,
    areas_resposabilities_codes,
    budget_resource_codes,
    budget_document_types,
    code_movements_types_contracting,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const { is_required } = useRules()
  const { isEmptyOrZero } = useUtils()

  const formElementRef = ref()

  const initialModelsValues: IAccountingParametersCollectionsForm = {
    collection_concept_id: null,
    accounting_blocks_collection_code: '',
    description: '',
    cost_center_id: null,
    third_party_type: null,
    third_party_id: null,
    distributes_business_percentage: false,
    account_chart_id: null,
    cash_flow_structure_id: null,
    budget_item_id: null,
    budget_area_id: null,
    budget_resource_id: null,
    budget_document_type_id: null,
    budget_movement_code_id: null,
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const initialInfoModelsValues: ICollectionAccountingBlocksForm = {
    code: '',
    description: '',
    collection_structure_name: '',
    accounting_structure_name: '',
    cost_center_structure_name: '',
    budget_structure_name: '',
    cash_flow_structure_name: '',
  }
  const infoModels = ref<typeof initialInfoModelsValues>({ ...initialInfoModelsValues })

  const selectOptions = computed(() => ({
    third_parties: third_parties.value,
    third_party_types: third_party_types.value,
    cash_flow_structures: cash_flow_structures.value,
    budget_item_codes_payment_block: budget_item_codes_payment_block.value,
    areas_resposabilities_codes: areas_resposabilities_codes.value,
    budget_resource_codes: budget_resource_codes.value,
    budget_document_types: budget_document_types.value,
    code_movements: code_movements_types_contracting.value,
    operational_cost_centers: operational_cost_centers.value,
    accounting_account_contrapart: accounting_account_contrapart.value,
    collection_concepts_codes: collection_concepts_codes.value,
  }))

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const _setValueInfoModel = () => {
    if (!props.dataBlock) return
    infoModels.value = { ...props.dataBlock }
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
    () => props.dataBlock,
    (val) => {
      if (!val) return
      _setValueInfoModel()
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

  return {
    formElementRef,
    models,
    infoModels,
    selectOptions,
    is_required,
  }
}

export default useInformationForm
