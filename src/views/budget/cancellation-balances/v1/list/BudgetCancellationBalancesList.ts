// Vue - pinia
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps } from '@/interfaces/global'
import { IListBudgetDocuments } from '@/interfaces/customs/budget/CancellationBalances'

// Composables
import {
  useUtils,
  useMainLoader,
  useGoToUrl,
  useRules,
  useAlert,
} from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetCancellationBalancesStore } from '@/stores/budget/cancellation-balances'

export const useBudgetCancellationBalancesList = () => {
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatParamsCustom, formatCurrency } = useUtils()

  const { _getListAction, _updateBulkCancel } =
    useBudgetCancellationBalancesStore('v1')
  const { headerPropsDefault, data_list_documents_pages } = storeToRefs(
    useBudgetCancellationBalancesStore('v1')
  )
  const headerProperties = headerPropsDefault.value

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    budget_document_types_code_description,
    budget_document_number,
    business_trusts_with_budget_documents,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const keys = {
    budget: ['budget_document_types'],
  }

  let perPage = 20

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: '¿Desea confirmar la cancelación de saldos?',
  })

  const filtersRef = ref()

  const validityModalRef = ref()

  const resetValidity = () => {
    if (filtersRef.value) {
      filtersRef.value.cleanFiltersByNames(['validity'])
      confirmedValidity = null
    }
    validityModalRef.value.closeModal()
  }

  const selectedBusinessTrust = ref()
  const selectBusinessTrust = (businessId: number) => {
    selectedBusinessTrust.value =
      business_trusts_with_budget_documents.value.find(
        (item) => item.value === businessId
      )
    filtersRef.value.cleanFiltersByNames(['validity'])
  }

  let confirmedValidity: number | null = null

  const validateBusinessTrustValidity = (year: string) => {
    if (
      !selectedBusinessTrust.value ||
      selectedBusinessTrust.value.budget.validity === Number(year) ||
      confirmedValidity === Number(year)
    )
      return true
    if (selectedBusinessTrust.value.budget.validity > Number(year)) {
      validityModalRef.value.openModal()
      confirmedValidity = Number(year)
    }
    if (selectedBusinessTrust.value.budget.validity < Number(year))
      return 'La vigencia ingresada corresponde a una vigencia futura, no se puede continuar.'
    return true
  }

  const filterFields = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_with_budget_documents,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      custom_selection_label: 'business_code',
      rules: [(val: string) => useRules().is_required(val)],
      onChange: selectBusinessTrust,
    },
    {
      name: 'business_description',
      label: 'Descripción negocio*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      autocomplete: true,
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'validity',
      label: 'Vigencia*',
      type: 'q-date',
      mask: 'YYYY',
      value: null,
      class: 'col-12 col-md-4',
      autocomplete: false,
      disable: false,
      clean_value: true,
      placeholder: 'AAAA',
      rules: [
        (val: string) => useRules().is_required(val),
        (val: string) =>
          useRules().date_not_before_year_2000(
            val,
            'YYYY',
            'Vigencia no válida. La vigencia no puede ser menor al año 2000.'
          ),
        (val: string) => validateBusinessTrustValidity(val),
      ],
      navigation_min_year: '2000',
    },
    {
      name: 'budget_document_type_id',
      label: 'Tipo de documento*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: budget_document_types_code_description,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      custom_selection_label: 'code',
      rules: [(val: string) => useRules().is_required(val)],
    },
    {
      name: 'document_type_description',
      label: 'Descripción tipo de documento*',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      autocomplete: true,
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'document_range_from',
      label: 'Desde número de documento*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: budget_document_number,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => useRules().is_required(val)],
    },
    {
      name: 'document_range_to',
      label: 'Hasta número de documento*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: budget_document_number,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => useRules().is_required(val)],
    },
  ])

  const tableRef = ref()
  const tableProperties = ref<IBaseTableProps<IListBudgetDocuments>>({
    title: 'Listado de documentos presupuestales',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: false,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Número de documento',
        align: 'left',
        field: (row: IListBudgetDocuments) => `${row.document_number ?? ''}`,
        sortable: true,
      },
      {
        name: 'movement_code',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: (row: IListBudgetDocuments) => `${row.movement_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'movement_description',
        required: true,
        label: 'Descripción código de movimiento',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${row.movement_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'cancelation_movement_code',
        required: true,
        label: 'Código de movimiento cancelación',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${row.cancelation_movement_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'cancelation_movement_description',
        required: true,
        label: 'Descripción código de movimiento cancelación',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${row.cancelation_movement_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'budget_item_code',
        required: true,
        label: 'Rubro presupuestal',
        align: 'left',
        field: (row: IListBudgetDocuments) => `${row.budget_item_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'budget_item_description',
        required: true,
        label: 'Descripción rubro presupuestal',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${row.budget_item_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'budget_resource_code',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${row.budget_resource_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'budget_resource_description',
        required: true,
        label: 'Descripción recurso',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${row.budget_resource_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'area_responsibility_code',
        required: true,
        label: 'Área',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${row.area_responsibility_code ?? ''}`,
        sortable: true,
      },
      {
        name: 'area_responsibility_description',
        required: true,
        label: 'Descripción área',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${row.area_responsibility_description ?? ''}`,
        sortable: true,
      },
      {
        name: 'balance',
        required: true,
        label: 'Saldo',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${formatCurrency(row.balance ?? 0)}`,
        sortable: true,
      },
      {
        name: 'balance_cancellation',
        required: true,
        label: 'Valor cancelación',
        align: 'left',
        field: (row: IListBudgetDocuments) =>
          `${formatCurrency(row.balance_cancellation ?? 0)}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'cancellation_id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: string = '') => {
    tableProperties.value.loading = true
    tableProperties.value.rows = []
    selectedRows.value = []
    const list_budget_documents = await _getListAction(filters)

    // Calcular el consecutivo basado en la página actual y rows por página
    const currentPage = tableProperties.value.pages.currentPage || 1
    const startIndex = (currentPage - 1) * perPage

    tableProperties.value.rows = list_budget_documents.map((item, index) => ({
      ...item,
      id: startIndex + index + 1,
    }))

    tableRef.value?.clearSelection()

    tableProperties.value.loading = false
  }

  const fetchListAfterUpdate = async () => {
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    const list_budget_documents = await _getListAction(
      queryString ? '&' + queryString : ''
    )
    const currentPage = tableProperties.value.pages.currentPage || 1
    const startIndex = (currentPage - 1) * perPage

    tableProperties.value.rows = list_budget_documents.map((item, index) => ({
      ...item,
      id: startIndex + index + 1,
    }))

    // Actualizar selectedRows con la nueva información
    selectedRows.value = selectedRows.value
      .map((selectedRow) => {
        const updatedRow = list_budget_documents.find(
          (doc) => doc.document_number === selectedRow.document_number
        )
        if (updatedRow) {
          const index = list_budget_documents.indexOf(updatedRow)
          return {
            ...updatedRow,
            id: startIndex + index + 1,
          } as IListBudgetDocuments
        }
        return null
      })
      .filter((row) => row !== null) as IListBudgetDocuments[]

    tableProperties.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const openAlertModal = async () => {
    await alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    // Validar que todos los selectedRows tengan cancellation_id
    const hasInvalidRows = selectedRows.value.some(
      (row) => !row.cancellation_id
    )

    if (hasInvalidRows) {
      showAlert(
        'Algunos registros seleccionados no tienen ID de cancelación asignado.',
        'warning'
      )
      return
    }

    alertModalRef.value.closeModal()

    openMainLoader(true)
    await _updateBulkCancel({
      balance_cancelation_ids: selectedRows.value.map(
        (row) => row.cancellation_id ?? 0
      ),
    })

    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const configAssignCancellationBalancesModal = ref({
    data: {
      numberDocument: 0,
      cancellationId: null as number | null,
      isFromOperationLog: false,
      valueBalanceCancellation: 0,
      balance: 0,
    },
    isOpen: false,
  })

  const selectedRows = ref<IListBudgetDocuments[]>([])

  const handleAssignCancellationBalancesModal = (row: IListBudgetDocuments) => {
    if (!row.document_number) {
      showAlert('El documento no tiene número asignado.', 'warning')
      return
    }

    configAssignCancellationBalancesModal.value.data = {
      numberDocument: row.document_number ?? 0,
      cancellationId: row.cancellation_id ?? null,
      isFromOperationLog: row.is_from_operation_log ?? false,
      valueBalanceCancellation: row.balance_cancellation ?? 0,
      balance: row.balance ?? 0,
    }
    configAssignCancellationBalancesModal.value.isOpen = true
  }

  const handleClear = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[validity]': string
    'filter[business_trust_id]': string
    'filter[budget_document_type_id]': string
    'filter[document_range_from]': string
    'filter[document_range_to]': string
  }) => {
    filtersFormat.value = {
      'filter[validity]': $filters['filter[validity]'],
      'filter[business_trust_id]': $filters['filter[business_trust_id]'],
      'filter[budget_document_type_id]':
        $filters['filter[budget_document_type_id]'],
      'filter[document_range][from]': $filters['filter[document_range_from]'],
      'filter[document_range][to]': $filters['filter[document_range_to]'],
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const onFilterChange = (filters: Record<string, string | number | null>) => {
    const businessTrustId = filters['filter[business_trust_id]']
    const documentTypeId = filters['filter[budget_document_type_id]']

    if (businessTrustId) {
      const selectedBusinessTrust =
        business_trusts_with_budget_documents.value.find(
          (item) => item.value === businessTrustId
        )

      if (selectedBusinessTrust && filtersRef.value) {
        filtersRef.value.setFieldValueByName(
          'business_description',
          selectedBusinessTrust.name
        )
      }
    } else {
      filtersRef.value.setFieldValueByName('business_description', null)
    }

    if (documentTypeId) {
      const selectedDocumentType =
        budget_document_types_code_description.value.find(
          (item) => item.value === documentTypeId
        )
      if (selectedDocumentType && filtersRef.value) {
        filtersRef.value.setFieldValueByName(
          'document_type_description',
          selectedDocumentType.description
        )
      }
    } else {
      filtersRef.value.setFieldValueByName('document_type_description', null)
    }

    const validity = filters['filter[validity]']

    if (businessTrustId && documentTypeId && validity) {
      _getResources(
        { budget: ['budget_document_number'] },
        `filter[budget_document_type_id]=${documentTypeId}&filter[validity]=${validity}&filter[statuses]=55&filter[business_trust_ids]=${businessTrustId}`
      )
    }
  }

  const isDisabledBulkCancelButton = computed(() => {
    return selectedRows.value.length === 0
  })

  watch(
    () => data_list_documents_pages.value,
    () => {
      tableProperties.value.pages = data_list_documents_pages.value
    }
  )

  onMounted(async () => {
    await _getResources(keys)
    await _getResources(
      { budget: ['business_trusts_with_budget_documents'] },
      'filter[only_authorized]=1'
    )
  })

  onBeforeUnmount(() => {
    keys.budget.push('business_trusts_with_budget_documents')
    _resetKeys(keys)
  })

  return {
    filtersRef,
    headerProperties,
    filterFields,
    tableProperties,
    tableRef,
    defaultIconsLucide,
    alertModalRef,
    alertModalConfig,
    configAssignCancellationBalancesModal,
    selectedRows,
    isDisabledBulkCancelButton,
    validityModalRef,
    handleAssignCancellationBalancesModal,
    fetchListAfterUpdate,
    updatePage,
    updatePerPage,
    handleClear,
    handleFilterSearch,
    openAlertModal,
    changeStatusAction,
    goToURL,
    onFilterChange,
    resetValidity,
  }
}
export default useBudgetCancellationBalancesList
