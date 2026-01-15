// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { ITypesCoverageList } from '@/interfaces/customs/investment-portfolio/TypesCoverage'

// Composables - constants
import {
  useUtils,
  useRules,
  useRouteValidator,
  useGoToUrl,
} from '@/composables'

// Stores
import { useTypesCoverageStore } from '@/stores/investment-portfolio/types-coverage'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

const useTypesCoverageList = () => {
  const { _getCoverageTypeList, _clearData } = useTypesCoverageStore('v1')
  const { headerPropsDefault, types_coverage_list, types_coverage_pages } =
    storeToRefs(useTypesCoverageStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { operation_coverage } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { max_length } = useRules()

  const headerProps = headerPropsDefault.value

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'operation_coverage_type_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Tipo de cobertura',
      placeholder: 'Seleccione',
      value: null,
      options: operation_coverage.value,
      clean_value: true,
      disable: false,
      autocomplete: true,
    },
    {
      name: 'date',
      type: 'q-date',
      class: 'col-12 col-md-4',
      label: 'Fecha',
      placeholder: 'Fecha',
      value: null,
      clean_value: true,
      disable: false,
    },
    {
      name: 'search',
      type: 'q-input',
      class: 'col-12 col-md-4',
      label: 'Buscador',
      placeholder: 'Buscar por código o coincidencia',
      value: null,
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      rules: [(val: string) => max_length(val, 50)],
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

  const tableProps = ref<IBaseTableProps<ITypesCoverageList>>({
    title: 'Listado de tipos de cobertura',
    loading: false,
    wrapCells: true,
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
        name: 'date',
        field: 'date',
        required: false,
        label: 'Fecha',
        align: 'left',
        sortable: true,
      },
      {
        name: 'code',
        field: 'code',
        required: false,
        label: 'Código de cobertura',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description',
        field: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        sortable: true,
      },
      {
        name: 'coverage_type',
        field: 'coverage_type',
        required: false,
        label: 'Tipo de cobertura',
        align: 'center',
        sortable: true,
      },
      {
        name: 'coverage_type_element',
        field: 'coverage_type_element',
        required: false,
        label: 'Clase derivado',
        align: 'center',
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

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getCoverageTypeList(filters)
    tableProps.value.loading = false
  }

  const handleClear = () => {
    tableProps.value.rows = []
  }

  const handleFilter = async ($filters: {
    'filter[operation_coverage_type_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const keys = ['operation_coverage']

  onMounted(async () => {
    _clearData()
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
    types_coverage_list,
    (val) => {
      tableProps.value.rows = [...val]

      const { currentPage, lastPage } = types_coverage_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    headerProps,
    tableProps,
    filterComponentRef,
    filterConfig,
    validateRouter,
    goToURL,
    handleClear,
    handleFilter,
    updatePage,
  }
}

export default useTypesCoverageList
