import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { defaultIconsLucide, formatParamsCustom } from '@/utils'
import { QTable } from 'quasar'
import { useCostCenterStore, useFiltersStore, useResourceStore } from '@/stores'
import { ICostCenter, ICostCenterItem } from '@/interfaces/customs'
import { IFilters } from '@/interfaces/global'
import { useRouteValidator } from '@/composables'

const useCostCenterList = () => {
  const router = useRouter()
  const { validateRouter } = useRouteValidator()
  const { setFiltersState } = useFiltersStore()
  const { _getAccountingResources } = useResourceStore('v1')

  const { _getListAction, _toggleCostCenterStatus, _selectCostCenter } =
    useCostCenterStore('v1')
  const { cost_center_list, cost_center_pages, selected_cost_center } =
    storeToRefs(useCostCenterStore('v1'))
  const {
    status,
    cost_center_types,
    available_cost_center_structures,
    cost_center_structures,
  } = storeToRefs(useResourceStore('v1'))

  const keys = [
    'cost_center_types',
    'available_cost_center_structures',
    'cost_center_structures',
  ]

  const headerProps = {
    title: 'Centro de costos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Centro de costos', route: 'CostCenterList' },
    ],
    btn: { label: 'Crear', icon: defaultIconsLucide.plusCircle },
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ICostCenter[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de centro de costos',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'code',
        label: 'Código',
        align: 'left',
        field: (row) => row.code,
        sortable: true,
      },
      {
        name: 'type',
        label: 'Tipo',
        align: 'left',
        field: (row) => row.type,
        sortable: true,
      },
      {
        name: 'name',
        label: 'Nombre de centro de costos',
        align: 'left',
        field: (row) => row.name,
        sortable: true,
      },
      {
        name: 'structure',
        label: 'Estructura centro de costos',
        align: 'left',
        field: (row) => row.structure,
        sortable: true,
      },
      {
        name: 'purpose',
        label: 'Finalidad',
        align: 'left',
        field: (row) => row.purpose,
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'center',
        field: (row: ICostCenterItem) => `${row.status_id}`,
        sortable: true,
      },
      { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const filtersFormat = ref<Record<string, string | number | null>>({})

  const filterConfig = ref([
    {
      name: 'type',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-3 q-py-md',
      options: cost_center_types,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'structure',
      label: 'Estructura de centro de costos',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-3 q-py-md',
      options: cost_center_structures,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-3 q-py-md',
      options: status,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-3 q-py-md',
      prepend_icon: 'mdi-magnify',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por código o nombre de centro de costos...',
    },
  ])

  const listAction = async (params = '') => {
    tableProps.value.loading = true
    await _getListAction(params)
    tableProps.value.loading = false
  }

  const handleFilter = (filters: IFilters) => {
    filtersFormat.value = { ...filters }
    const q = formatParamsCustom(filtersFormat.value)
    listAction(q ? '&' + q : '&paginate=1')
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    const q = formatParamsCustom(filtersFormat.value)
    listAction(q ? '&' + q : '')
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
    tableProps.value.pages = { currentPage: 1, lastPage: 1 }
  }

  const handleGoTo = (routeName: string) => {
    router.push({ name: routeName })
  }

  const costCenterStatus = computed(() => {
    const id =
      (selected_cost_center.value?.status as any)?.id ??
      selected_cost_center.value?.status_id
    return id === 1 ? 'inactivar' : 'activar'
  })

  onMounted(async () => {
    await _getAccountingResources(`keys[]=${keys.join('&keys[]=')}`)
    setFiltersState(filterConfig.value)
  })

  watch(cost_center_list, () => {
    tableProps.value.rows = cost_center_list.value
  })

  watch(cost_center_pages, () => {
    tableProps.value.pages = {
      currentPage: cost_center_pages.value.currentPage,
      lastPage: cost_center_pages.value.lastPage,
    }
  })

  return {
    headerProps,
    tableProps,
    selected_cost_center,
    cost_center_types,
    cost_center_structures,
    available_cost_center_structures,
    costCenterStatus,
    filterFields: filterConfig,
    validateRouter,
    handleFilter,
    handleClear,
    handleGoTo,
    updatePage,
    _selectCostCenter,
    _toggleCostCenterStatus,
  }
}

export default useCostCenterList
