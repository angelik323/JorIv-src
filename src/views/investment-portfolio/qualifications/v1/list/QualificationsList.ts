// Vue - pinia
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { IQualificationsList } from '@/interfaces/customs/investment-portfolio/Qualifications'

// Composables
import {
  useRouteValidator,
  useUtils,
  useRules,
  useGoToUrl,
} from '@/composables'

// Stores
import { useQualificationsStore } from '@/stores/investment-portfolio/qualifications'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

const useQualificationsList = () => {
  const { _getListAction, _clearData } = useQualificationsStore('v1')
  const { headerPropsDefault, qualifications_list, qualifications_pages } =
    storeToRefs(useQualificationsStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { qualification_actions } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const headerProperties = headerPropsDefault.value

  const filterComponentRef = ref()

  const qualification_actions_with_all = computed(() => [
    { label: 'Todos', value: '' },
    ...qualification_actions.value,
  ])

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'action_rating',
      type: 'q-select',
      class: 'col-12 col-md-6',
      label: 'Acción calificación',
      placeholder: 'Seleccione',
      value: null,
      options: qualification_actions_with_all,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'search',
      type: 'q-input',
      class: 'col-12 col-md-6',
      label: 'Buscador',
      placeholder: 'Buscar por código o nombre',
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
      per_page: number
    } & Record<string, string | number>
  >({
    page: 1,
    per_page: 20,
  })

  const tableProps = ref<IBaseTableProps<IQualificationsList>>({
    title: 'Listado de calificaciones',
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
        name: 'action_rating',
        required: false,
        label: 'Acción calificación',
        align: 'left',
        field: 'action_rating',
        sortable: true,
      },
      {
        name: 'rating_code',
        required: true,
        label: 'Código calificación',
        align: 'left',
        field: 'rating_code',
        sortable: true,
      },
      {
        name: 'group',
        required: true,
        label: 'Grupo',
        align: 'left',
        field: 'group',
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
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
  }

  const handleFilterSearch = async ($filters: {
    'filter[action_rating]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      per_page: filtersFormat.value.per_page,
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (per_page: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.per_page = per_page

    await listAction(filtersFormat.value)
  }

  const keys = {
    investment_portfolio: ['qualification'],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => qualifications_list.value,
    (val) => {
      tableProps.value.rows = [...val]
      const { currentPage, lastPage } = qualifications_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    filterComponentRef,
    headerProperties,
    tableProps,
    filterConfig,
    validateRouter,
    goToURL,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
  }
}

export default useQualificationsList
