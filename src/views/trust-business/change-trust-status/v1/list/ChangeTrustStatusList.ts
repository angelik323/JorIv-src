// vue - quasar - router - pinia
import { onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// stores
import { useChangeTrustStatusStore } from '@/stores/trust-business/change-trust-status'
import { useResourceStore } from '@/stores/resources-selects'

// utils
import { formatParamsCustom } from '@/utils'

// interfaces
import { IChangeTrustStatus } from '@/interfaces/customs/trust-business/ChangeTrustStatus'

// composables
import { useRouteValidator } from '@/composables'

const useChangeTrustStatusList = () => {
  // router
  const route = useRoute()

  // imports
  const { validateRouter } = useRouteValidator()
  const { _getListAction } = useChangeTrustStatusStore('v1')

  const { change_trust_status_list, change_trust_status_pages } = storeToRefs(
    useChangeTrustStatusStore('v1')
  )

  const { business_trust_change_status } = storeToRefs(useResourceStore('v1'))

  const keys = ['business_trust_change_status']

  const { _getTrustBusinessResources } = useResourceStore('v1')

  const is_accept_status = [57, 59, 60]

  const currentRowsPerPage = ref<number>(20)

  // props
  const headerProps = {
    title: 'Cambio de estado fideicomisos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
        route: '',
      },
      {
        label: 'Cambio de estado fideicomisos',
        route: 'ChangeTrustStatusList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de cambio de estado de fideicomisos',
    loading: false,
    columns: [
      {
        name: 'business_code',
        required: true,
        label: 'Código de negocio',
        align: 'left',
        field: 'business_code',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Descripción de negocio',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado actual',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
      {
        name: 'previous_status_id',
        required: false,
        label: 'Estado anterior',
        align: 'center',
        field: (row) => row.last_status_history?.previous_status_id,
        sortable: true,
      },
      {
        name: 'observation',
        required: false,
        label: 'Observación',
        align: 'center',
        field: (row) => row.last_status_history?.observation,
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IChangeTrustStatus[],
    pages: change_trust_status_pages.value,
  })

  // filter
  const filterConfig = ref([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-6 q-py-md',
      options: business_trust_change_status,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-6 q-py-md',
      disable: false,
      icon: 'mdi-magnify',
      clean_value: true,
      placeholder: 'Buscar por nombre o código del negocio',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[status_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: currentRowsPerPage.value,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    currentRowsPerPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  onMounted(async () => {
    await _getTrustBusinessResources(`keys[]=${keys.join('&keys[]=')}`)
    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  // watch
  watch(
    () => change_trust_status_list.value,
    () => {
      tableProps.value.rows = change_trust_status_list.value
      tableProps.value.pages = change_trust_status_pages.value
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    is_accept_status,

    handleFilter,
    updatePage,
    handleClearFilters,
    validateRouter,
    updateRowsPerPage,
  }
}

export default useChangeTrustStatusList
