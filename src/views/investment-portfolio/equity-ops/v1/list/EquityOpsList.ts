import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import router from '@/router'

import { useMainLoader, useUtils } from '@/composables'

import { IExchangeTradedFund, IFieldFilters } from '@/interfaces/customs'

import {
  useResourceManagerStore,
  useExchangedTradedFundsStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'

const useEquityOpsList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const { exchange_traded_fund_list, exchange_traded_fund_pages } = storeToRefs(
    useExchangedTradedFundsStore('v1')
  )
  const {
    investment_portfolio_code_local_currency: investment_portfolio,
    operation_exchange_traded_fund_statuses: status,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _listAction } = useExchangedTradedFundsStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const isEquityOpsEmpty = ref(true)
  const showState = ref(0)

  let perPage = 20

  const keys = {
    investment_portfolio: [
      'investment_portfolio_code_local_currency',
      'operation_exchange_traded_fund_statuses',
    ],
  }

  const headerProperties = {
    title: "Operaciones ETF's",
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      {
        label: "Operaciones ETF's",
        route: 'EquityOpsList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'investment_portfolio_id',
      label: 'Código de portafolio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: investment_portfolio,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: status,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'operation_date',
      label: 'Fecha de operación',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const tableProperties = ref({
    title: "Listado de operaciones ETF's",
    loading: false,
    columns: [
      {
        name: 'consecutive',
        align: 'left',
        label: '#',
        field: 'consecutive',
        sortable: true,
      },
      {
        name: 'operation_date',
        align: 'left',
        label: 'Fecha de operación',
        field: 'operation_date',
        sortable: true,
        required: true,
      },
      {
        name: 'operation_type_description',
        align: 'left',
        label: 'Operación',
        field: 'operation_type_description',
        sortable: true,
        required: true,
      },
      {
        name: 'title_number',
        align: 'left',
        label: 'Número de título',
        field: 'title_number',
        sortable: true,
        required: true,
      },
      {
        name: 'operation_number',
        align: 'left',
        label: 'Número de operación',
        field: 'operation_number',
        sortable: true,
        required: true,
      },
      {
        name: 'investment_porfolio_code',
        align: 'left',
        label: 'Código de portafolio',
        field: 'investment_porfolio_code',
        sortable: true,
        required: true,
      },
      {
        name: 'investment_portfolio_description',
        align: 'left',
        label: 'Descripción portafolio',
        field: 'investment_portfolio_description',
        sortable: true,
        required: true,
      },
      {
        name: 'exchange_traded_fund_number',
        align: 'left',
        label: "Número ETF's",
        field: 'exchange_traded_fund_number',
        sortable: true,
        required: true,
      },
      {
        name: 'status_id',
        align: 'left',
        label: 'Estado',
        field: 'status_id',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Acciones',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IExchangeTradedFund[],
    pages: exchange_traded_fund_pages,
  })

  const loadData = async (filters: Record<string, string | number>) => {
    openMainLoader(true)

    await _listAction(filters)

    const hasResults = exchange_traded_fund_list.value.length > 0

    showState.value = filters ? 1 : 0
    isEquityOpsEmpty.value = !hasResults

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleFilter = async ($filters: {
    'filter[investment_portfolio_id]': string
    'filter[operation_date]': string
    'filter[status_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    await loadData(filtersFormat.value)
  }

  const handleEditsType = (id: number, type: string) => {
    if (type === 'compra_moneda_local') handleGoTo('ETFLocalBuyView', id)
    else if (type === 'venta_moneda_local') handleGoTo('ETFLocalSellView', id)
    else if (type === 'compra_moneda_extranjera')
      handleGoTo('ETFForeignBuyView', id)
    else if (type === 'venta_moneda_extranjera')
      handleGoTo('ETFForeignSellView', id)
  }

  const handleClearFilters = () => {
    showState.value = 0
    filtersFormat.value = {}
    isEquityOpsEmpty.value = true
    tableProperties.value.rows = []
  }

  const handleUpdatePage = async (page: number) =>
    await loadData({
      ...filtersFormat.value,
      page,
    })

  const handleUpdatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    await loadData({
      ...filtersFormat.value,
      rows: perPage,
    })
  }

  const handleGoTo = (route: string, id?: number) =>
    router.push({ name: route, params: { id } })

  watch(
    () => exchange_traded_fund_list.value,
    () => {
      tableProperties.value.rows = exchange_traded_fund_list.value
      tableProperties.value.pages = exchange_traded_fund_pages.value
    }
  )

  onMounted(async () => {
    await _getResources(keys)

    if (route.query.reload === 'true') loadData({})
  })

  onBeforeMount(() => _resetKeys(keys))

  return {
    showState,
    handleFilter,
    filterConfig,
    handleEditsType,
    tableProperties,
    headerProperties,
    handleUpdatePage,
    isEquityOpsEmpty,
    handleClearFilters,
    defaultIconsLucide,
    handleUpdatePerPage,
  }
}

export default useEquityOpsList
