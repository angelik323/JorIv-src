// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import {
  EGuaranteeOperationType,
  IGuaranteeOperationsList,
} from '@/interfaces/customs/investment-portfolio/GuaranteeOperations'

// Composables
import { useUtils, useGoToUrl, useRouteValidator } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'
import { useGuaranteeOperationsStore } from '@/stores/investment-portfolio/guarantee-operations'

const useGuaranteeOperationsList = () => {
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const { _getGuaranteeOperationList, _clearData } =
    useGuaranteeOperationsStore('v1')
  const { headerPropsDefault, pages, guarantee_operation_list } = storeToRefs(
    useGuaranteeOperationsStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    type_of_operation,
    list_investment_portfolios_associated_trader,
    status_guarantee_list,
    options_positions_list,
    guarantee_operation_list: guarantee_operation_list_resource,
  } = storeToRefs(useInvestmentPortfolioResourceStore('v1'))

  const { defaultIconsLucide } = useUtils()

  const headerProperties = headerPropsDefault.value

  const GUARANTEE_OPERATION_ROUTES = {
    [EGuaranteeOperationType.MARGIN_CALL]: 'MarginCallView',
    [EGuaranteeOperationType.MAINTENANCE]: 'MaintenanceGuaranteesView',
  } as const

  const tableProperties = ref<IBaseTableProps<IGuaranteeOperationsList>>({
    title: 'Listado de operaciones de mercado',
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
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: (row) => `${row.type ?? '-'}`,
        sortable: true,
      },
      {
        name: 'operation',
        required: true,
        label: 'Operación',
        align: 'left',
        field: (row) => `${row.operation ?? '-'}`,
        sortable: true,
      },
      {
        name: 'operation_date',
        required: true,
        label: 'Fecha de operación',
        align: 'left',
        field: (row) => `${row.operation_date ?? '-'}`,
        sortable: true,
      },
      {
        name: 'portfolio_code',
        required: true,
        label: 'Código portafolio',
        align: 'left',
        field: (row) => `${row.portfolio_code ?? '-'}`,
        sortable: true,
      },
      {
        name: 'portfolio_description',
        required: true,
        label: 'Descripción portafolio',
        align: 'left',
        field: (row) => `${row.portfolio_description ?? '-'}`,
        sortable: true,
      },
      {
        name: 'paper',
        required: true,
        label: 'Papel',
        align: 'left',
        field: (row) => `${row.paper ?? '-'}`,
        sortable: true,
      },
      {
        name: 'title_id',
        required: true,
        label: 'Número de título',
        align: 'left',
        field: (row) => `${row.title_id ?? '-'}`,
        sortable: true,
      },
      {
        name: 'number_operation',
        required: true,
        label: 'Número de operación',
        align: 'left',
        field: (row) => `${row.number_operation ?? '-'}`,
        sortable: true,
      },
      {
        name: 'position',
        required: true,
        label: 'Posición',
        align: 'left',
        field: (row) => `${row.position ?? '-'}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row) => `${row.status ?? '-'}`,
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
      name: 'investment_portfolio',
      label: 'Código portafolio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: list_investment_portfolios_associated_trader,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'operation_type',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: guarantee_operation_list_resource,
      disable: false,
      autocomplete: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'position',
      label: 'Posición',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: options_positions_list,
      disable: false,
      autocomplete: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'operation',
      label: 'Operación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: type_of_operation,
      disable: false,
      autocomplete: false,
      clean_value: true,
      placeholder: 'Todos',
    },

    {
      name: 'status',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: status_guarantee_list,
      disable: false,
      autocomplete: false,
      clean_value: true,
      placeholder: 'Todos',
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
    await _getGuaranteeOperationList(filters)
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[investment_portfolio]': string
    'filter[operation]': string
    'filter[operation_type]': string
    'filter[status]': string
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
    investment_portfolio: [
      'type_of_operation',
      'list_investment_portfolios_associated_trader',
      'guarantee_operation_list',
      'options_positions_list',
      'status_guarantee_list',
    ],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    guarantee_operation_list,
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
    EGuaranteeOperationType,
    GUARANTEE_OPERATION_ROUTES,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    goToURL,
    validateRouter,
  }
}

export default useGuaranteeOperationsList
