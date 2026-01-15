// vue - router - quasar - pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces & types
import { IResourceBudget } from '@/interfaces/customs/budget/ResourceBudget'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'
// Composables
import {
  useUtils,
  useMainLoader,
  useGoToUrl,
  useRouteValidator,
  useAlert,
} from '@/composables'
// Stores
import { useBudgetResourceModuleStore } from '@/stores/budget/budget-resources'
import {
  useResourceManagerStore,
  useBudgetResourceStore,
} from '@/stores/resources-manager'

const useResourceBudgetList = () => {
  const { validateRouter } = useRouteValidator()
  const { _listAction, _deleteAction, _clearData, _downloadExcelAction } =
    useBudgetResourceModuleStore('v1')
  const { resources_list, resources_pages } = storeToRefs(
    useBudgetResourceModuleStore('v1')
  )
  const { budget_resources_types, account_structures, budget_item_types } =
    storeToRefs(useBudgetResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const headerProps = {
    title: 'Recursos presupuestales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Recursos presupuestales', route: 'ResourceBudgetList' },
    ],
  }

  // Agregar opción "Todos" al selector de tipos
  const budget_item_types_with_all = computed(() => {
    const base = Array.isArray(budget_item_types.value)
      ? budget_item_types.value
      : []
    return [{ label: 'Todos', value: '' }, ...base]
  })
  const tableProps = ref<IBaseTableProps<IResourceBudget>>({
    title: 'Listado de recursos presupuestales',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
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
        name: 'resource_type',
        required: true,
        label: 'Tipo de recurso',
        align: 'left',
        field: (row: IResourceBudget) =>
          row.resource_type ? `${row.resource_type?.description}` : '-',
        sortable: true,
      },
      {
        name: 'structure',
        required: true,
        label: 'Estructura de recurso',
        align: 'left',
        field: (row: IResourceBudget) =>
          row.structure
            ? `${row.structure?.code} - ${row.structure?.purpose}`
            : '-',
        sortable: true,
      },
      {
        name: 'manage_bank_account',
        required: true,
        label: '¿Maneja cuenta bancaria?',
        align: 'left',
        field: (row: IResourceBudget) =>
          row.manage_bank_account === 'Si' ? 'Si' : 'No',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'structure_resource',
      label: 'Estructura de recurso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: account_structures,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
    {
      name: 'type_resource',
      label: 'Tipo de recurso',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: budget_resources_types,
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
      class: 'col-12 col-md-4 q-py-md',
      options: budget_item_types_with_all,
      placeholder: 'Todos',
      disable: false,
      clean_value: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-4 q-py-md',
      placeholder: 'Buscar por código o nombre',
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      disable: false,
    },
    {
      name: 'has_bank_account',
      label: '',
      type: 'q-option-group',
      value: [],
      class: 'col-xs-12 col-sm-4 q-py-md',
      options: [{ label: '¿Maneja cuenta bancaria?', value: true }],
      clean_value: true,
      disable: false,
      radioType: 'checkbox',
    },
  ])

  // Filtros
  const filtersFormat = ref<Record<string, string | number>>({})
  const filtersUpdate = (values: Record<string, string | number>) => {
    filtersFormat.value = { ...values }
  }
  const handleFilter = async (filters: Record<string, string | number>) => {
    filtersFormat.value = { ...filters, paginate: 1 }
    await listAction()
  }
  const handleClearFilters = async () => {
    _clearData()
  }
  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    listAction()
  }

  const downloadAction = async () => {
    _downloadExcelAction(filtersFormat.value)
  }
  const listAction = async () => {
    tableProps.value.loading = true
    await _listAction(filtersFormat.value)
    tableProps.value.loading = false
  }
  const deleteModalRef = ref()
  const alertModalConfig = ref({
    description: '¿Desea eliminar el recurso presupuestal?',
    entityId: null as string | null,
  })
  const openModalDelete = async (code: string) => {
    alertModalConfig.value.entityId = code || null
    deleteModalRef.value.openModal()
  }
  const handleDelete = async () => {
    if (!alertModalConfig.value.entityId) return
    deleteModalRef.value.closeModal()
    openMainLoader(true)
    const success = await _deleteAction(
      alertModalConfig.value.entityId as string
    )
    if (success) await listAction()
    openMainLoader(false)
  }
  const handleCloseModalDelete = () => {
    alertModalConfig.value.entityId = null
    showAlert('No se eliminó ningún registro', 'info', undefined, 3000)
  }
  // Watch para actualizar rows cuando cambie el store
  watch(
    () => resources_list.value,
    () => {
      tableProps.value.rows = resources_list.value
      tableProps.value.pages.currentPage = resources_pages.value.currentPage
      tableProps.value.pages.lastPage = resources_pages.value.lastPage
    },
    { immediate: true, deep: true }
  )
  const BudgetKeys = [
    'budget_resources_types',
    'account_structures',
    'budget_item_types',
  ]

  onMounted(async () => {
    _clearData()
    _getResources({ budget: BudgetKeys })
  })
  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    defaultIconsLucide,
    deleteModalRef,
    alertModalConfig,
    updatePage,
    updatePerPage,
    downloadAction,
    openModalDelete,
    handleFilter,
    goToURL,
    validateRouter,
    handleClearFilters,
    filtersUpdate,
    handleDelete,
    handleCloseModalDelete,
  }
}

export default useResourceBudgetList
