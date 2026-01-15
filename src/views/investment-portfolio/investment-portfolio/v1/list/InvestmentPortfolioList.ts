import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { QTable } from 'quasar'
import { IFieldFilters, IInvestmentPortfolioItem } from '@/interfaces/customs'

import { defaultIconsLucide, formatParamsCustom } from '@/utils'

import { default_statuses } from '@/constants/resources'

import { useInvestmentPortfoliosStore } from '@/stores'
import { useRouteValidator } from '@/composables'

const useInvestmentPortfolioList = () => {
  const {
    _getInvestmentPortfolioList,
    _cleanInvestmentPortfoliosData,
    _updateInvestmentPortfolioStatus,
  } = useInvestmentPortfoliosStore('v1')
  const { investment_portfolio_list, investment_portfolio_pages } = storeToRefs(
    useInvestmentPortfoliosStore('v1')
  )

  const router = useRouter()
  const { validateRouter } = useRouteValidator()

  let perPage = 20

  const tableProps = ref({
    title: 'Listado de portafolios',
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
        name: 'description',
        required: true,
        label: 'Descripción portafolio',
        align: 'left',
        field: (row: IInvestmentPortfolioItem) => `${row.name}`,
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código portafolio',
        align: 'left',
        field: (row: IInvestmentPortfolioItem) => `${row.code}`,
        sortable: true,
      },
      {
        name: 'business_code',
        required: true,
        label: 'Código negocio',
        align: 'left',
        field: (row: IInvestmentPortfolioItem) => `${row.business_code}`,
        sortable: true,
      },
      {
        name: 'fic_code',
        required: true,
        label: 'Código FIC',
        align: 'left',
        field: (row: IInvestmentPortfolioItem) => `${row.fic_code || '-'}`,
        sortable: true,
      },
      {
        name: 'currency',
        required: true,
        label: 'Moneda',
        align: 'left',
        field: (row: IInvestmentPortfolioItem) => `${row.currency}`,
        sortable: true,
      },
      {
        name: 'cost_center',
        required: true,
        label: 'Centro de costo',
        align: 'left',
        field: (row: IInvestmentPortfolioItem) => `${row.cost_center || '-'}`,
        sortable: true,
      },
      {
        name: 'last_valuation_date',
        required: true,
        label: 'Última valoración',
        align: 'left',
        field: (row: IInvestmentPortfolioItem) => `${row.last_valuation_date}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IInvestmentPortfolioItem) => `${row.status_id}`,
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
    rows: [] as IInvestmentPortfolioItem[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const headerProps = {
    title: 'Portafolio de inversiones',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Listado' },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      options: default_statuses,
      disable: false,
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
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
      rows: perPage,
    }

    listAction()
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }

    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }

    listAction()
  }

  const listAction = async () => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    const filters = queryString ? '&' + queryString : ''
    await _getInvestmentPortfolioList(filters)
    tableProps.value.loading = false
  }

  const handleGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onMounted(async () => {
    _cleanInvestmentPortfoliosData()
    tableProps.value.rows = investment_portfolio_list.value
  })

  watch(
    () => investment_portfolio_list.value,
    () => {
      tableProps.value.rows = investment_portfolio_list.value
    }
  )

  watch(
    () => investment_portfolio_pages.value,
    () => {
      tableProps.value.pages = investment_portfolio_pages.value
    }
  )

  const alertModalRef = ref()

  const selectedPortfolio = ref<IInvestmentPortfolioItem>()

  const openModal = (portfolio: IInvestmentPortfolioItem) => {
    selectedPortfolio.value = portfolio
    alertModalRef.value.openModal()
  }

  const updatePortfolioStatus = () => {
    if (!selectedPortfolio.value) return
    const { id } = selectedPortfolio.value
    _updateInvestmentPortfolioStatus(id).then((success) => {
      if (success) {
        listAction()
      }
    })
    alertModalRef.value.closeModal()
  }

  return {
    // Props
    headerProps,
    tableProps,
    alertModalRef,
    selectedPortfolio,
    filterConfig,
    // Methods
    handleFilter,
    handleGoTo,
    updatePage,
    updatePerPage,
    updatePortfolioStatus,
    openModal,
    _cleanInvestmentPortfoliosData,
    validateRouter,
  }
}

export default useInvestmentPortfolioList
