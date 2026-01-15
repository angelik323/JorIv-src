import { onMounted, onBeforeMount, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { formatParamsCustom } from '@/utils'
import {
  IPeriodClosureItem,
  IFieldFilters,
  FilterFields,
} from '@/interfaces/customs'
import {
  useFiltersStore,
  usePeriodClosureStore,
  useResourceManagerStore,
  useAccountingResourceStore,
} from '@/stores'
import { useRouteValidator, useRules } from '@/composables'

const usePeriodClosureList = () => {
  const { validateRouter } = useRouteValidator()
  const { setFiltersState } = useFiltersStore()
  const { _getPeriodClosureList, _cleanPeriodClosureData } =
    usePeriodClosureStore('v1')
  const { period_closure_list, period_closure_pages } = storeToRefs(
    usePeriodClosureStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const key_v1 = ['account_structures_with_purpose']
  const key_v2 = ['business_trusts_per_clousure_period']

  const {
    account_structures_with_purpose,
    business_trusts_per_clousure_period,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const router = useRouter()

  let perPage = 20

  const tableProps = ref({
    title: 'Listado de comprobantes',
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
        name: 'execution_period',
        required: true,
        label: 'Periodo de ejecución',
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
        name: 'from_business',
        required: true,
        label: 'Desde negocio',
        align: 'left',
        field: (row) => row.from_business_trust?.description || '—',
        sortable: true,
      },
      {
        name: 'current_period_from',
        required: true,
        label: 'Periodo actual',
        align: 'center',
        field: (row) => row.from_business_trust?.current_period ?? '—',
        sortable: true,
      },
      {
        name: 'to_business',
        required: true,
        label: 'Hasta negocio',
        align: 'left',
        field: (row) => row.to_business_trust?.description || '—',
        sortable: true,
      },
      {
        name: 'current_period_to',
        required: true,
        label: 'Periodo actual',
        align: 'center',
        field: (row) => row.to_business_trust?.current_period ?? '—',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IPeriodClosureItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Generar cierre de periodo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Cierre de periodo', route: '' },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'executed_at',
      label: 'Periodo de ejecución*',
      type: 'q-date',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      placeholder: 'AAAA/MM/DD',
      rules: [(val) => useRules().is_required(val)],
    },
    {
      name: 'accounting_structure_id',
      label: 'Estructura contable*',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      options: account_structures_with_purpose,
      placeholder: 'Seleccione',
      rules: [(val) => useRules().is_required(val)],
      autocomplete: true,
    },
    {
      name: 'from_business_trust_id',
      label: 'Desde negocio*',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      options: business_trusts_per_clousure_period,
      placeholder: 'Seleccione',
      rules: [(val) => useRules().is_required(val)],
      autocomplete: true,
    },
    {
      name: 'to_business_trust_id',
      label: 'Hasta negocio*',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-3',
      disable: false,
      options: business_trusts_per_clousure_period,
      placeholder: 'Seleccione',
      rules: [(val) => useRules().is_required(val)],
      autocomplete: true,
    },
  ])

  const showState = ref(0)
  const isPeriodClosureEmpty = ref(true)

  const filtersFormat = ref<FilterFields>({})

  const handleFilter = ($filters: FilterFields) => {
    filtersFormat.value = { ...$filters }

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getPeriodClosureList(filters)

    const hasResults = period_closure_list.value.length > 0

    showState.value = filters ? 1 : 0
    isPeriodClosureEmpty.value = !hasResults

    tableProps.value.loading = false
  }

  const handleGoTo = () => {
    router.push({ name: 'PeriodClosureCreate' })
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    isPeriodClosureEmpty.value = true
    showState.value = 0
  }

  onMounted(async () => {
    _cleanPeriodClosureData()
    setFiltersState(filterConfig.value)

    await _getResources({ accounting: key_v1 }, undefined, 'v1')
    await _getResources({ accounting: key_v2 }, '', 'v2')

    tableProps.value.rows = period_closure_list.value
  })

  onBeforeMount(async () => {
    await _resetKeys({ accounting: [...key_v1, ...key_v2] })
  })

  watch(
    () => period_closure_list.value,
    () => {
      tableProps.value.rows = period_closure_list.value
    }
  )

  watch(
    () => period_closure_pages.value,
    () => {
      tableProps.value.pages = period_closure_pages.value
    }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    showState,
    isPeriodClosureEmpty,
    handleClear,
    handleFilter,
    handleGoTo,
    updatePage,
    updatePerPage,
    validateRouter,
  }
}

export default usePeriodClosureList
