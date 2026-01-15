import { ref, onMounted, computed, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { defaultIconsLucide } from '@/utils'
import {
  useMonetaryMarketOperationsStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import {
  IFieldFilters,
  IMonetaryMarketOperationsFilters,
  IMonetaryMarketOperationListItem,
} from '@/interfaces/customs'
import { useRouteValidator } from '@/composables'
const useMonetaryMarketOperationsList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const resources = useInvestmentPortfolioResourceStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { operations_type_list, operations_status_list, investment_portfolio } =
    storeToRefs(resources)

  const keys = [
    'operations_type_list',
    'operations_status_list',
    'investment_portfolio',
  ]

  const store = useMonetaryMarketOperationsStore('v1')
  const { _getListAction, _cleanOperationsData } = store
  const { operations_list } = storeToRefs(store)

  const headerProps = {
    title: 'Operaciones renta fija',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Operaciones renta fija' },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
      options: [
        { label: 'Simultáneas', routeName: 'SimultaneosCreate' },
        { label: 'Repos', routeName: 'OperationReposCreate' },
        { label: 'TTV’s', routeName: 'TtvCreate' },
        { label: 'Englobe de títulos', routeName: 'TitlesMergingCreate' },
        {
          label: 'Fraccionamiento de títulos',
          routeName: 'FractionationTitlesCreate',
        },
      ],

      color: 'primary',
      textColor: 'white',
      size: 'md',
      class: 'btn-header',
      outline: false,
      disable: false,
    },
  }

  const filters = ref<IFieldFilters[]>([
    {
      name: 'investment_portfolio',
      label: 'Código portafolio',
      type: 'q-select',
      value: null,
      disable: false,
      class: 'col-12 col-md-4',
      placeholder: 'Seleccione',
      autocomplete: true,
      clean_value: true,
      options: investment_portfolio,
    },
    {
      name: 'operation_type',
      label: 'Tipo de operación',
      type: 'q-select',
      value: null,
      disable: false,
      class: 'col-12 col-md-4',
      placeholder: 'Seleccione',
      clean_value: true,
      options: operations_type_list,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      disable: false,
      class: 'col-12 col-md-4',
      placeholder: 'Buscar por código o papel',
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
    },
    {
      name: 'operation_date',
      label: 'Fecha operación',
      type: 'q-date',
      value: null,
      disable: false,
      class: 'col-12 col-md-3',
      placeholder: 'AAAA-MM-DD',
      clean_value: true,
    },
    {
      name: 'title_status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      disable: false,
      class: 'col-12 col-md-3',
      placeholder: 'Todos',
      clean_value: true,
      options: operations_status_list,
    },
  ])

  const visibleFilters = computed<IFieldFilters[]>(() => filters.value)

  const modelFilters = ref<IMonetaryMarketOperationsFilters>({
    portfolio_id: null,
    operation_type_id: null,
    search: '',
    operation_date: null,
    status: null,
    page: 1,
    rows: 10,
  })

  const filtersKey = computed(() =>
    visibleFilters.value.map((f) => `${f.name}:${f.hide ? 1 : 0}`).join('|')
  )

  const hideFilters = ref<boolean>(true)
  const handleShowMoreFilters = () => {
    hideFilters.value = !hideFilters.value
    filters.value[3].hide = hideFilters.value
    filters.value[4].hide = hideFilters.value
    filters.value[5].hide = hideFilters.value
  }

  const page = ref(1)
  const rowsPerPage = ref(10)

  const paginatedRows = computed(() => {
    const start = (page.value - 1) * rowsPerPage.value
    const end = start + rowsPerPage.value
    return operations_list.value.slice(start, end)
  })

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IMonetaryMarketOperationListItem[]
    pages: { currentPage: number; lastPage: number; total: number }
  }>({
    title: 'Listado de operaciones de mercado',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
      {
        name: 'operation_type',
        label: 'Tipo de operación',
        align: 'left',
        field: (row) => row.operation,
        sortable: true,
      },
      {
        name: 'operation_date',
        label: 'Fecha de operación',
        align: 'left',
        field: (row) => row.operation_date,
        sortable: true,
      },
      {
        name: 'investment_portfolio',
        label: 'Código de portafolio',
        align: 'left',
        field: (row) => row.investment_portfolio_code,
      },
      {
        name: 'investment_portfolio_description',
        label: 'Descripción portafolio',
        align: 'left',
        field: (row) => row.investment_portfolio_description,
      },
      {
        name: 'paper',
        label: 'Papel',
        align: 'left',
        field: (row) => row.paper,
      },
      {
        name: 'title',
        label: 'Número de título',
        align: 'left',
        field: (row) => row.title,
      },
      {
        name: 'operation_number',
        label: 'Número de operación',
        align: 'left',
        field: (row) => row.operation_number,
      },
      {
        name: 'end_date',
        label: 'Fecha vencimiento',
        align: 'left',
        field: (row) => row.end_date,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'center',
        field: (row) => row.status,
      },
      { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1, total: 0 },
  })

  const showState = ref(0)
  const isListEmpty = ref(true)

  const listAction = async (query = ''): Promise<void> => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getListAction(query)
    updateTable()
    isListEmpty.value = operations_list.value.length === 0
    showState.value = 1
    tableProps.value.loading = false
  }

  const handleUpdateFilters = async (
    newFilters: Record<
      string,
      string | number | null | { code?: string; description?: string }
    >
  ): Promise<void> => {
    const filtersCopy: Record<string, string | number> = {}

    for (const [key, value] of Object.entries(newFilters)) {
      if (value !== null && value !== '') {
        if (key === 'investment_portfolio') {
          if (typeof value === 'object' && value.description) {
            filtersCopy['investment_portfolio_description'] = value.description
          } else if (typeof value === 'object' && value.code) {
            filtersCopy['investment_portfolio_code'] = value.code
          } else {
            filtersCopy['investment_portfolio_code'] = String(value)
          }
        } else {
          if (typeof value === 'object' && value !== null) {
            if ('code' in value && value.code !== undefined) {
              filtersCopy[key] = value.code
            } else if (
              'description' in value &&
              value.description !== undefined
            ) {
              filtersCopy[key] = value.description
            }
          } else {
            filtersCopy[key] = value
          }
        }
      }
    }

    const queryString = new URLSearchParams(
      filtersCopy as Record<string, string>
    ).toString()

    await listAction(queryString)
  }

  const updateTable = () => {
    tableProps.value.rows = paginatedRows.value
    tableProps.value.pages = {
      currentPage: page.value,
      lastPage:
        Math.ceil(operations_list.value.length / rowsPerPage.value) || 1,
      total: operations_list.value.length,
    }
  }

  const updatePage = (newPage: number): void => {
    page.value = newPage
    updateTable()
  }

  const updatePerPage = (newRows: number): void => {
    rowsPerPage.value = newRows
    page.value = 1
    updateTable()
  }

  const handleClear = (): void => {
    _cleanOperationsData()
    page.value = 1
    rowsPerPage.value = 10
    tableProps.value.rows = []
    tableProps.value.pages = { currentPage: 1, lastPage: 1, total: 0 }
    isListEmpty.value = true
    showState.value = 0
  }

  const handleView = (row: IMonetaryMarketOperationListItem): void => {
    let routeName = ''

    const type = row.type?.toLowerCase() || ''

    if (type.includes('simultánea')) {
      routeName = 'SimultaneousView'
    } else if (type.includes('repo')) {
      routeName = 'OperationReposView'
    } else if (type.includes('ttv')) {
      routeName = 'TtvView'
    }

    if (routeName) {
      router.push({
        name: routeName,
        params: { operationNumber: row.operation_number },
      })
    }
  }

  const handleEdit = (row: IMonetaryMarketOperationListItem): void => {
    router.push({
      name: 'RegisterMonetaryMarketEdit',
      params: { id: row.id },
    })
  }

  onMounted(async () => {
    await _getResources({ investment_portfolio: keys })
    _cleanOperationsData()
  })

  onBeforeMount(async () => {
    await _resetKeys({ investment_portfolio: [...keys] })
  })

  return {
    headerProps,
    filters,
    visibleFilters,
    filtersKey,
    modelFilters,
    tableProps,
    showState,
    isListEmpty,
    defaultIconsLucide,
    handleClear,
    updatePage,
    updatePerPage,
    listAction,
    handleView,
    handleEdit,
    validateRouter,
    handleShowMoreFilters,
    handleUpdateFilters,
  }
}

export default useMonetaryMarketOperationsList
