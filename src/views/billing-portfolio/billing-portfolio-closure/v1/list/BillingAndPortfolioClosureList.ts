// Composables
import {
  useCalendarRules,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Utils & moment
import moment from 'moment'

// Stores
import { useBillingPortfolioClosureStore } from '@/stores/billing-portfolio/billing-portfolio-closure'
import { useBillingCollectStore, useResourceManagerStore } from '@/stores'

// quasar & vue & pinia
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { IBillingAndPortfolioClousureList } from '@/interfaces/customs'

const useBillingAndPortfolioClosureList = () => {
  const { billing_portfolio_clouser_list, billing_portfolio_clouser_pages } =
    storeToRefs(useBillingPortfolioClosureStore('v1'))

  const { _getBillingPortfolioClosureList, _getDataExcel } =
    useBillingPortfolioClosureStore('v1')

  const { status_closure } = storeToRefs(useBillingCollectStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()

  const isBillingAndPortfolioClosureEmpty = ref(true)
  const showState = ref(0)

  const key = { billing_collect: ['status_closure'] }

  const headerProps = {
    title: 'Cierre de facturación y cartera',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Cierre de facturación y cartera',
        route: 'BillingAndPortfolioClosureList',
      },
    ],
  }

  const filterConfig = ref([
    {
      name: 'period',
      label: 'Periodo de cierre',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      required: false,
      mask: 'YYYY-MM',
      format: 'YYYY-MM',
      placeholder: 'AAAA-MM',
      rules: [],
      option_calendar: useCalendarRules().only_until(
        moment().format('YYYY-MM-DD')
      ),
    },
    {
      name: 'closing_date',
      label: 'Fecha de cierre',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      required: false,
      placeholder: 'AAAA-MM-DD',
      rules: [],
      option_calendar: useCalendarRules().only_until(
        moment().format('YYYY-MM-DD')
      ),
    },
    {
      name: 'status_id',
      label: 'Estado de cierre',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      options: status_closure,
      clean_value: true,
      placeholder: 'Todos',
      rules: [],
    },
  ])

  const tableProps = ref({
    title: 'Listado de cierre de facturación y cartera',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'period',
        field: (row) => useUtils().formatDate(row.period, 'YYYY-MM'),
        required: true,
        label: 'Período de cierre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'invoice_number',
        field: (row) => useUtils().formatDate(row.closing_date, 'YYYY-MM-DD'),
        required: true,
        label: 'Fecha de cierre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: (row) => row.status.id,
        required: true,
        label: 'Estado del cierre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        sortable: false,
        required: true,
        style: 'width: 100px',
        classes: 'col-actions',
      },
    ] as QTable['columns'],
    rows: [] as IBillingAndPortfolioClousureList[],
    pages: billing_portfolio_clouser_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[invoice_number]': string
    'filter[invoice_total]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = useUtils().formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBillingPortfolioClosureList(filters)

    const hasResults = billing_portfolio_clouser_list.value.length > 0
    showState.value = 1

    tableProps.value.loading = false
    isBillingAndPortfolioClosureEmpty.value = !hasResults
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    isBillingAndPortfolioClosureEmpty.value = true
    showState.value = 0
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = useUtils().formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage,
    }
    const queryString = useUtils().formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const exportExcel = async (id: number) => {
    if (!id) return

    openMainLoader(true)
    await _getDataExcel(id)
    openMainLoader(false)
  }

  watch(
    () => billing_portfolio_clouser_list.value,
    () => {
      tableProps.value.rows = billing_portfolio_clouser_list.value
      tableProps.value.pages = billing_portfolio_clouser_pages.value
    },
    { immediate: true, deep: true }
  )

  onMounted(async () => {
    _getResources(key)
  })

  onBeforeMount(async () => {
    _resetKeys(key)
  })

  return {
    headerProps,
    filterConfig,
    tableProps,
    isBillingAndPortfolioClosureEmpty,
    showState,
    handleClearFilters,
    handleFilter,
    updatePage,
    updateRowsPerPage,
    validateRouter,
    useUtils,
    exportExcel,
  }
}

export default useBillingAndPortfolioClosureList
