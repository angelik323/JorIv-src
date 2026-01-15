// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { IPaperTypeListItem } from '@/interfaces/customs/investment-portfolio/TypePaper'

// Composables - constants
import { useRouteValidator, useUtils, useRules } from '@/composables'

// Stores
import { usePaperTypesStore } from '@/stores/investment-portfolio/type-paper'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

const usePaperTypesList = () => {
  const { _getListAction, _clearData } = usePaperTypesStore('v1')
  const { headerPropsDefault, paper_type_list, paper_type_pages } = storeToRefs(
    usePaperTypesStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { inversion_types, class_investment } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const headerProperties = headerPropsDefault.value

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'inversion_type_id',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Tipo de inversión',
      placeholder: 'Seleccione',
      value: null,
      options: inversion_types,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'investment_class',
      type: 'q-select',
      class: 'col-12 col-md-4',
      label: 'Clase de inversión',
      placeholder: 'Seleccione',
      value: null,
      options: class_investment,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'search',
      type: 'q-input',
      class: 'col-12 col-md-4',
      label: 'Buscador',
      placeholder: 'Buscar por código o descripción',
      prepend_icon: defaultIconsLucide.magnify,
      value: null,
      clean_value: true,
      disable: false,
      rules: [(val: string) => useRules().max_length(val, 50)],
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

  const tableProperties = ref<IBaseTableProps<IPaperTypeListItem>>({
    title: 'Listado de tipos de papel',
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
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'code',
        required: false,
        label: 'Código',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'investment_type',
        required: false,
        label: 'Tipo de inversión',
        align: 'left',
        field: 'investment_type',
        sortable: true,
      },
      {
        name: 'investment_class',
        required: false,
        label: 'Clase de inversión',
        align: 'left',
        field: 'investment_class',
        sortable: true,
      },
      {
        name: 'created_at',
        required: false,
        label: 'Fecha de creación',
        align: 'left',
        field: 'created_at',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getListAction(filters)
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[inversion_type_id]': string
    'filter[investment_class]': string
    'filter[search]': string
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
    investment_portfolio: ['inversion_types', 'class_investment'],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    paper_type_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = paper_type_pages.value
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
    validateRouter,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
  }
}

export default usePaperTypesList
