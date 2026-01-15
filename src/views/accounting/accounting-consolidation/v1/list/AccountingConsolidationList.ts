import { IFieldFilters } from '@/interfaces/customs'
import { IAccountingConsolidation } from '@/interfaces/customs'
import { useAccountingConsolidationStore } from '@/stores/'
import { defaultIconsLucide, formatParamsCustom, transformDate } from '@/utils'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { ref } from 'vue'
import { useRouteValidator } from '@/composables'

export const useAccountingConsolidationList = () => {
  const { validateRouter } = useRouteValidator()
  const { _getAccountingConsolidationList } =
    useAccountingConsolidationStore('v1')
  const { data_accounting_consolidation_list, accounting_consolidation_pages } =
    storeToRefs(useAccountingConsolidationStore('v1'))
  const filtersFormat = ref<Record<string, string | number>>({})
  const headerProps = {
    title: 'Consolidación de contabilidades',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Consolidación de contabilidades',
        route: 'AccountingConsolidationList',
      },
    ],
  }
  const consolidationOptions = [
    {
      label: 'Diaria',
      value: 1,
    },
    {
      label: 'Mensual',
      value: '0',
    },
    {
      label: 'Todos',
      value: 2,
    },
  ]

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'consolidation_daily',
      label: 'Consolidación',
      type: 'q-select',
      value: null,
      options: consolidationOptions,
      autocomplete: true,
      class: 'col-12 col-md-3',
      clean_value: true,
      placeholder: 'Seleccione',
      disable: false,
    },
    {
      name: 'period',
      label: 'Periodo',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      clean_value: true,
      placeholder: 'AAAA-MM',
      mask: 'YYYY-MM',
      disable: false,
    },
    {
      name: 'last_consolidation',
      label: 'Última consolidación',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      disable: false,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
      disable: false,

      prepend_icon: defaultIconsLucide.magnify,
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IAccountingConsolidation[]
    pages: typeof accounting_consolidation_pages
    rowsPerPage: number
  }>({
    title: 'Consolidaciones',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        field: (row) => row.id,
        align: 'left',
        sortable: true,
      },
      {
        name: 'bussiness',
        label: 'Negocio',
        field: (row) => row.business,
        align: 'left',
        sortable: true,
      },
      {
        name: 'last_consolidation',
        label: 'Última consolidación',
        field: (row) => row.last_consolidation ?? 'No registrada',
        align: 'left',
        sortable: true,
      },

      {
        name: 'consolidation',
        label: 'Consolidación',
        field: (row) => row.consolidation_type,
        align: 'left',
        sortable: true,
      },
      {
        name: 'current_period',
        label: 'Periodo',
        field: (row) => transformDate(row.period, true),
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [],
    pages: accounting_consolidation_pages,
    rowsPerPage: 10,
  })

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: 20,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    rowsPerPage = rowsPerPage || 20
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getAccountingConsolidationList(filters)
    tableProps.value.loading = false
  }
  const handleFilter = ($filter: {
    'filter[consolidation_daily]': number
    'filter[period]': string
    'filter[last_consolidation]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filter,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = async () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }

  watch(
    () => data_accounting_consolidation_list.value,
    () => {
      tableProps.value.rows = Array.isArray(
        data_accounting_consolidation_list.value
      )
        ? data_accounting_consolidation_list.value
        : []

      tableProps.value.pages = accounting_consolidation_pages.value
    }
  )
  return {
    headerProps,
    filterConfig,
    tableProps,
    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    validateRouter,
  }
}
