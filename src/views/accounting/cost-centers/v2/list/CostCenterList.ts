// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs'
import { ICostCenterListItem } from '@/interfaces/customs/accounting/CostCenterV2'

// Composables - constants
import { useUtils, useRouteValidator, useGoToUrl } from '@/composables'
import { status } from '@/constants'

// Stores
import { useCostCenterStore } from '@/stores/accounting/cost-centers'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

const useCostCenterList = () => {
  const { _getListAction, _clearData } = useCostCenterStore('v2')
  const { headerPropsDefault, cost_center_list, cost_center_pages } =
    storeToRefs(useCostCenterStore('v2'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { cost_center_structures_id_value } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()

  const headerProperties = headerPropsDefault.value

  const filterComponentRef = ref()

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'id',
      type: 'q-select',
      class: 'col-12 col-md-6',
      label: 'Estructura centro de costos',
      placeholder: 'Seleccione',
      value: null,
      options: cost_center_structures_id_value,
      clean_value: true,
      autocomplete: true,
      disable: false,
    },
    {
      name: 'status_id',
      type: 'q-select',
      class: 'col-12 col-md-6',
      label: 'Estado',
      placeholder: 'Seleccione',
      value: null,
      options: status,
      clean_value: true,
      autocomplete: true,
      disable: false,
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

  const tableProperties = ref<IBaseTableProps<ICostCenterListItem>>({
    title: 'Listado de centros de costos',
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
        name: 'code',
        required: false,
        label: 'Estructura centro de costos',
        align: 'left',
        field: 'code',
        sortable: true,
      },
      {
        name: 'purpose',
        required: false,
        label: 'Finalidad',
        align: 'left',
        field: 'purpose',
        sortable: true,
      },
      {
        name: 'structure',
        required: false,
        label: 'Diseño de la estructura',
        align: 'left',
        field: 'structure',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado de la estructura',
        align: 'left',
        field: (row) => `${row.status?.name ?? ''}`,
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
    'filter[id]': string
    'filter[status_id]': string
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
    accounting: ['cost_center_structures'],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    cost_center_list,
    (val) => {
      tableProperties.value.rows = [...val]

      const { currentPage, lastPage } = cost_center_pages.value
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
    goToURL,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
  }
}

export default useCostCenterList
