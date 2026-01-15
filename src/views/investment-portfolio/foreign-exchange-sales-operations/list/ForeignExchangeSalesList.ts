import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'

import { IForeignExchangeSalesBuyItem } from '@/interfaces/customs/investment-portfolio/ForeignExchangeSaleBuy'

// Utils / Composables / Constantes
import { default_statuses } from '@/constants/resources'
import { useMainLoader, useRouteValidator, useUtils } from '@/composables'

// Stores
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'
import { useForeignExchangeSalesStore } from '@/stores/investment-portfolio'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTitlesMergingStore } from '@/stores/investment-portfolio/titles-merging'

const useForeignExchangeSalesBuyList = () => {
  const fesStore = useForeignExchangeSalesStore('v1')
  const {
    _getForeignExchangeSalesBuyList,
    _cleanForeignExchangeSalesBuysData,
    _updateForeignExchangeSalesBuyStatus,
  } = fesStore
  const { foreign_exchange_sales_list, foreign_exchange_sales_pages } =
    storeToRefs(fesStore)

  const { operation_type, investment_portfolio } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getMergedTitleList } = useTitlesMergingStore('v1')

  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { formatCurrency } = useUtils()

  const headerProps = {
    title: 'Operación venta variable {Divisas}',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Renta variable' },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
      options: [
        { label: 'Compra divisas', route: 'ForeignExchangeBuyCreate' },
        { label: 'Venta divisas', route: 'ForeignExchangeSalesCreate' },
      ],
      color: 'primary',
      textColor: 'white',
      size: 'md',
      class: 'btn-header',
      outline: false,
      disable: false,
    },
  }

  const tableProperties = ref<IBaseTableProps<IForeignExchangeSalesBuyItem>>({
    title: 'Listado de divisas',
    loading: false,
    wrapCells: false,
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
        name: 'operation_type_description',
        required: true,
        label: 'Operación',
        align: 'left',
        field: 'operation_type_description',
        sortable: true,
      },
      {
        name: 'operation_date',
        required: true,
        label: 'Fecha de operación',
        align: 'left',
        field: (row) => `${row.operation_date ?? ''}`,
        sortable: true,
        format: (val: string) =>
          val ? new Date(val).toLocaleDateString() : '',
      },
      {
        name: 'title_id',
        required: true,
        label: 'Número de título',
        align: 'left',
        field: 'title_id',
        sortable: true,
      },
      {
        name: 'operation_number',
        required: true,
        label: 'Número de operación',
        align: 'left',
        field: 'operation_number',
        sortable: true,
      },
      {
        name: 'investment_portfolio_code',
        required: true,
        label: 'Código de portafolio',
        align: 'left',
        field: 'investment_portfolio_code',
        sortable: true,
      },
      {
        name: 'investment_portfolio_description',
        required: true,
        label: 'Descripción portafolio',
        align: 'left',
        field: 'investment_portfolio_description',
        sortable: true,
      },
      {
        name: 'paper_type_code',
        required: true,
        label: 'Papel',
        align: 'left',
        field: 'paper_type_code',
        sortable: true,
      },
      {
        name: 'origin_amount',
        required: true,
        label: 'Monto origen',
        align: 'right',
        field: (row) => Number(row.origin_amount ?? 0),
        sortable: true,
        format: (val: number) => formatCurrency(val, 'USD'),
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  // Filtros estandarizados
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'operation_type_id',
      label: 'Tipo de operación',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      options: operation_type,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'investment_portfolio_id',
      label: 'Código de portafolio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      options: investment_portfolio,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 q-py-md',
      options: default_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  // Formato de filtros
  const filtersFormat = ref<
    { page: number; rows: number } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true

    const qs = (await _getMergedTitleList(filters)) as string | undefined
    const suffix = qs ? `&${qs}` : ''
    await _getForeignExchangeSalesBuyList(suffix)

    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[operation_type_id]': string
    'filter[investment_portfolio_id]': string
    'filter[search]': string
    'filter[status_id]': string
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
    investment_portfolio: ['operation_type', 'investment_portfolio'],
  }

  onMounted(async () => {
    openMainLoader(true)
    _resetKeys(keys)
    await _getResources(keys)
    _cleanForeignExchangeSalesBuysData()
    await listAction(filtersFormat.value)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _cleanForeignExchangeSalesBuysData()
  })

  watch(
    foreign_exchange_sales_list,
    (val) => {
      tableProperties.value.rows = [...val]
      const { currentPage, lastPage } = foreign_exchange_sales_pages.value || {
        currentPage: 1,
        lastPage: 1,
      }
      tableProperties.value.pages = { currentPage, lastPage }
    },
    { deep: true }
  )

  const alertModalRef = ref()
  const selectedPortfolio = ref<IForeignExchangeSalesBuyItem>()

  const openModal = (portfolio: IForeignExchangeSalesBuyItem) => {
    selectedPortfolio.value = portfolio
    alertModalRef.value?.openModal?.()
  }

  const updatePortfolioStatus = async () => {
    const id = selectedPortfolio.value?.id
    if (typeof id !== 'number') return
    const ok = await _updateForeignExchangeSalesBuyStatus(id)
    alertModalRef.value?.closeModal?.()
    if (ok) await listAction(filtersFormat.value)
  }

  const VIEW_ROUTE_BY_TYPE = {
    SELL: 'ForeignExchangeSalesView',
    BUY: 'ForeignExchangeBuyView',
  } as const

  const goToView = (row: { id: number | string; type?: string }) => {
    const t = String(row?.type ?? '').toUpperCase()
    const routeName = VIEW_ROUTE_BY_TYPE[t as keyof typeof VIEW_ROUTE_BY_TYPE]
    if (!routeName) return
    router.push({ name: routeName, params: { id: row.id } })
  }

  return {
    // Header
    headerProps,
    defaultIconsLucide,

    tableProperties,
    filterConfig,
    handleFilterSearch,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,

    // Acciones varias
    goToView,
    validateRouter,

    // Modal / estado
    alertModalRef,
    selectedPortfolio,
    openModal,
    updatePortfolioStatus,
  }
}

export default useForeignExchangeSalesBuyList
