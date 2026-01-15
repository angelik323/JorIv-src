// Vue - pinia - moment
import { ref, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import {
  IFieldFilters,
  IPaginatedFiltersFormat,
  ResourceTypes,
} from '@/interfaces/customs'
import { IBudgetClosureProcessListItem } from '@/interfaces/customs/budget/BudgetClosure'

// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useRouteValidator } from '@/composables/useRoutesValidator'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/composables'

// Stores
import {
  useResourceManagerStore,
  useAccountingResourceStore,
} from '@/stores/resources-manager'

import { useBudgetClosureStore } from '@/stores/budget/budget-closure'

// Constants
import {
  BUDGET_CLOSURE_CREATE_PROCESS_TYPE_FILTER_OPTIONS,
  BUDGET_CLOSURE_CREATE_CLOSURE_TYPE_FILTER_OPTIONS,
  BUDGET_CLOSURE_STATUSES,
} from '@/constants/resources/budget'

const useBudgetClosureList = () => {
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { isStartDateBeforeEndDate, defaultIconsLucide, formatDate } =
    useUtils()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { business_trusts_selector } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { _getProcessList } = useBudgetClosureStore('v1')

  // Refs & Computed props

  const headerConfig = computed(() => ({
    title: 'Cierre de presupuestos',
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
    ],
    btnLabel: validateRouter('Budget', 'BudgetClosureList', 'action_generate')
      ? 'Crear'
      : undefined,
  }))

  const filtersRef = ref<InstanceType<typeof FiltersComponentV2> | null>(null)

  const filtersFormat = ref<IPaginatedFiltersFormat>({
    page: 1,
    rows: 20,
  })

  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'closure_type',
      label: 'Tipo de cierre*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: BUDGET_CLOSURE_CREATE_CLOSURE_TYPE_FILTER_OPTIONS,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      hide: false,
    },
    {
      name: 'business_from',
      label: 'Negocio desde*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_selector,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      hide: false,
    },
    {
      name: 'business_to',
      label: 'Negocio hasta*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trusts_selector,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      hide: false,
    },
    {
      name: 'action_type',
      label: 'Tipo de proceso*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: BUDGET_CLOSURE_CREATE_PROCESS_TYPE_FILTER_OPTIONS,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      hide: false,
    },
    {
      name: 'date_from',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      placeholder: 'YYYY-MM-DD',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      hide: false,
    },
    {
      name: 'date_to',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      placeholder: 'YYYY-MM-DD',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      hide: false,
    },
    {
      name: 'closure_status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: BUDGET_CLOSURE_STATUSES,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
      hide: false,
    },
  ])

  const hiddableFields = ['closure_status', 'date_from', 'date_to']

  const tableProps = ref<IBaseTableProps<IBudgetClosureProcessListItem>>({
    title: 'Listado de procesos',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'process',
        field: 'id',
        label: 'Número de proceso',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'process_date',
        field: (row) => formatDate(row.created_at, 'YYYY-MM-DD'),
        label: 'Fecha de proceso',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'process_hour',
        field: (row) => formatDate(row.hour_created_at, 'hh:mm a', 'hh:mm'),
        label: 'Hora de proceso',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'closure_type',
        field: 'closure_type',
        label: 'Tipo de cierre',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'process_user',
        field: 'user_name',
        label: 'Usuario de proceso',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'action_type',
        field: 'action_type',
        label: 'Tipo de proceso',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'status',
        field: 'id',
        label: 'Estado',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'actions',
        field: 'id',
        label: 'Acciones',
        required: false,
        sortable: false,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableCustomCols = ['status', 'actions']

  // Functions/Methods

  const isValidDateFilters = (dateFrom?: string, dateTo?: string): boolean => {
    if (!dateFrom || !dateTo) return true
    return isStartDateBeforeEndDate(dateFrom, dateTo)
  }

  const listAction = async (filters: IPaginatedFiltersFormat) => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const res = await _getProcessList(filters)
    tableProps.value.rows = res.list
    tableProps.value.pages = res.pages

    tableProps.value.loading = false
  }

  const handleFilterSearch = async (filters: IPaginatedFiltersFormat) => {
    if (
      !isValidDateFilters(
        filters['filter[date_from]'] as string,
        filters['filter[date_to]'] as string
      )
    )
      return

    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
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

  const handleShowMoreFilters = (show: boolean) => {
    filtersConfig.value.forEach((field) => {
      if (hiddableFields.includes(field.name)) field.hide = !show

      if (hiddableFields.includes(field.name) && !show)
        filtersRef.value?.cleanFiltersByNames([field.name])
    })
  }

  const isEnabledViewAction = (): boolean => {
    if (!validateRouter('Budget', 'BudgetClosureList', 'show')) return false
    return true
  }

  // Life cycle hooks
  const keys: ResourceTypes = {
    accounting: ['business_trusts_selector'],
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys, 'filter[can]=true&filter[has_budget]=true', 'v2')
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    // Imported composable variables
    defaultIconsLucide,

    // Refs & Computed props
    headerConfig,
    filtersRef,
    filtersConfig,
    tableProps,
    tableCustomCols,

    // Imported composable functions
    goToURL,

    // Functions/Methods
    handleFilterSearch,
    handleClearFilters,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handleShowMoreFilters,
    isEnabledViewAction,
  }
}

export default useBudgetClosureList
