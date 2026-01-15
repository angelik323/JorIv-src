import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'
import { STATUS_SETTLE_OPTIONS } from '@/constants'
import {
  IDerivativeInvestmentOperationList,
  IFieldFilters,
} from '@/interfaces/customs'
import {
  useDerivativeInvestmentOperationStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeMount, onMounted, ref } from 'vue'

export const useDerivativeInvestmentOperationList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const {
    derivative_investment_operation_pages,
    derivative_investment_operation_list,
  } = storeToRefs(useDerivativeInvestmentOperationStore('v1'))

  const { _getDerivativeInvestmentOperationList } =
    useDerivativeInvestmentOperationStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const resources = useInvestmentPortfolioResourceStore('v1')

  const { operation_type } = storeToRefs(resources)

  const { formatParamsCustom, defaultIconsLucide } = useUtils()
  const headerProps = {
    title: 'Operaciones de inversión derivados',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
        route: '',
      },
      {
        label: 'Operaciones de inversión derivados',
        route: 'DerivativeInvestmentOperationsList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: useUtils().defaultIconsLucide.plusCircleOutline,
      options: [
        {
          label: 'Constitución forward de compra divisa USD / COP',
          routeName: 'DerivativeInvestmentOperationsBuysForwardCreate',
        },
        {
          label: 'Constitución forward de venta divisa USD / COP',
          routeName: 'DerivativeInvestmentOperationsSaleForwardCreate',
        },
        {
          label: 'Constitución swaps tasas de interés IBR/TF y TF/IBR',
          routeName: '',
        },
      ],
      color: 'primary',
      textColor: 'white',
      size: 'md',
      class: 'btn-header',
      outline: false,
      disable: false,
    },
  }

  let perPage = 20
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IDerivativeInvestmentOperationList[]
    pages: typeof derivative_investment_operation_pages.value
    rowsPerPage: number
  }>({
    title: 'Listado de inversión de derivados',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
      },
      {
        name: 'code',
        required: false,
        label: 'Código portafolio',
        align: 'left',
        field: 'code',
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'type',
        required: false,
        label: 'Tipo de forward',
        align: 'left',
        field: 'type',
        sortable: true,
      },
      {
        name: 'title',
        required: false,
        label: 'Número de título',
        align: 'left',
        field: 'title',
        sortable: true,
      },
      {
        name: 'forward_number',
        required: false,
        label: 'Número de forward',
        align: 'left',
        field: 'forward_number',
        sortable: true,
      },
      {
        name: 'date',
        required: false,
        label: 'Fecha de creación',
        align: 'left',
        field: 'date',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IDerivativeInvestmentOperationList[],
    pages: derivative_investment_operation_pages.value,
    rowsPerPage: perPage,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'operation_type_id',
      label: 'Tipo de operación',
      type: 'q-select',
      value: null,
      options: operation_type,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: false,
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: false,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: false,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      options: STATUS_SETTLE_OPTIONS,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: false,
    },
  ])

  const handleFilter = ($filter: {
    'filter[operation_type_id]': number
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[status_id]': number
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

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getDerivativeInvestmentOperationList(filters)
    tableProps.value.rows = derivative_investment_operation_list.value
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
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

  const loadResources = async () => {
    openMainLoader(true)
    await _getResources({ investment_portfolio: ['operation_type'] })
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(() => loadResources())

  onBeforeMount(async () => {
    _resetKeys({ investment_portfolio: ['operation_type'] })
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    defaultIconsLucide,

    handleFilter,
    handleClear,
    updatePage,
    updatePerPage,
    validateRouter,
    goToURL,
  }
}
