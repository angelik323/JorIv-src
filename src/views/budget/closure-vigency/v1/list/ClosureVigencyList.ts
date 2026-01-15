// vue - router - quasar - pinia
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces & types
import { IBaseTableProps } from '@/interfaces/global'
import type { IFieldFilters } from '@/interfaces/customs/Filters'
import type { IClosureVigencyRow } from '@/interfaces/customs/budget/ClosureVigency'
// Composable
import {
  useMainLoader,
  useGoToUrl,
  useUtils,
  useRouteValidator,
} from '@/composables'
// Stores
import {
  useBudgetResourceStore,
  useResourceManagerStore,
} from '@/stores/resources-manager'
import { useClosureVigencyStoreV1 } from '@/stores/budget/closure-vigency/closure-vigency-v1'

export const useClosureVigencyList = () => {
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { business_trusts } = storeToRefs(useBudgetResourceStore('v1'))
  const { _clearData, _listAction, _showAction, _downloadErrorReportAction } =
    useClosureVigencyStoreV1()
  const { closure_vigency_list, closure_vigency_pages } = storeToRefs(
    useClosureVigencyStoreV1()
  )

  const BudgetKeys = ['business_trusts']
  onMounted(async () => {
    _getResources({ budget: BudgetKeys })
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })

  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Cierre de vigencia',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Cierre de vigencia', route: 'BudgetValidityClosureList' },
    ],
  }

  // Agregar opción "Todos" al selector de estado
  const status_options = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Procesando', value: 'Procesando' },
    { label: 'Con error', value: 'Con error' },
    { label: 'Exitoso', value: 'Exitoso' },
  ]

  const tableProps = ref<IBaseTableProps<IClosureVigencyRow>>({
    title: 'Listado de procesos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'sequential_number',
        required: true,
        label: '#',
        field: '_row_number',
        align: 'center',
        sortable: false,
      },
      {
        name: 'process_number',
        required: true,
        label: 'Número de proceso',
        field: (row: IClosureVigencyRow) => row.process_number ?? '-',
        align: 'center',
        sortable: true,
      },
      {
        name: 'process_date',
        label: 'Fecha de proceso',
        field: (row: IClosureVigencyRow) => row.process_date ?? '-',
        align: 'center',
        sortable: true,
      },
      {
        name: 'process_time',
        label: 'Hora de proceso',
        field: (row: IClosureVigencyRow) => row.process_time ?? '-',
        align: 'center',
        sortable: true,
      },
      {
        name: 'vigency',
        label: 'Vigencia procesada',
        field: (row: IClosureVigencyRow) => row.vigency ?? row.year ?? '-',
        align: 'center',
        sortable: true,
      },
      {
        name: 'user_name',
        label: 'Usuario de proceso',
        field: (row: IClosureVigencyRow) => row.user_name ?? '-',
        align: 'left',
        sortable: true,
      },
      {
        name: 'process_type',
        label: 'Tipo de proceso',
        field: (row: IClosureVigencyRow) =>
          row.action_type === 'close'
            ? 'Cierre'
            : row.action_type === 'undo'
            ? 'Deshacer cierre'
            : '-',
        align: 'center',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: (row: IClosureVigencyRow) => row.status ?? '-',
        align: 'center',
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
      name: 'process_type',
      label: 'Tipo de proceso',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-4 q-py-md',
      options: [
        { label: 'Todos', value: '' },
        { label: 'Cierre', value: 'close' },
        { label: 'Deshacer cierre', value: 'undo' },
      ],
      placeholder: 'Todos',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
    {
      name: 'business_from_id',
      label: 'Negocio desde*',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-4 q-py-md',
      options: business_trusts,
      placeholder: 'Todos',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
    {
      name: 'business_to_id',
      label: 'Negocio hasta*',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-4 q-py-md',
      options: business_trusts,
      placeholder: 'Todos',
      disable: false,
      clean_value: true,
      autocomplete: true,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: '',
      class: 'col-12 col-md-4 q-py-md',
      options: status_options,
      placeholder: 'Todos',
      disable: false,
      clean_value: true,
      hide: true,
    },
    {
      name: 'vigency_from',
      label: 'Vigencia desde',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      placeholder: 'AAAA',
      disable: false,
      clean_value: true,
      hide: true,
      mask: 'YYYY',
      /*rules: [(val) => useRules().is_required(val, 'La vigencia es requerida')],*/
    },
    {
      name: 'vigency_to',
      label: 'Vigencia hasta',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4 q-py-md',
      placeholder: 'AAAA',
      disable: false,
      clean_value: true,
      hide: true,
      mask: 'YYYY',
      /*rules: [(val) => useRules().is_required(val, 'La vigencia es requerida')],*/
    },
  ])

  // Filtros
  const filtersFormat = ref<Record<string, string | number>>({})

  const filtersUpdate = (values: Record<string, string | number>) => {
    filtersFormat.value = { ...values }
  }
  const handleShowFilters = (showMore: boolean) =>
    filterConfig.value.forEach((field) => {
      if (
        field.name === 'vigency_from' ||
        field.name === 'vigency_to' ||
        field.name === 'status'
      ) {
        field.hide = !showMore
      }
    })

  const handleFilter = async (filters: Record<string, string | number>) => {
    // Limpiar valores vacíos y "Todos"
    const cleanedFilters: Record<string, string | number> = {}
    for (const [key, value] of Object.entries(filters)) {
      if (value !== null && value !== '' && value !== 0) {
        // Si es una fecha, extraer solo el año
        if (key.includes('vigency') && typeof value === 'string') {
          const year = value.split('-')[0]
          if (year) cleanedFilters[key] = year
        } else {
          cleanedFilters[key] = value
        }
      }
    }

    // Actualiza el estado reactivo de filtros
    filtersFormat.value = {
      ...cleanedFilters,
      page: 1,
      paginate: 1,
      rows: filtersFormat.value.rows || 20,
    }
    // Llama a la store con parámetros
    await listAction()
  }

  const handleClearFilters = async () => {
    _clearData()
    filtersFormat.value = {}
    // Resetear valores de filtros a sus valores por defecto
    filterConfig.value.forEach((filter) => {
      if (filter.clean_value) {
        filter.value = filter.name.includes('status') ? '' : null
      }
    })
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

  const handleView = async (id: string | number) => {
    const closureVigency = await _showAction(id)
    if (closureVigency) {
      goToURL('BudgetValidityClosureView', id)
    }
  }

  const handleDownloadErrorReport = async (id: string | number) => {
    openMainLoader(true)
    await _downloadErrorReportAction(id)
    openMainLoader(false)
  }

  // Obtener tipo de estado para el componente ShowStatus
  const getStatusType = (status: string | null | undefined): number => {
    switch (status) {
      case 'Exitoso':
        return 1
      case 'Con error':
        return 2
      case 'Pendiente':
        return 3
      case 'Procesando':
        return 4
      default:
        return 0
    }
  }

  // Watch para actualizar rows cuando cambie el store
  watch(
    () => closure_vigency_list.value,
    () => {
      tableProps.value.rows = closure_vigency_list.value
      tableProps.value.pages.currentPage =
        closure_vigency_pages.value.currentPage
      tableProps.value.pages.lastPage = closure_vigency_pages.value.lastPage
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    defaultIconsLucide,
    handleFilter,
    updatePage,
    handleClearFilters,
    filtersUpdate,
    validateRouter,
    handleView,
    handleDownloadErrorReport,
    updatePerPage,
    goToURL,
    handleShowFilters,
    getStatusType,
  }
}
