// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { ICurrencyListItem } from '@/interfaces/customs/investment-portfolio/Currency'

// Composables - constants
import {
  useUtils,
  useRouteValidator,
  useGoToUrl,
  useRules,
} from '@/composables'

// Stores
import { useCurrencyStore } from '@/stores/investment-portfolio/currency'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

const useCurrencyList = () => {
  const { _getListAction, _clearData } = useCurrencyStore('v1')
  const { headerPropsDefault, currency_list, currency_pages } = storeToRefs(
    useCurrencyStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { type_of_coins } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { defaultIconsLucide, formatUnitsString } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const headerProperties = headerPropsDefault.value

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'type_of_currency',
      type: 'q-select',
      class: 'col-12 col-md-6',
      label: 'Tipo de moneda',
      placeholder: 'Seleccione',
      value: null,
      options: type_of_coins,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'search',
      type: 'q-input',
      class: 'col-12 col-md-6',
      label: 'Buscador',
      placeholder: 'Buscar por código o coincidencia',
      prepend_icon: defaultIconsLucide.magnify,
      value: null,
      clean_value: true,
      disable: false,
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
  ])

  const filtersFormat = ref<
    {
      page: number
      per_page: number
    } & Record<string, string | number>
  >({
    page: 1,
    per_page: 20,
  })

  const tableProperties = ref<IBaseTableProps<ICurrencyListItem>>({
    title: 'Listado de monedas',
    loading: false,
    wrapCells: true,
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
        name: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'type_of_coins',
        required: false,
        label: 'Tipo de moneda',
        align: 'left',
        field: 'type_of_currency',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        style:
          'max-width: 140px; min-width: 100px; word-wrap: break-word; white-space: break-spaces;',
        sortable: true,
      },
      {
        name: 'value',
        required: false,
        label: 'Valor',
        align: 'left',
        field: (row) => formatUnitsString(row.value),
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getListAction(filters)
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[type_of_currency]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      per_page: filtersFormat.value.per_page,
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.per_page = rows

    await listAction(filtersFormat.value)
  }

  const keys = {
    investment_portfolio: ['type_of_coins'],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    currency_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = currency_pages.value
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
    validateRouter,
    goToURL,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
  }
}

export default useCurrencyList
