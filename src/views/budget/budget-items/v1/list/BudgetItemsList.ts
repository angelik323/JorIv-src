// vue - router - quasar - pinia
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces & types
import { QTable } from 'quasar'
import { IFieldFilters } from '@/interfaces/customs'
import { IBudgetItemsTable, IBudgetItemRow } from '@/interfaces/customs'
// Composable
import {
  useMainLoader,
  useGoToUrl,
  useUtils,
  useRouteValidator,
} from '@/composables'
// Stores
import {
  useAccountingResourceStore,
  useBudgetItemsModuleStore,
  useBudgetResourceStore,
  useResourceManagerStore,
} from '@/stores'

export const useBudgetItemsList = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { budget_items_statuses, budget_item_types, budget_item_codes } =
    storeToRefs(useBudgetResourceStore('v1'))
  const {
    budget_item_structure,
    chart_of_account_structures,
    resource_catalog_structures,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _clearData, _downloadExcelAction, _listAction, _deleteAction } =
    useBudgetItemsModuleStore('v1')
  const { budget_items_list, budget_items_pages } = storeToRefs(
    useBudgetItemsModuleStore('v1')
  )

  const BudgetKeys = [
    'budget_item_types',
    'budget_item_nature',
    'budget_items_statuses',
    'budget_item_codes',
  ]
  const AccountingKeys = [
    'budget_item_structure',
    'chart_of_account_structures',
    'resource_catalog_structures',
  ]

  onMounted(async () => {
    _clearData()
    _getResources({ budget: BudgetKeys })
    _getResources({ accounting: AccountingKeys }, '', 'v2')
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys, accounting: AccountingKeys })
  })
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Rubros presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Configuración' },
      { label: 'Rubros presupuestales', route: 'BudgetItemsList' },
    ],
  }

  // Agregar opción "Todos" al selector de tipos
  const budget_item_types_with_all = computed(() => {
    const base = Array.isArray(budget_item_types.value)
      ? budget_item_types.value
      : []
    return [{ label: 'Todos', value: '' }, ...base]
  })

  // Agregar opción "Todos" al selector de estados
  const budget_items_statuses_with_all = computed(() => {
    const base = Array.isArray(budget_items_statuses.value)
      ? budget_items_statuses.value
      : []
    return [{ label: 'Todos', value: '' }, ...base]
  })

  const tableProps = ref<IBudgetItemsTable>({
    title: 'Listado de rubros presupuestales',
    loading: false,
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
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'budget_structure',
        required: true,
        label: 'Estructura presupuestal',
        align: 'left',
        field: (row) =>
          row.budget_structure
            ? `${row.budget_structure.code} - ${row.budget_structure.description}`
            : '-',
        sortable: true,
      },
      {
        name: 'resource_structure',
        required: true,
        label: 'Estructura de recurso',
        align: 'left',
        field: (row) =>
          row.resource_structure
            ? `${row.resource_structure.code} - ${row.resource_structure.description}`
            : '-',
        sortable: true,
      },
      {
        name: 'accounting_structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: (row) =>
          row.accounting_structure
            ? `${row.accounting_structure.code} - ${row.accounting_structure.description}`
            : '-',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IBudgetItemRow[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'budget_structure_id',
      label: 'Estructura presupuestal',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: budget_item_structure,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
    {
      name: 'resource_structure_id',
      label: 'Estructura de recurso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: resource_catalog_structures,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-4 q-py-md',
      placeholder: 'Buscar por descripción',
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      disable: false,
    },
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3 q-py-md',
      options: chart_of_account_structures,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
    {
      name: 'type',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3 q-py-md',
      options: budget_item_types_with_all,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3 q-py-md',
      options: budget_items_statuses_with_all,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
    },
    {
      name: 'code',
      label: 'Código',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3 q-py-md',
      options: budget_item_codes,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
  ])

  // Filtros
  const filtersFormat = ref<Record<string, string | number>>({})

  const filtersUpdate = (values: Record<string, string | number>) => {
    filtersFormat.value = { ...values }
  }

  const handleFilter = async (filters: Record<string, string | number>) => {
    // Actualiza el estado reactivo de filtros
    filtersFormat.value = {
      ...filters,
      page: 1,
      paginate: 'true',
      rows: filtersFormat.value.rows,
    }
    // Llama a la store con parámetros
    await listAction()
  }

  const handleClearFilters = async () => {
    _clearData()
  }

  const downloadAction = async () => {
    openMainLoader(true)
    await _downloadExcelAction(formatParamsCustom({ ...filtersFormat.value }))

    openMainLoader(false)
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value.rows = rowsPerPage
    filtersFormat.value.page = 1
    listAction()
  }

  const listAction = async () => {
    tableProps.value.loading = true

    await _listAction(filtersFormat.value)

    tableProps.value.loading = false
  }

  const deleteModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar el rubro presupuestal?',
    entityId: null as number | null,
  })

  const openModalDelete = async (id: number) => {
    alertModalConfig.value.entityId = id || null

    deleteModalRef.value.openModal()
  }
  const handleDelete = async () => {
    if (!alertModalConfig.value.entityId) return
    deleteModalRef.value.closeModal()

    openMainLoader(true)
    const success = await _deleteAction(alertModalConfig.value.entityId)

    openMainLoader(false)

    if (success) {
      // Recargar listado después de eliminar
      await listAction()
    }
  }
  const validateRouterCreate = validateRouter(
    'Budget',
    'BudgetItemsList',
    'create'
  )

  // Watch para actualizar rows cuando cambie el store
  watch(
    () => budget_items_list.value,
    () => {
      tableProps.value.rows = budget_items_list.value
      tableProps.value.pages.currentPage = budget_items_pages.value.currentPage
      tableProps.value.pages.lastPage = budget_items_pages.value.lastPage
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    defaultIconsLucide,
    deleteModalRef,
    alertModalConfig,
    handleFilter,
    updatePage,
    handleClearFilters,
    filtersUpdate,
    validateRouter,
    validateRouterCreate,
    downloadAction,
    openModalDelete,
    handleDelete,
    updatePerPage,
    goToURL,
  }
}
