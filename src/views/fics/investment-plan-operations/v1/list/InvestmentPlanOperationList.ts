// Vuew - pinia - moment
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IInvestmentPlanOperationItem } from '@/interfaces/customs/fics/InvestmentPlanOperations'
import { investment_plan_operation_options } from '@/constants'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useInvestmentPlanOperationStore } from '@/stores/fics/investment-plan-operations'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useInvestmentPlanOperationList = () => {
  const { defaultIconsLucide, formatCurrencyString } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getInvestmentPlanOperationList } =
    useInvestmentPlanOperationStore('v1')

  const { investment_plan_operations, defaultHeaderProps } = storeToRefs(
    useInvestmentPlanOperationStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    funts_to_investment_plans,
    status_operation_investment_plans,
    number_operation_investment_plans,
  } = storeToRefs(useFicResourceStore('v1'))

  const filterComponentRef = ref()
  const isTableEmpty = ref(true)
  const showState = ref(0)

  const keys = {
    fics: [
      'funts_to_investment_plans',
      'status_operation_investment_plans',
      'number_operation_investment_plans',
    ],
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const styleColumn = (width: number = 200) =>
    `white-space: nowrap; min-width: ${width}px; max-width: ${width}px; overflow-x: hidden; text-overflow: ellipsis;`

  const headerProps = {
    title: defaultHeaderProps.value.title,
    breadcrumbs: defaultHeaderProps.value.breadcrumbs,
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'collective_investment_fund_id',
      label: 'Fondo de inversión',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      options: funts_to_investment_plans,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'operation_date',
      label: 'Fecha de operación',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o finalidad',
    },
    {
      name: 'operation_number',
      label: 'Número de operación',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: number_operation_investment_plans,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'type',
      label: 'Operación',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: investment_plan_operation_options,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'state_id',
      label: 'Estados',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 col-lg-4 q-py-md',
      options: status_operation_investment_plans,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const tableProps = ref<IBaseTableProps<IInvestmentPlanOperationItem>>({
    title: 'Listado de operaciones',
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
        name: 'operation_request',
        required: true,
        label: 'Número de operación',
        align: 'left',
        field: (row: IInvestmentPlanOperationItem) =>
          row.operation_number ?? '-',
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'investment_plan',
        required: true,
        label: 'Plan de inversión',
        align: 'left',
        field: (row: IInvestmentPlanOperationItem) =>
          row.investment_plan?.code ? `${row.investment_plan?.code}` : '-',
        sortable: true,
      },
      {
        name: 'operation_date',
        required: true,
        label: 'Fecha de operación',
        align: 'left',
        field: (row: IInvestmentPlanOperationItem) =>
          row.operation_date ? `${row.operation_date}` : '-',
        sortable: true,
      },
      {
        name: 'collective_investment_funds',
        required: true,
        label: 'Fondo de inversión',
        align: 'left',
        field: (row: IInvestmentPlanOperationItem) =>
          row.collective_investment_fund?.fund_code &&
          row.collective_investment_fund?.fund_name
            ? `${row.collective_investment_fund?.fund_code} - ${row.collective_investment_fund?.fund_name}`
            : '-',
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor de operación',
        align: 'left',
        field: (row: IInvestmentPlanOperationItem) =>
          row.value ? formatCurrencyString(row.value) : '-',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IInvestmentPlanOperationItem) =>
          row.state_id ? `${row.state_id}` : '-',
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

  const setFilters = ($filters: Record<string, string | number>) => {
    filtersFormat.value = {
      page: filtersFormat.value.page,
      rows: filtersFormat.value.rows,
      ...$filters,
    }
  }

  const handleClearFilters = () => {
    showState.value = 0
    isTableEmpty.value = true
    tableProps.value.rows = []
  }

  const handleFilterUpdate = ($filters: {}) => {
    setFilters($filters)
  }

  const handleFilter = ($filters: {}) => {
    setFilters($filters)

    listAction()
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    listAction()
  }

  const listAction = async () => {
    openMainLoader(true)
    tableProps.value.rows = []

    await _getInvestmentPlanOperationList(filtersFormat.value)

    const hasResults = investment_plan_operations.value.list.length > 0

    isTableEmpty.value = !hasResults
    showState.value = filtersFormat.value ? 1 : 0

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  watch(
    investment_plan_operations,
    () => {
      tableProps.value.rows = investment_plan_operations.value.list
      tableProps.value.pages = investment_plan_operations.value.pages
    },
    { deep: true }
  )

  onMounted(async () => {
    if (route.query.reload === 'true') listAction()

    await _getResources(keys)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    goToURL,
    showState,
    tableProps,
    updatePage,
    headerProps,
    filterConfig,
    handleFilter,
    isTableEmpty,
    updatePerPage,
    defaultIconsLucide,
    handleClearFilters,
    filterComponentRef,
    handleFilterUpdate,
  }
}

export default useInvestmentPlanOperationList
