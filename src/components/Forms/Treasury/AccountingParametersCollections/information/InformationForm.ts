import { onMounted, ref, watch } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainLoader } from '@/composables'
import { isEmptyOrZero } from '@/utils'
import { ActionType } from '@/interfaces/global'
import {
  IAccountingParametersCollections,
  IAccountingParametersCollectionsForm,
} from '@/interfaces/customs'
import {
  useAccountingParametersCollectionsStore,
  useCollectionAccountingBlocksStore,
  useTreasuryResourceStore,
} from '@/stores'

const useInformationForm = (props: {
  action: ActionType
  data?:
    | IAccountingParametersCollectionsForm
    | IAccountingParametersCollections
    | null
}) => {
  const { openMainLoader } = useMainLoader()

  const { _setAccountingParametersCollectionsForm } =
    useAccountingParametersCollectionsStore('v1')
  const { accounting_parameters_collections_form } = storeToRefs(
    useAccountingParametersCollectionsStore('v1')
  )
  const { type_accounting_blocks_collections_request } = storeToRefs(
    useCollectionAccountingBlocksStore('v1')
  )

  const {
    third_parties,
    third_party_types,
    operational_account_charts,
    operational_cost_centers,
    cash_flow_structures,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const formElementRef = ref()
  const isCostCenterDisabled = ref(false)
  const keyLocalStorage = 'type_accounting_blocks_collections_request'

  const initialModelsValues: IAccountingParametersCollectionsForm = {
    third_party_type: '',
    third_party_id: null,
    account_chart_id: null,
    accounting_blocks_collection_id:
      type_accounting_blocks_collections_request.value?.id ?? null,
    accounting_blocks_collection_code:
      type_accounting_blocks_collections_request.value?.code ?? '',
    cost_center_id: null,
    distributes_business_percentage: false,
    description:
      type_accounting_blocks_collections_request.value?.description ?? '',
    cash_flow_structure_id: null,
    budget_item_id: null,
    budget_area_id: null,
    budget_resource_id: null,
    budget_document_type_id: null,
    budget_movement_code_id: null,
  }

  const models = ref<IAccountingParametersCollectionsForm>({
    ...initialModelsValues,
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setValueModelCreate,
      edit: accounting_parameters_collections_form.value
        ? setValueModelEdit
        : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormEdit = async () => {
    clearForm()
    if (!props.data) return
    const data = props.data as IAccountingParametersCollections

    models.value.third_party_type = data.third_party_type
    models.value.third_party_id = data.third_party?.id ?? null
    models.value.account_chart_id = data.account_chart?.id ?? null
    models.value.accounting_blocks_collection_id =
      type_accounting_blocks_collections_request.value?.id ?? null
    models.value.accounting_blocks_collection_code =
      type_accounting_blocks_collections_request.value?.code ?? ''
    models.value.cost_center_id = data.cost_center?.id ?? null
    models.value.distributes_business_percentage =
      data.distributes_business_percentage
    models.value.description = data.description
    models.value.cash_flow_structure_id = data.cash_flow_structure?.id ?? null
  }

  const setFormView = () => {
    clearForm()
    if (!props.data) return
    const data = props.data as IAccountingParametersCollections

    models.value.third_party_type = data.third_party_type
    models.value.third_party_name = data.third_party?.name ?? null
    models.value.account_chart_code = `${data.account_chart?.code ?? ''} - ${
      data.account_chart?.name ?? ''
    }`
    models.value.accounting_blocks_collection_code =
      type_accounting_blocks_collections_request.value?.code ?? ''
    models.value.cost_center_code = `${data.cost_center?.code ?? ''} - ${
      data.cost_center?.name ?? ''
    }`
    models.value.distributes_business_percentage =
      data.distributes_business_percentage
    models.value.description = data.description
    models.value.cash_flow_structure_code = `${
      data.cash_flow_structure?.code ?? ''
    } - ${data.cash_flow_structure?.name ?? ''}`
  }

  const setValueModelCreate = () => {
    if (!accounting_parameters_collections_form.value) {
      models.value.accounting_blocks_collection_id =
        type_accounting_blocks_collections_request.value?.id ?? null
      models.value.accounting_blocks_collection_code =
        type_accounting_blocks_collections_request.value?.code ?? ''
      models.value.description =
        type_accounting_blocks_collections_request.value?.description ?? ''
    }

    Object.assign(models.value, accounting_parameters_collections_form.value)
  }

  const setValueModelEdit = () => {
    if (!accounting_parameters_collections_form.value) return

    Object.assign(models.value, accounting_parameters_collections_form.value)
  }

  const clearForm = () => {
    Object.assign(models.value, initialModelsValues)
  }

  const updateCostCenterDisabled = () => {
    const hasCostCenterStructure =
      type_accounting_blocks_collections_request.value?.cost_center_structure
    const accountChartId = models.value.account_chart_id
    const accountChart = operational_account_charts.value?.find(
      (chart) => chart.id === accountChartId
    )

    isCostCenterDisabled.value =
      !hasCostCenterStructure ||
      (!!accountChartId && accountChart?.has_cost_center === false)

    if (isCostCenterDisabled.value) {
      models.value.cost_center_id = null
    }
  }

  const setTypeAccountingBlocksCollectionsRequest = () => {
    if (type_accounting_blocks_collections_request.value) {
      localStorage.removeItem(keyLocalStorage)
      localStorage.setItem(
        keyLocalStorage,
        JSON.stringify(type_accounting_blocks_collections_request.value)
      )
    } else {
      const storedValue = localStorage.getItem(keyLocalStorage)
      if (storedValue) {
        try {
          type_accounting_blocks_collections_request.value =
            JSON.parse(storedValue)
        } catch {
          localStorage.removeItem(keyLocalStorage)
        }
      }
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await setTypeAccountingBlocksCollectionsRequest()
    handlerActionForm(props.action)
    updateCostCenterDisabled()
    openMainLoader(false)
  })

  onBeforeRouteLeave(() => {
    localStorage.removeItem(keyLocalStorage)
  })

  watch(
    () => props.data,
    async (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setAccountingParametersCollectionsForm(null)
      } else {
        _setAccountingParametersCollectionsForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.account_chart_id,
    async () => {
      updateCostCenterDisabled()
    },
    { immediate: true }
  )

  return {
    models,
    formElementRef,
    third_parties,
    third_party_types,
    operational_account_charts,
    operational_cost_centers,
    cash_flow_structures,
    isCostCenterDisabled,
  }
}

export default useInformationForm
