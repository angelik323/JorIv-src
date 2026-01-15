// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { IMergedTitleListItem } from '@/interfaces/customs/investment-portfolio/TitlesMerging'

// Composables - constants
import { useUtils, useRules } from '@/composables'
import { status } from '@/constants'

// Stores
import {
  useTitlesMergingStore,
  useResourceManagerStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useTitlesMergingList = () => {
  const { _getMergedTitleList, _clearData } = useTitlesMergingStore('v1')
  const { headerPropsDefault, merged_title_list, pages } = storeToRefs(
    useTitlesMergingStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { operation_type } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { defaultIconsLucide } = useUtils()

  const headerProperties = headerPropsDefault.value

  const tableProperties = ref<IBaseTableProps<IMergedTitleListItem>>({
    title: 'Listado de englobes de títulos',
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
        name: 'title_number',
        required: true,
        label: 'Número de Título',
        align: 'left',
        field: (row) => `${row.new_title_number ?? ''}`,
        sortable: true,
      },
      {
        name: 'operation_number',
        required: true,
        label: 'Número de operación',
        align: 'left',
        field: (row) => `${row.operation_number ?? ''}`,
        sortable: true,
      },
      {
        name: 'created_date',
        required: true,
        label: 'Fecha de creación',
        align: 'left',
        field: (row) => `${row.created_date ?? ''}`,
        sortable: true,
      },
      {
        name: 'investment_portfolio_code',
        required: true,
        label: 'Código portafolio',
        align: 'left',
        field: (row) => `${row.investment_portfolio?.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'investment_portfolio_name',
        required: true,
        label: 'Nombre portafolio',
        align: 'left',
        field: (row) => `${row.investment_portfolio?.description ?? ''}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row) => `${row.status?.status ?? ''}`,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id', // No se puede dejar vacío
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'operation_type_id',
      label: 'Tipo de operación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: operation_type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: status,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string) =>
          val ? useRules().date_before_or_equal_to_the_current_date(val) : true,
      ],
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (val: string) =>
          val
            ? useRules().is_after_or_equal_today(
                val,
                'Ingresa una fecha superior o igual a la fecha actual.'
              )
            : true,
      ],
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getMergedTitleList(filters)
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[operation_type_id]': string
    'filter[status_id]': string
    'filter[search]': string
    'filter[start_date]': string
    'filter[end_date]': string
  }) => {
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

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const keys = {
    investment_portfolio: ['operation_type'],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    merged_title_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )
  return {
    defaultIconsLucide,
    headerProperties,
    tableProperties,
    filterComponentRef,
    filterConfig,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
  }
}

export default useTitlesMergingList
