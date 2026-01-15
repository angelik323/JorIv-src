// vue - router - quasar - pinia
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces & types
import { IBaseTableProps } from '@/interfaces/global'
import type { IFieldFilters } from '@/interfaces/customs/Filters'
import type { IClosureValidation } from '@/interfaces/customs/budget/ClosureValidations'
// Composable
import { useMainLoader, useGoToUrl, useUtils, useRouteValidator } from '@/composables'
// Stores
import {
  useBudgetResourceStore,
  useResourceManagerStore,
} from '@/stores/resources-manager'
import { useClosureValidationsModuleStore } from '@/stores/budget/closure-validations'

export const useClosureValidationsList = () => {
  
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { budget_levels, code_movements } =
    storeToRefs(useBudgetResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    _clearData,
    _downloadExcelAction,
    _listAction,
    _deleteAction,
  } = useClosureValidationsModuleStore()
  const { closure_validations_list, closure_validations_pages } = storeToRefs(
    useClosureValidationsModuleStore()
  )

  const BudgetKeys = ['budget_levels', 'code_movements']

  onMounted(async () => {
    _clearData()
    _getResources({ budget: BudgetKeys })
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Validaciones de cierre de vigencia',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Configuración' },
      { label: 'Validaciones de cierre de vigencia', route: 'ClosureValidationsList' },
    ],
  }

  const tableProps = ref<IBaseTableProps<IClosureValidation>>({
    title: 'Listado de validaciones de cierre de vigencia',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        field: 'id',
        align: 'left',
        sortable: true,
      },
      {
        name: 'level_code',
        required: true,
        label: 'Nivel',
        field: (row: IClosureValidation) =>
          row.level?.name || '-' ,
        align: 'left',
        sortable: true,
        format: (val: string) => val || '-',
      },
      {
        name: 'level_description',
        required: true,
        label: 'Descripción',
        field: (row: IClosureValidation) =>
          row.level?.description || '-' ,
        align: 'left',
        sortable: true,
        format: (val: string) => (val ? val.toUpperCase() : '-'),
      },
      {
        name: 'cancellation_movement_code',
        required: true,
        label: 'Código mov. cancelación',
        field: (row: IClosureValidation) =>
          row.cancellation_code?.code || '-' ,
        align: 'left',
        sortable: true,
        format: (val: string) => val || '-',
      },
      {
        name: 'cancellation_movement_description',
        required: true,
        label: 'Descripción',
        field: (row: IClosureValidation) =>
          row.cancellation_code?.description || '-' ,
        align: 'left',
        sortable: true,
        format: (val: string) => (val ? val.toUpperCase() : '-'),
      },
      {
        name: 'constitution_movement_code',
        required: true,
        label: 'Código mov. constitución',
        field: (row: IClosureValidation) =>
          row.constitution_code?.code || '-' ,
        align: 'left',
        sortable: true,
        format: (val: string) => val || '-',
      },
      {
        name: 'constitution_movement_description',
        required: true,
        label: 'Descripción',
        field: (row: IClosureValidation) =>
          row.constitution_code?.description || '-' ,
        align: 'left',
        sortable: true,
        format: (val: string) => (val ? val.toUpperCase() : '-'),
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
      currentPage: 0,
      lastPage: 0,
    },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'level_name',
      label: 'Nivel',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: budget_levels,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
    },
    {
      name: 'cancellation_code',
      label: 'Código movimiento cancelación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: code_movements,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
    },
    {
      name: 'constitution_code',
      label: 'Código movimiento constitución',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      options: code_movements,
      placeholder: 'Seleccione',
      disable: false,
      clean_value: true,
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
      rows: filtersFormat.value.rows || 20,
    }
    // Llama a la store con parámetros
    await listAction()
  }

  const handleClearFilters = async () => {
    _clearData()
  }

  const downloadAction = async () => {
    openMainLoader(true)
    
    // Excluir parámetros de paginación para descarga de Excel
    const { page, paginate, rows, ...filterParams } = filtersFormat.value
    await _downloadExcelAction(formatParamsCustom(filterParams))
  
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

    const hasFilters = Object.keys(filtersFormat.value).length > 0
    const params = hasFilters 
      ? formatParamsCustom({
          ...filtersFormat.value,
          rows: filtersFormat.value.rows || 20,
        })
      : formatParamsCustom({ 
          page: 1,
          rows: filtersFormat.value.rows || 20,
        })
    await _listAction(params)

    tableProps.value.loading = false
  }

  const deleteModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar la validación de cierre de vigencia?',
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
    const success = await _deleteAction(alertModalConfig.value.entityId.toString())

    openMainLoader(false)

    if (success) {
      // Recargar listado después de eliminar
      await listAction()
    }
  }
  const validateRouterCreate = validateRouter('Budget', 'ClosureValidationsList', 'create')

  // Watch para actualizar rows cuando cambie el store
  watch(
    () => closure_validations_list.value,
    () => {
      tableProps.value.rows = closure_validations_list.value
      tableProps.value.pages.currentPage = closure_validations_pages.value.currentPage
      tableProps.value.pages.lastPage = closure_validations_pages.value.lastPage
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
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
