// Vue - Pinia - Router - Quasar
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IPeriodClosureItem,
  FilterFields,
} from '@/interfaces/customs/accounting/PeriodClosure'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import {
  useGoToUrl,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// Stores
import { useFiltersStore } from '@/stores/filters-component'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { usePeriodClosureStore } from '@/stores/accounting/period-closure'

const usePeriodClosureList = () => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { goToURL } = useGoToUrl()

  const { validateRouter } = useRouteValidator()
  const { setFiltersState } = useFiltersStore()

  const { _getPeriodClosureList, _cleanPeriodClosureData } =
    usePeriodClosureStore('v2')
  const { period_closure_list, period_closure_pages } = storeToRefs(
    usePeriodClosureStore('v2')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const key_v2 = [
    'business_trusts_per_clousure_period',
    'account_structures_accounting_accounts',
  ]

  const {
    account_structures_accounting_accounts,
    business_trusts_per_clousure_period,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { is_required } = useRules()

  const headerProps = {
    title: 'Generar cierre de período',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Cierre de período', route: 'PeriodClosureCreate' },
    ],
  }

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'executed_at',
      label: 'Fecha de ejecución*',
      type: 'q-date',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      placeholder: 'AAAA-MM-DD',
      rules: [(val) => is_required(val)],
    },
    {
      name: 'period',
      label: 'Período de cierre*',
      type: 'q-date',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      rules: [(val) => is_required(val)],
    },
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable*',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      options: account_structures_accounting_accounts,
      placeholder: 'Seleccione',
      rules: [(val) => is_required(val)],
      autocomplete: true,
    },
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      options: business_trusts_per_clousure_period,
      placeholder: 'Seleccione',
      rules: [(val) => is_required(val)],
      autocomplete: true,
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & FilterFields
  >({
    page: 1,
    rows: 20,
  })

  const tableProps = ref<IBaseTableProps<IPeriodClosureItem>>({
    title: 'Listado de comprobantes',
    loading: false,
    wrapCells: true,
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
        name: 'execution_period',
        required: true,
        label: 'Fecha de ejecución',
        align: 'left',
        field: (row) => row.executed_at || '—',
        sortable: true,
      },
      {
        name: 'accounting_structure',
        required: true,
        label: 'Estructura contable',
        align: 'left',
        field: 'accounting_structure',
        sortable: true,
      },
      {
        name: 'business_trust',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business_trust?.description || '—',
        sortable: true,
      },
      {
        name: 'current_period',
        required: true,
        label: 'Período actual',
        align: 'center',
        field: (row) => row.period_closure ?? '—',
        sortable: true,
      },
      {
        name: 'current_period_to',
        required: true,
        label: 'Período cierre',
        align: 'center',
        field: (row) => row.business_trust?.current_period ?? '—',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const showState = ref(0)
  const isPeriodClosureEmpty = ref(true)

  const listAction = async (filters: typeof filtersFormat.value) => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const queryString = formatParamsCustom(filters)
    await _getPeriodClosureList(queryString ? '&' + queryString : '')

    const hasResults = period_closure_list.value.length > 0
    showState.value = queryString ? 1 : 0
    isPeriodClosureEmpty.value = !hasResults

    tableProps.value.loading = false
  }

  const handleClear = () => {
    filtersFormat.value = {
      page: 1,
      rows: filtersFormat.value.rows,
    } as typeof filtersFormat.value

    tableProps.value.rows = []
    isPeriodClosureEmpty.value = true
    showState.value = 0
  }

  const handleFilter = async ($filters: FilterFields) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await listAction(filtersFormat.value)
  }

  const keys = {
    accounting: key_v2,
  }

  onMounted(async () => {
    _cleanPeriodClosureData()

    setFiltersState(filterConfig.value)

    await _getResources(keys, '', 'v2')

    tableProps.value.rows = [...period_closure_list.value]

    const { currentPage, lastPage } = period_closure_pages.value
    tableProps.value.pages = {
      currentPage,
      lastPage,
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    period_closure_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = period_closure_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterComponentRef,
    filterConfig,
    showState,
    isPeriodClosureEmpty,
    validateRouter,
    handleClear,
    handleFilter,
    updatePage,
    updatePerPage,
    defaultIconsLucide,
    goToURL,
  }
}

export default usePeriodClosureList
