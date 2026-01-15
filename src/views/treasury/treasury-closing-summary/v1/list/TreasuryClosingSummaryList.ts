import { useUtils } from '@/composables'
import { IFieldFilters, ITreasuryClosingSummary } from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useTreasuryClosingStore,
  useTreasuryClosingSummaryStore,
  useTreasuryResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useTreasuryClosingSummaryList = () => {
  const router = useRouter()
  const { formatCurrencyString } = useUtils()

  const { treasury_closing_execution_id } = storeToRefs(
    useTreasuryClosingStore('v1')
  )

  const { treasury_closing_summary_list, treasury_closing_summary_pages } =
    storeToRefs(useTreasuryClosingSummaryStore('v1'))

  const {
    _getTreasuryClosingSummaryList,
    _downloadExcelTreasuryClosingSummaryList,
  } = useTreasuryClosingSummaryStore('v1')

  const showState = ref(0)
  const isTreasuryClosingSummaryEmpty = ref(true)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { treasury_closing_status, treasury_closing_types } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const perPage = ref(20)

  const keys = ['treasury_closing_status', 'treasury_closing_types']

  const headerProps = {
    title: 'Resumen de cierre de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería', route: '' },
      {
        label: 'Cierre de tesoreria',
        route: 'treasuryClosingList',
      },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ITreasuryClosingSummary[]
    pages: typeof treasury_closing_summary_pages
  }>({
    title: 'Listado de cierres',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_code',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado cierre',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'type',
        required: false,
        label: 'Tipo cierre',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'initial_balance',
        required: false,
        label: 'Saldo inicial',
        align: 'left',
        field: 'initial_balance',
        sortable: true,
        format: (_, item) => formatCurrencyString(item.initial_balance),
      },
      {
        name: 'income_local',
        required: false,
        label: 'Abonos',
        align: 'left',
        field: 'income_local',
        format: (_, item) => formatCurrencyString(item.income_local),
        sortable: true,
      },
      {
        name: 'expense_local',
        required: false,
        label: 'Cargos',
        align: 'left',
        field: 'expense_local',
        format: (_, item) => formatCurrencyString(item.expense_local),
        sortable: true,
      },
      {
        name: 'final_balance_local',
        required: false,
        label: 'Saldo final',
        align: 'left',
        field: 'final_balance_local',
        format: (_, item) => formatCurrencyString(item.final_balance_local),
        sortable: true,
      },
      {
        name: 'performance_value',
        required: false,
        label: 'Rendimientos calculados',
        align: 'left',
        field: 'performance_value',
        format: (_, item) => formatCurrencyString(item.performance_value),
        sortable: true,
      },
      {
        name: 'reexpression_difference',
        required: false,
        label: 'Diferencia cambio',
        align: 'left',
        field: 'reexpression_difference',
        format: (_, item) => formatCurrencyString(item.reexpression_difference),
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: treasury_closing_summary_pages,
  })

  // filter
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'closure_status',
      label: 'Estados de cierre',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: treasury_closing_status,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) => val !== null || 'El estado de cierre es requerido',
      ],
    },
    {
      name: 'closure_type',
      label: 'Tipo de cierre',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: treasury_closing_types,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => !!val || 'El tipo de cierre es requerido'],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = async ($filters: {
    'filter[closure_status]': string
    'filter[closure_type]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    tableProps.value.loading = true

    await _listAction(filtersFormat.value)

    const hasResults = treasury_closing_summary_list.value.length > 0

    showState.value = filtersFormat.value ? 1 : 0
    isTreasuryClosingSummaryEmpty.value = !hasResults
    tableProps.value.loading = false
  }

  const _listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getTreasuryClosingSummaryList({
      ...filters,
      'filter[closing_id]': treasury_closing_execution_id.value,
    })
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage.value,
    }
    await _listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage.value,
    }
    await _listAction(filtersFormat.value)
  }

  const handleGoBack = () => {
    router.push({ name: 'TreasuryClosingList' })
  }

  const handleGoErrorList = () => {
    router.push({ name: 'TreasuryClosingErrorsSummaryList' })
  }

  const downloadAction = () => {
    if (!treasury_closing_execution_id.value) {
      return
    }
    _downloadExcelTreasuryClosingSummaryList({
      ...filtersFormat.value,
      'filter[closing_id]': treasury_closing_execution_id.value,
    })
  }

  watch(
    () => treasury_closing_summary_list.value,
    () => {
      tableProps.value.rows = treasury_closing_summary_list.value
    }
  )

  onMounted(async () => {
    if (!treasury_closing_execution_id.value) {
      router.push({ name: 'TreasuryClosingList' })
      return
    }
    _getResources({ treasury: keys }, '', 'v2')
  })

  onBeforeUnmount(() => _resetKeys({ treasury: keys }))

  return {
    headerProps,
    handleGoBack,
    filterConfig,
    handleFilter,
    tableProps,
    updatePage,
    updateRowsPerPage,
    showState,
    isTreasuryClosingSummaryEmpty,
    handleGoErrorList,
    downloadAction,
  }
}

export default useTreasuryClosingSummaryList
