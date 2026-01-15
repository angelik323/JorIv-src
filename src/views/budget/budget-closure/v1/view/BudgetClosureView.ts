// Vue - pinia - moment
import { computed, ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import { IFieldFilters, IPaginatedFiltersFormat } from '@/interfaces/customs'
import {
  IBudgetClosureProcessedBusinessListItem,
  IBudgetClosureProcessInfo,
} from '@/interfaces/customs/budget/BudgetClosure'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useMainLoader } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetClosureStore } from '@/stores/budget/budget-closure'

// Constants
import { BUDGET_CLOSURE_STATUSES } from '@/constants/resources/budget'

const useBudgetClosureView = () => {
  const { params } = useRoute()

  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { budget_closures } = useBudgetResourceStore('v1')

  const {
    _getProcessedBusinessList,
    _getProcessDetailsById,
    _downloadErrorReport,
  } = useBudgetClosureStore('v1')

  // Refs & Computed props
  const processId = Number(params.id)

  const headerConfig = computed(() => {
    const title =
      params.actionType === 'crear'
        ? 'Ver cierre de presupuesto'
        : 'Ver cierre deshecho'

    return {
      title,
      breadcrumbs: [
        {
          label: 'Inicio',
          route: 'HomeView',
        },
        {
          label: 'Presupuesto',
          route: '',
        },
        {
          label: 'Cierre de presupuestos',
          route: 'BudgetClosureList',
        },
        {
          label: 'Ver',
          route: '',
        },
        {
          label: params.id as string,
          route: '',
        },
      ],
    }
  })

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = computed<number>(() =>
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const processInfo = ref<IBudgetClosureProcessInfo | null>(null)

  const filtersFormat = ref<IPaginatedFiltersFormat>({ page: 1, rows: 20 })

  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'business',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: budget_closures,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      hide: false,
    },
    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: BUDGET_CLOSURE_STATUSES,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      hide: false,
    },
  ])

  const tableProps = ref<
    IBaseTableProps<IBudgetClosureProcessedBusinessListItem>
  >({
    title: 'Listado de negocios procesados',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business',
        field: (row) => row.business.business,
        label: 'Código/Negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'last_closing_date',
        field: (row) => row.closure_date,
        label: 'Fecha de último cierre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'id',
        label: 'Estado',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableCustomCols = ['status']

  const selectedProcessedBusiness =
    ref<IBudgetClosureProcessedBusinessListItem | null>(null)

  // Functions/Methods
  const handleGoToList = () =>
    goToURL('BudgetClosureList', undefined, { reload: true })

  const isEnabledExportAction = () =>
    validateRouter('Budget', 'BudgetClosureList', 'action_export_errors')

  const handleSelectedBusinesses = (
    selectedRows: IBudgetClosureProcessedBusinessListItem[]
  ) => {
    const [selectedBusiness] = selectedRows

    if (!selectedBusiness) {
      selectedProcessedBusiness.value = null
      return
    }

    selectedProcessedBusiness.value = selectedBusiness
  }

  const loadProcessInfo = async () => {
    const processId = Number(params.id)
    processInfo.value = await _getProcessDetailsById(processId)
  }

  const listAction = async (filters: IPaginatedFiltersFormat) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const res = await _getProcessedBusinessList({
      ...filters,
      'filter[process_id]': params.id as string,
    })
    tableProps.value.rows = res.list
    tableProps.value.pages = res.pages
    tableProps.value.loading = false
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
  }

  const handleFilterSearch = async (filters: IPaginatedFiltersFormat) => {
    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await listAction(filtersFormat.value)
  }

  const canDownloadErrorReport = computed<boolean>(() => {
    return (
      tableProps.value.rows.length > 0 &&
      tableProps.value.rows.some((r) => r.closure_status === '30')
    )
  })

  const handleDownloadErrorReport = async () => {
    await _downloadErrorReport(processId)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await Promise.all([
      loadProcessInfo(),
      _getResources({ budget: ['budget_closures'] }),
    ])
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys({ budget: ['budget_closures'] }))

  return {
    // Refs and computed props
    processId,
    headerConfig,
    tabs,
    tabActive,
    tabActiveIdx,
    processInfo,
    tableProps,
    selectedProcessedBusiness,
    tableCustomCols,
    filtersConfig,
    canDownloadErrorReport,

    // Functions/Methods
    handleGoToList,
    isEnabledExportAction,
    handleSelectedBusinesses,
    handleClearFilters,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handleDownloadErrorReport,
  }
}

export default useBudgetClosureView
