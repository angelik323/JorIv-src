// Core
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useGoToUrl, useRouteValidator, useUtils } from '@/composables'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IAccountingClosingParameterItem } from '@/interfaces/customs/accounting/PeriodClosureParameter'

// Stores
import { usePeriodClosureParametersStore } from '@/stores/accounting/period-closure-parameters'

const usePeriodClosureParameterList = () => {
  const { _getPeriodClosureParameterList, _cleanPeriodClosureParametersData } =
    usePeriodClosureParametersStore('v2')
  const { period_closure_parameter_list, period_closure_parameter_pages } =
    storeToRefs(usePeriodClosureParametersStore('v2'))
  const { goToURL } = useGoToUrl()

  const { defaultIconsLucide } = useUtils()

  const { validateRouter } = useRouteValidator()

  const headerProps = {
    title: 'Parámetros de cierre',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Parámetros de cierre',
        route: 'PeriodClosureParameterList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const tableProps = ref<IBaseTableProps<IAccountingClosingParameterItem>>({
    title: 'Listado de parámetros',
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
        name: 'code',
        required: true,
        label: 'Estructura',
        align: 'left',
        field: (row: IAccountingClosingParameterItem) => `${row.code}`,
        sortable: true,
      },
      {
        name: 'purpose',
        required: true,
        label: 'Finalidad',
        align: 'left',
        field: (row: IAccountingClosingParameterItem) => `${row.purpose}`,
        sortable: true,
      },
      {
        name: 'structure',
        required: true,
        label: 'Diseño de la estructura',
        align: 'left',
        field: (row: IAccountingClosingParameterItem) => `${row.structure}`,
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
    pages: { currentPage: 1, lastPage: 1 },
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código de estructura y/o finalidad',
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

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      rows: filtersFormat.value.rows,
      page: 1,
      ...$filters,
    }

    listAction()
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value.rows = rowsPerPage
    filtersFormat.value.page = 1
    listAction()
  }

  const listAction = async () => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getPeriodClosureParameterList(filtersFormat.value)
    tableProps.value.loading = false
  }

  onMounted(async () => {
    _cleanPeriodClosureParametersData()
    tableProps.value.rows = period_closure_parameter_list.value
  })

  watch(
    () => period_closure_parameter_list.value,
    () => {
      tableProps.value.rows = period_closure_parameter_list.value
      tableProps.value.pages = period_closure_parameter_pages.value
    }
  )

  return {
    // Props
    headerProps,
    tableProps,
    filterConfig,
    defaultIconsLucide,
    // Methods
    handleFilter,
    goToURL,
    updatePage,
    updatePerPage,
    validateRouter,
    _cleanPeriodClosureParametersData,
  }
}

export default usePeriodClosureParameterList
