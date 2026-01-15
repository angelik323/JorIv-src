import { useRouteValidator } from '@/composables'
import {
  useIssuersCounterpartiesStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const useIssuersCounterpartiesList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  const { issuers_counterparty } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { headerPropsDefault, pages, data_issuers_counterparties_list } =
    storeToRefs(useIssuersCounterpartiesStore('v1'))
  const { _getListIssuersCounterparties } = useIssuersCounterpartiesStore('v1')

  const headerProperties = headerPropsDefault.value

  const filters = [
    {
      name: 'emitter_type',
      label: 'Tipo emisor',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      options: issuers_counterparty,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
  ]
  const filterConfig = ref(filters)
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref({
    title: 'Listado de emisores y contrapartes',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'document_third',
        required: true,
        label: 'Identificación',
        align: 'left',
        field: 'document_third',
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'emitter_type',
        required: true,
        label: 'Tipo emisor',
        align: 'left',
        field: 'emitter_type',
        sortable: true,
      },
      {
        name: 'rating_agency',
        required: true,
        label: 'Calificadora',
        align: 'left',
        field: 'rating_agency',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: data_issuers_counterparties_list.value,
    pages: pages,
    wrapCells: true,
  })

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    await _getListIssuersCounterparties(queryString ? '&' + queryString : '')
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = ($filters: {
    'filter[issuer_type]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    listAction()
  }

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  const updatePage = (pageNumber: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: pageNumber as number,
    }
    listAction()
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage as number,
    }
    listAction()
  }

  watch(
    () => data_issuers_counterparties_list.value,
    () => {
      tableProperties.value.rows = data_issuers_counterparties_list.value
    }
  )

  const keys = {
    investment_portfolio: ['issuers_counterparty'],
  }

  onMounted(async () => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    tableProperties,
    headerProperties,
    filterConfig,
    handlerGoTo,
    handleFilterSearch,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    validateRouter,
  }
}

export default useIssuersCounterpartiesList
