//Core
import { onBeforeUnmount, onMounted, ref, computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { QTableColumn } from 'quasar'
//Interfaces
import type { IBaseTableProps } from '@/interfaces/global'
import type {
  IBudgetTransferList,
  IBudgetTransferModel,
  IBudgetTransferCreatePayload,
  IBudgetTransferDetailItem,
} from '@/interfaces/customs/budget/BudgetTransfer'
import type { IBudgetDocumentTypeResource } from '@/interfaces/customs/resources/Budget'
//Composables
import {
  useUtils,
  useGoToUrl,
  useRules,
  useMainLoader,
  useUtilsCalendarMethods,
  useRouteValidator,
  useAlert,
} from '@/composables'
//Stores
import { useBudgetTransferStore } from '@/stores/budget/budget-transfer'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBudgetTransfer = () => {
  const REQUIRED_ROW_FIELDS: Array<
    keyof Pick<
      IBudgetTransferModel,
      'business' | 'budgetItems' | 'resource' | 'area' | 'month' | 'value'
    >
  > = ['business', 'budgetItems', 'resource', 'area', 'month', 'value']

  const BUDGET_KEYS = [
    'budget_document_types',
    'code_movements',
    'third_parties',
  ]

  const isRowCompleted = (row: IBudgetTransferModel) =>
    REQUIRED_ROW_FIELDS.every((field) => {
      const value = row[field]
      if (value === null || value === undefined) return false
      if (typeof value === 'number') return value !== 0
      if (typeof value === 'string') return value !== ''
      return true
    })

  const getAllTableRows = () => [
    ...budgetTransferStore.models_origin
      .filter(isRowCompleted)
      .map((row) => ({ ...row, nature: 'ORIGEN' })),
    ...budgetTransferStore.models_destination
      .filter(isRowCompleted)
      .map((row) => ({ ...row, nature: 'DESTINO' })),
  ]

  const mapRowToDetail = (
    row: IBudgetTransferModel,
    type: 'ORIGEN' | 'DESTINO'
  ): IBudgetTransferDetailItem | null => {
    if (
      !row.business ||
      !row.budgetItems ||
      !row.resource ||
      !row.area ||
      !row.value ||
      row.month === null ||
      row.month === undefined
    ) {
      return null
    }

    return {
      type,
      business_id: row.business,
      budget_item_id: row.budgetItems,
      budget_resource_id: row.resource,
      area_id: row.area,
      third_party_id: row.third,
      month: row.month,
      value: row.value,
    }
  }

  const buildPayload = (
    formData: IBudgetTransferList,
    modelsOrigin: IBudgetTransferModel[],
    modelsDestination: IBudgetTransferModel[]
  ): IBudgetTransferCreatePayload | null => {
    const mapRows = (
      rows: IBudgetTransferModel[],
      type: 'ORIGEN' | 'DESTINO'
    ) =>
      rows
        .map((row) => mapRowToDetail(row, type))
        .filter((item): item is IBudgetTransferDetailItem => item !== null)

    return {
      fiscal_year: formData.fiscal_year,
      date: formData.date,
      budget_document_type_id: formData.budget_document_type_id,
      code_movement_id: formData.code_movement_id,
      third_party_requester_id: formData.third_party_requester_id,
      description: formData.description,
      resolution_number: formData.resolution_number,
      total_amount: formData.total_amount,
      details: {
        origins: mapRows(modelsOrigin, 'ORIGEN'),
        destinations: mapRows(modelsDestination, 'DESTINO'),
      },
    }
  }
  const { validateRouter } = useRouteValidator()
  const budgetTransferStore = useBudgetTransferStore('v1')
  const {
    budget_transfer_document_type_selector,
    code_movements_for_document_types,
    third_parties,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const { models: modelsStore, resetTrigger } = storeToRefs(budgetTransferStore)
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { defaultIconsLucide, formatCurrency } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { isBusinessDay } = useUtilsCalendarMethods()
  const { showAlert } = useAlert()

  const formRef = ref()

  const models = computed((): IBudgetTransferList => {
    const storeModels = modelsStore.value
    if (storeModels) {
      return storeModels
    }
    return {
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
      budget_document_type_id_description: '',
      code_movement_id_description: '',
      third_party_requester_id_description: '',
    }
  })

  const updateModelField = <K extends keyof IBudgetTransferList>(
    field: K,
    value: IBudgetTransferList[K]
  ) => {
    const processedValue =
      field === 'description' && typeof value === 'string'
        ? value.toUpperCase()
        : value

    budgetTransferStore.setBudgetTransferCreate({
      ...models.value,
      [field]: processedValue,
    })

    if (field === 'budget_document_type_id' && typeof value === 'number') {
      budgetTransferStore.setBudgetSelectedBusiness(value)
      if (value > 0) {
        _getResources(
          { budget: ['code_movements'] },
          `filter[budget_document_type_id]=${value}`
        )
      }
    }
  }

  const initializeStoreData = () => {
    if (!modelsStore.value) {
      budgetTransferStore.setBudgetTransferCreate({
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
    }
  }

  const loadCodeMovementsIfNeeded = async () => {
    const documentTypeId = models.value.budget_document_type_id
    if (documentTypeId && documentTypeId > 0) {
      await _getResources(
        { budget: ['code_movements'] },
        `filter[budget_document_type_id]=${documentTypeId}`
      )
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    initializeStoreData()
    await _getResources({ budget: [...BUDGET_KEYS] })
    await loadCodeMovementsIfNeeded()
    openMainLoader(false)
  })

  const resetFormValidations = () => {
    formRef.value?.resetValidation?.()
  }

  watch(resetTrigger, (value) => {
    if (value > 0) setTimeout(resetFormValidations, 200)
  })

  const distributeTotalAmount = () => {
    const totalAmount = models.value?.total_amount || 0

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

  watch(() => models.value?.total_amount, distributeTotalAmount, {
    immediate: false,
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: [...BUDGET_KEYS] })
  })

  const headerProps = {
    title: 'Traslados presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Traslados presupuestales', route: 'BudgetTransferList' },
    ],
  }

  const business_transfer_parameters = computed(() => {
    const documentTypeId = models.value?.budget_document_type_id
    if (
      !documentTypeId ||
      !budget_transfer_document_type_selector.value.length
    ) {
      return null
    }

    const selectedType = budget_transfer_document_type_selector.value.find(
      (doc) => doc.id === documentTypeId
    ) as IBudgetDocumentTypeResource | undefined

    return selectedType?.business_transfer_parameters || null
  })

  const showAdjustedValueColumn = computed(
    () => business_transfer_parameters.value?.one_to_one === 1
  )

  const hasTableData = computed(
    () =>
      budgetTransferStore.models_origin.some(isRowCompleted) ||
      budgetTransferStore.models_destination.some(isRowCompleted)
  )

  const isFormValid = computed(() => {
    const form = models.value
    const currentYear = new Date().getFullYear()

    return (
      form.fiscal_year === currentYear &&
      !!form.date &&
      form.budget_document_type_id > 0 &&
      form.code_movement_id > 0 &&
      !!form.description.trim() &&
      !!form.resolution_number.trim() &&
      form.total_amount > 0
    )
  })

  const buildTableColumns = (): QTableColumn<IBudgetTransferModel>[] => {
    const createCol = (
      name: string,
      label: string,
      field:
        | keyof IBudgetTransferModel
        | ((row: IBudgetTransferModel) => string),
      align: 'left' | 'center' | 'right' = 'left'
    ): QTableColumn<IBudgetTransferModel> => ({
      name,
      required: true,
      label,
      align,
      field: field as QTableColumn<IBudgetTransferModel>['field'],
      sortable: true,
    })

    const columns: QTableColumn<IBudgetTransferModel>[] = [
      createCol('id', '#', 'id'),
      createCol('nature', 'Naturaleza', 'nature'),
      createCol('business', 'Negocio', 'business'),
      createCol('budgetItems', 'Rubro presupuestal', 'budgetItems'),
      createCol('resource', 'Recurso', 'resource'),
      createCol('area', 'Área', 'area'),
      createCol('third', 'Tercero', 'third'),
      createCol('month', 'Mes', 'month'),
      createCol('value', 'Valor', (row) =>
        formatCurrency(Number(row.value) || 0)
      ),
    ]

    if (showAdjustedValueColumn.value) {
      columns.push(
        createCol('adjustedValue', 'Valor ajustado', 'adjustedValue')
      )
    }

    columns.push(createCol('actions', 'Acciones', 'id', 'center'))
    return columns
  }

  const tableProps = ref<IBaseTableProps<IBudgetTransferModel>>({
    title: 'Listado de traslados',
    loading: false,
    columns: buildTableColumns(),
    rows: getAllTableRows(),
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  watch(
    () => [
      budgetTransferStore.models_origin,
      budgetTransferStore.models_destination,
    ],
    () => {
      tableProps.value.rows = getAllTableRows()
    },
    { deep: true }
  )

  watch(
    showAdjustedValueColumn,
    () => {
      tableProps.value.columns = buildTableColumns()
    },
    { immediate: false }
  )

  const createView = () => {
    goToURL('BudgetTransferCreate')
  }

  const editRow = (id: number) => {
    goToURL('BudgetTransferEdit', id)
  }

  const alertModalRef = ref()

  const confirmModal = () => {
    alertModalRef.value.openModal()
  }

  const closeModal = () => {
    alertModalRef.value.closeModal()
  }

  const handleConfirm = async () => {
    if (!hasTableData.value) {
      showAlert(
        'Debes diligenciar al menos un registro en origen o destino.',
        'warning'
      )
      closeModal()
      return
    }

    const payload = buildPayload(
      models.value,
      budgetTransferStore.models_origin,
      budgetTransferStore.models_destination
    )

    if (!payload) {
      showAlert('Error al construir el payload', 'error')
      closeModal()
      return
    }

    const isSuccess = await budgetTransferStore.createAction(payload)
    closeModal()

    if (isSuccess) {
      handleCleanData()
    }
  }

  const handleBusinessDcoument = (event: {
    value: number
    description: string
  }) => {
    updateModelField('budget_document_type_id', event.value)
    updateModelField('budget_document_type_id_description', event.description)
  }

  const handleCodeMovement = (event: {
    value: number
    description: string
  }) => {
    updateModelField('code_movement_id', event.value)
    updateModelField('code_movement_id_description', event.description)
  }

  const handleThirdPartyRequester = (event: {
    value: number
    legal_person?: { business_name?: string }
    natural_person?: { full_name?: string }
  }) => {
    updateModelField('third_party_requester_id', event.value)
    updateModelField(
      'third_party_requester_id_description',
      event.legal_person?.business_name || event.natural_person?.full_name || ''
    )
  }

  const handleCleanData = () => {
    budgetTransferStore.resetAll()
    nextTick(resetFormValidations)
  }

  return {
    headerProps,
    tableProps,
    defaultIconsLucide,
    alertModalRef,
    budget_transfer_document_type_selector,
    code_movements_for_document_types,
    third_parties,
    models,
    hasTableData,
    isFormValid,
    formRef,
    handleBusinessDcoument,
    handleCodeMovement,
    handleThirdPartyRequester,
    handleCleanData,
    updateModelField,
    useRules,
    isBusinessDay,
    createView,
    editRow,
    confirmModal,
    handleConfirm,
    validateRouter,
  }
}

export default useBudgetTransfer
