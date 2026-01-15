//Core
import { onMounted, computed, onBeforeUnmount, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { QTableColumn } from 'quasar'
//Interfaces
import type { ITabs } from '@/interfaces/global/Tabs'
import type { IBaseTableProps } from '@/interfaces/global'
import type { IBudgetDocumentTypeResource } from '@/interfaces/customs/resources/Budget'
import type { IBudgetTransferModel } from '@/interfaces/customs/budget/BudgetTransfer'
import type { IThirdPartyResourceGeneric } from '@/interfaces/customs/resources/ThirdParty'
//Composables
import {
  useGoToUrl,
  useUtils,
  useMainLoader,
  useRules,
  useRouteValidator,
} from '@/composables'
//Constants
import { month_list } from '@/constants'
//Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetTransferStore } from '@/stores/budget/budget-transfer'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBudgetTransferCreate = () => {
  const BUDGET_KEYS = [
    'budget_document_types',
    'budget_resource_codes',
    'areas_resposabilities_codes',
    'third_parties',
    'budget_item_codes',
  ]

  const { validateRouter } = useRouteValidator()
  const route = useRoute()
  const budgetTransferStore = useBudgetTransferStore('v1')
  const { models: modelsStore } = storeToRefs(budgetTransferStore)
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    budget_document_types,
    business_trust_from_to,
    budget_resource_codes,
    areas_responsabilities_selector,
    third_parties,
    budget_item_codes,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const { defaultIconsLucide, styleColumn } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { budget_selected_business } = storeToRefs(budgetTransferStore)

  const formRef = ref()

  const isEditMode = computed(() => !!route.params.id)

  const headerProps = computed(() => ({
    title: isEditMode.value
      ? 'Editar traslados presupuestales'
      : 'Crear traslados presupuestales',
    btnBack: () => goToURL('BudgetTransferList'),
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Traslados presupuestales', route: 'BudgetTransferList' },
      { label: isEditMode.value ? 'Editar' : 'Crear' },
    ],
  }))

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const createInitialFormValues = () => ({
    id: 0,
    fiscal_year: new Date().getFullYear(),
    date: new Date().toISOString().split('T')[0],
    budget_document_type_id: 0,
    code_movement_id: 0,
    third_party_requester_id: 0,
    description: '',
    resolution_number: '',
    total_amount: 0,
    status_id: 0,
    details: [],
  })

  const createEmptyRow = (): IBudgetTransferModel => ({
    id: Date.now(),
    nature: '',
    business: 0,
    budgetItems: 0,
    resource: 0,
    area: 0,
    third: null,
    month: 0,
    value: 0,
    adjustedValue: 0,
  })

  const initializeStoreData = () => {
    if (!budgetTransferStore.models) {
      budgetTransferStore.setBudgetTransferCreate(createInitialFormValues())
    }
    if (budgetTransferStore.models_origin.length === 0) {
      budgetTransferStore.setModelsOrigin([createEmptyRow()])
    }
    if (budgetTransferStore.models_destination.length === 0) {
      budgetTransferStore.setModelsDestination([createEmptyRow()])
    }
  }

  const addRow = (
    rows: IBudgetTransferModel[],
    setRows: (rows: IBudgetTransferModel[]) => void
  ) => {
    if (isOneToOne.value) return

    const newRow = createEmptyRow()
    newRow.value = modelsStore.value?.total_amount || 0
    setRows([...rows, newRow])
  }

  const removeRow = (
    rows: IBudgetTransferModel[],
    id: number,
    setRows: (rows: IBudgetTransferModel[]) => void
  ) => {
    const filteredRows = rows.filter((row) => row.id !== id)

    if (filteredRows.length === 0) {
      const newRow = createEmptyRow()
      newRow.value = modelsStore.value?.total_amount || 0
      setRows([newRow])
    } else {
      setRows(filteredRows)
    }
  }

  const addOriginRow = () =>
    addRow(
      budgetTransferStore.models_origin,
      budgetTransferStore.setModelsOrigin
    )

  const addDestinationRow = () =>
    addRow(
      budgetTransferStore.models_destination,
      budgetTransferStore.setModelsDestination
    )

  const removeOriginRow = (id: number) =>
    removeRow(
      budgetTransferStore.models_origin,
      id,
      budgetTransferStore.setModelsOrigin
    )

  const removeDestinationRow = (id: number) =>
    removeRow(
      budgetTransferStore.models_destination,
      id,
      budgetTransferStore.setModelsDestination
    )

  const createColumn = (
    name: string,
    label: string,
    field: keyof IBudgetTransferModel | ((row: IBudgetTransferModel) => string),
    align: 'left' | 'center' | 'right' = 'left',
    width?: number
  ): QTableColumn<IBudgetTransferModel> =>
    ({
      name,
      required: true,
      label,
      align,
      field: field as QTableColumn<IBudgetTransferModel>['field'],
      sortable: true,
      ...(width && { style: styleColumn(width) }),
    } as QTableColumn<IBudgetTransferModel>)

  const tableColumns: QTableColumn<IBudgetTransferModel>[] = [
    createColumn('id', '#', 'id'),
    createColumn('business', 'Negocio', 'business', 'left', 200),
    createColumn(
      'businessDescription',
      'Descripción negocio',
      (row) => `${row.businessDescription ?? ''}`
    ),
    createColumn(
      'budgetItem',
      'Rubro presupuestal',
      'budgetItems',
      'left',
      200
    ),
    createColumn(
      'budgetItemDescription',
      'Descripción rubro presupuestal',
      (row) => `${row.budgetItemDescription ?? ''}`
    ),
    createColumn('resource', 'Recurso', 'resource', 'left', 200),
    createColumn(
      'resourceDescription',
      'Descripción recurso',
      (row) => `${row.resourceDescription ?? ''}`
    ),
    createColumn('area', 'Área', 'area', 'left', 200),
    createColumn(
      'areaDescription',
      'Descripción área',
      (row) => `${row.areaDescription ?? ''}`
    ),
    createColumn('third', 'Tercero', 'third', 'left', 200),
    createColumn(
      'thirdName',
      'Nombre tercero',
      (row) => `${row.thirdName ?? ''}`
    ),
    createColumn('month', 'Mes', 'month'),
    createColumn('value', 'Valor', 'value'),
    createColumn('actions', 'Acciones', 'id', 'center'),
  ]

  const customColumns = tableColumns.map((col) => col.name)

  const tableOrigin = ref<IBaseTableProps<IBudgetTransferModel>>({
    title: 'Sección origen',
    loading: false,
    columns: tableColumns,
    rows: budgetTransferStore.models_origin,
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tableDestination = ref<IBaseTableProps<IBudgetTransferModel>>({
    title: 'Sección destino',
    loading: false,
    columns: tableColumns,
    rows: budgetTransferStore.models_destination,
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  watch(
    () => budgetTransferStore.models_origin,
    (rows) => (tableOrigin.value.rows = rows),
    { deep: true }
  )

  watch(
    () => budgetTransferStore.models_destination,
    (rows) => (tableDestination.value.rows = rows),
    { deep: true }
  )

  const distributeTotalAmount = () => {
    const totalAmount = modelsStore.value?.total_amount || 0

    budgetTransferStore.setModelsOrigin(
      budgetTransferStore.models_origin.map((row) => ({
        ...row,
        value: totalAmount,
      }))
    )
    budgetTransferStore.setModelsDestination(
      budgetTransferStore.models_destination.map((row) => ({
        ...row,
        value: totalAmount,
      }))
    )
  }

  watch(() => modelsStore.value?.total_amount, distributeTotalAmount, {
    immediate: true,
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: [...BUDGET_KEYS] })
  })

  const business_transfer_parameters = computed(() => {
    const doc = budget_document_types.value.find(
      (doc) => doc.id === budget_selected_business.value
    ) as IBudgetDocumentTypeResource | undefined
    return doc?.business_transfer_parameters || null
  })

  const loadBusinessTrustResources = async (
    params: typeof business_transfer_parameters.value
  ) => {
    openMainLoader(true)

    const hasParams =
      params?.from_business_source_id && params?.to_business_source_id
    const query = hasParams
      ? `to_business_trust_id=${params.from_business_source_id}&from_business_trust_id=${params.to_business_source_id}`
      : undefined

    if (hasParams || !business_trust_from_to.value.length) {
      await _getResources({ budget: ['business_trust_from_to'] }, query)
    }

    openMainLoader(false)
  }

  watch(business_transfer_parameters, loadBusinessTrustResources, {
    immediate: true,
  })

  onMounted(async () => {
    initializeStoreData()
    openMainLoader(true)
    await _getResources({ budget: [...BUDGET_KEYS] })
    openMainLoader(false)
    distributeTotalAmount()
  })

  const buttonLabel = computed(() =>
    isEditMode.value ? 'Actualizar' : 'Crear'
  )

  const isOneToOne = computed(
    () => business_transfer_parameters.value?.one_to_one === 1
  )

  const createBudgetTransfer = async () => {
    if (await formRef.value?.validate()) goToURL('BudgetTransferList')
  }

  const handleThirdPartyUpdate = (
    row: IBudgetTransferModel,
    event: IThirdPartyResourceGeneric
  ) => {
    row.third = typeof event.value === 'number' ? event.value : null
    row.thirdName =
      event.legal_person?.business_name ||
      event.natural_person?.full_name ||
      event.description ||
      ''
  }

  const handleBusinessUpdate = (
    row: IBudgetTransferModel,
    event: { value: number; description: string }
  ) => {
    row.business = event.value
    row.businessDescription = event.description
  }

  const handleBudgetItemUpdate = (
    row: IBudgetTransferModel,
    event: { value: number; input_description: string }
  ) => {
    row.budgetItems = event.value
    row.budgetItemDescription = event.input_description
  }

  const handleResourceUpdate = (
    row: IBudgetTransferModel,
    event: { value: number; description: string }
  ) => {
    row.resource = event.value
    row.resourceDescription = event.description
  }

  const handleAreaUpdate = (
    row: IBudgetTransferModel,
    event: { value: number; description: string }
  ) => {
    row.area = event.value
    row.areaDescription = event.description
  }

  return {
    headerProps,
    tabs,
    tableOrigin,
    tableDestination,
    customColumns,
    defaultIconsLucide,
    buttonLabel,
    business_transfer_parameters,
    business_trust_from_to,
    budget_resource_codes,
    areas_responsabilities_selector,
    third_parties,
    budget_item_codes,
    isOneToOne,
    formRef,
    month_list,
    addOriginRow,
    addDestinationRow,
    removeOriginRow,
    removeDestinationRow,
    createBudgetTransfer,
    useRules,
    validateRouter,
    handleThirdPartyUpdate,
    handleBusinessUpdate,
    handleBudgetItemUpdate,
    handleResourceUpdate,
    handleAreaUpdate,
  }
}

export default useBudgetTransferCreate
