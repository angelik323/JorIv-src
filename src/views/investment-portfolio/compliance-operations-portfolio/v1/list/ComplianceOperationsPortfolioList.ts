import {
  useGoToUrl,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'
import {
  IComplianceOperationsPortfolio,
  IFieldFilters,
} from '@/interfaces/customs'
import {
  useComplianceOperationsPortfolioStore,
  useInvestmentPortfolioResourceStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const useComplianceOperationsPortfolioList = () => {
  const { formatParamsCustom } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const { headerPropsDefault, pages } = storeToRefs(
    useComplianceOperationsPortfolioStore('v1')
  )
  const { _getComplianceOperationsPortfolioList } =
    useComplianceOperationsPortfolioStore('v1')
  const headerProperties = headerPropsDefault.value

  const { operation_compliance_statuses } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status',
      label: 'Tipo de operación*',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4',
      disable: false,
      options: operation_compliance_statuses,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [(v: string) => useRules().is_required(v)],
    },
    {
      name: 'operation_date',
      label: 'Fecha de operación',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4',
      disable: false,
      options: [],
      clean_value: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o coincidencia',
    },
  ])
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref({
    title: 'Listado cumplimiento operaciones portafolio',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: (row) => row.instrucion_slip_id,
        sortable: true,
      },
      {
        name: 'operation_type',
        required: true,
        label: 'Tipo de operación',
        align: 'left',
        field: 'operation_type',
        sortable: true,
      },
      {
        name: 'investment_portfolio_id',
        required: true,
        label: 'Portafolio',
        align: 'left',
        field: 'investment_portfolio_id',
        sortable: true,
      },
      {
        name: 'investment_portfolio',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'investment_portfolio',
        sortable: true,
      },
      {
        name: 'instrucion_slip_id',
        required: true,
        label: 'Número de papeleta',
        align: 'left',
        field: 'instrucion_slip_id',
        sortable: true,
      },
      {
        name: 'operation_value',
        required: true,
        label: 'Valor operación',
        align: 'left',
        field: 'operation_value',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IComplianceOperationsPortfolio[],
    pages: pages,
    wrapCells: true,
  })

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    let queryString = formatParamsCustom(filtersFormat.value)
    queryString += '&operation_compliance_list_limit=20'
    const response = await _getComplianceOperationsPortfolioList(
      queryString ? '&' + queryString : '',
      true
    )
    tableProperties.value.rows = response
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }
  const handleFilterSearch = ($filters: {}) => {
    filtersFormat.value = {
      ...$filters,
    }

    listAction()
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
      operation_compliance_list_page: 1 as number,
      operation_compliance_list_limit: rowsPerPage as number,
    }
    listAction()
  }

  const keys = {
    investment_portfolio: ['operation_compliance_statuses'],
  }

  onMounted(async () => {
    _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProperties,
    filterConfig,
    tableProperties,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    goToURL,
    validateRouter,
  }
}

export default useComplianceOperationsPortfolioList
