import { useRouteValidator } from '@/composables'
import { IFieldFilters, IMarketabilityType } from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useMarketabilityTypesStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export const useTypesMarketabilityList = () => {
  const { validateRouter } = useRouteValidator()
  const { _getMarketabilityTypesList } = useMarketabilityTypesStore('v1')
  const { marketability_types_list, marketability_types_pages } = storeToRefs(
    useMarketabilityTypesStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { types_marketability } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const filtersFormat = ref<Record<string, string | number>>({})
  const keys = ['type_bursatility']
  const headerProps = {
    title: 'Tipos de bursatilidad',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversión', route: '' },
      { label: 'Tipos de bursatilidad', route: 'TypesMarketabilityList' },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'type',
      label: 'Tipo',
      type: 'q-select',
      value: 'Todos',
      class: 'col-12 col-md-6',
      autocomplete: true,
      options: types_marketability,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-6',
      prepend_icon: defaultIconsLucide.magnify,
      autocomplete: true,
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IMarketabilityType[]
    pages: typeof marketability_types_pages.value
    rowsPerPage: number
  }>({
    title: 'Listado de tipos de bursatilidad',
    loading: false,
    columns: [
      { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
      {
        name: 'code',
        label: 'Código',
        field: 'code',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description',
        label: 'Descripción',
        field: 'description',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type',
        label: 'Tipo',
        field: 'type',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
      },
    ],
    rows: [],
    pages: marketability_types_pages.value,
    rowsPerPage: 20,
  })

  const listAction = async (filters: string = '') => {
    if (filters) {
      const params = filters
        .replace(/^&/, '')
        .split('&')
        .map((f) => f.split('='))
        .filter(([_, value]) => value !== 'Todos')

      if (params.length === 0) {
        filters = ''
      } else {
        filters =
          '&' + params.map(([key, value]) => `${key}=${value}`).join('&')
      }
    }
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getMarketabilityTypesList(filters)
    tableProps.value.loading = false
  }
  const handleFilter = ($filter: {
    'filter[type]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filter,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  onMounted(async () => {
    await _getResources({
      investment_portfolio: keys,
    })
  })

  onBeforeUnmount(() => {
    _resetKeys({
      investment_portfolio: keys,
    })
  })

  watch(
    () => marketability_types_list.value,
    () => {
      tableProps.value.rows = marketability_types_list.value
    }
  )

  return {
    headerProps,
    filterConfig,
    tableProps,
    handleFilter,
    handleClear,
    validateRouter,
  }
}
