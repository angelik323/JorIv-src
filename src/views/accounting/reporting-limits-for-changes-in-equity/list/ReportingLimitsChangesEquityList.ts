import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { formatParamsCustom } from '@/utils'
import { IFieldFilters, IEquityChangeReportLimit } from '@/interfaces/customs'
import {
  useAccountingResourceStore,
  useFiltersStore,
  useResourceManagerStore,
  useReportingLimitsForChangesInEquityStore,
} from '@/stores'
import { useRouteValidator } from '@/composables'

const useReportingLimitsForChangesInEquityList = () => {
  const { setFiltersState } = useFiltersStore()
  const { patrimony_limit_type, account_structures_with_purpose } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getListReportingLimits } =
    useReportingLimitsForChangesInEquityStore('v1')
  const { limits_list, limits_pages } = storeToRefs(
    useReportingLimitsForChangesInEquityStore('v1')
  )

  const resourceKeys = {
    accounting: ['account_structures_with_purpose', 'patrimony_limit_type'],
  }

  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  const headerProps = {
    title: 'Límites de reporte cambios en el patrimonio',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      { label: 'Límites de reporte cambios en el patrimonio', route: '' },
    ],
  }

  const tableProps = ref({
    title: 'Listado límites de reporte cambios en el patrimonio',
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        align: 'left',
        field: (row) => row.rowIndex,
        sortable: false,
      },
      {
        name: 'accounting_structure',
        label: 'Estructura contable',
        align: 'left',
        field: (row) => row.account_structure || 'N/A',
        sortable: true,
      },
      {
        name: 'business',
        label: 'Negocio',
        align: 'left',
        field: (row) => row.business_trust || 'N/A',
        sortable: true,
      },
      {
        name: 'limit',
        label: 'Límite',
        align: 'left',
        field: (row) => row.limit_type || 'N/A',
        sortable: false,
      },
      {
        name: 'from_account',
        label: 'Desde cuenta',
        align: 'left',
        field: (row) => row.from_account || 'N/A',
        sortable: false,
      },
      {
        name: 'to_account',
        label: 'Hasta cuenta',
        align: 'left',
        field: (row) => row.to_account || 'N/A',
        sortable: false,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: (row) => row,
      },
    ] as QTable['columns'],
    rows: [] as IEquityChangeReportLimit[],
    pages: { currentPage: ref(1), lastPage: ref(1) },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'limit_type',
      label: 'Límite',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-4',
      disable: false,
      options: patrimony_limit_type,
      placeholder: 'Seleccione',
    },
    {
      name: 'account_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-4',
      disable: false,
      options: account_structures_with_purpose,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código y/o nombre del negocio',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[account_structure_id]': string
    'filter[search]': string
    'filter[limit_type]': string
  }) => {
    filtersFormat.value = { ...$filters }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getListReportingLimits(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = () => {
    router.push({ name: 'ReportingLimitsChangesEquityCreate' })
  }

  const handleClear = () => {
    filtersFormat.value = { paginate: 1 }
    tableProps.value.rows = []
  }

  const handleOptions = (option: string, row: IEquityChangeReportLimit) => {
    if (option === 'edit') {
      router.push({
        name: 'ReportingLimitsChangesEquityEdit',
        params: { id: row.id },
        query: {
          business: row.business_trust,
          account_structure: row.account_structure,
          business_trust_id: row.business_trust_id,
          limit_type: row.limit_type,
        },
      })
    }
  }

  watch(
    () => limits_list.value,
    (newList) => {
      const currentPage = Number(filtersFormat.value.page) || 1
      const rowsPerPage = Number(filtersFormat.value.rows) || 20
      const totalItems = Number(limits_pages.value?.total) || 0
      const startIndex = (currentPage - 1) * rowsPerPage

      tableProps.value.rows = (newList || []).map((row, i) => ({
        ...row,
        rowIndex: totalItems - startIndex - i,
      }))
    },
    { immediate: true }
  )

  watch(
    () => limits_pages.value,
    (newPages) => {
      tableProps.value.pages = newPages || { currentPage: 1, lastPage: 1 }
    },
    { immediate: true }
  )

  onMounted(async () => {
    _getResources({ accounting: ['account_structures_with_purpose'] })
    _getResources({ accounting: ['patrimony_limit_type'] }, '', 'v2')
    setFiltersState(filterConfig.value)
  })

  onBeforeMount(async () => {
    await _resetKeys(resourceKeys)
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    handleClear,
    handleFilter,
    handleGoTo,
    updatePage,
    updateRows,
    handleOptions,
    validateRouter,
  }
}

export default useReportingLimitsForChangesInEquityList
