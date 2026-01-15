import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import router from '@/router'
import { useRoute } from 'vue-router'

// Utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// Composables
import { useMainLoader, useRouteValidator } from '@/composables'

// Interfaces
import { IGeneralRequests } from '@/interfaces/customs/trust-business/GeneralRequests'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useGeneralRequestsStore } from '@/stores/trust-business/general-requests'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useGeneralRequestsList = () => {
  const route = useRoute()

  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()

  const { funds } = storeToRefs(useFicResourceStore('v1'))
  const { fiduciary_mandates_statuses: status } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _listAction, _deleteAction } = useGeneralRequestsStore('v1')
  const { general_requests_list, general_requests_pages } = storeToRefs(
    useGeneralRequestsStore('v1')
  )

  const filtersFormat = ref<Record<string, string | number>>({})
  const isGeneralRequestsEmpty = ref(true)
  const deleteModalRef = ref()
  const showState = ref(0)

  const keys = {
    fics: ['funds'],
    trust_business: ['fiduciary_mandates_statuses'],
  }

  const currentRowsPerPage = ref<number>(20)

  const deleteModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el encargo general?',
    id: null as number | null,
  })

  const headerProps = {
    title: 'Encargos generales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
        route: '',
      },
      {
        label: 'Encargos general',
        route: 'GeneralRequestsList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref([
    {
      name: 'fund_id',
      label: 'Fondo de inversión',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: funds,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'record_status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: status,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar nombre del encargo o negocio',
    },
  ])

  const tableProps = ref({
    title: 'Listado de encargos generales',
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'number',
        label: 'Número de encargo',
        align: 'left',
        field: (row) => row.number || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'name',
        label: 'Nombre del encargo',
        align: 'left',
        field: (row) => row.name || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'name',
        label: 'Nombre del negocio',
        align: 'left',
        field: (row) =>
          `${row.business_trust.business_code} - ${row.business_trust.name}` ||
          '-',
        sortable: true,
        required: true,
      },
      {
        name: 'fund_code',
        label: 'Fondo de inversión',
        align: 'left',
        field: (row) => `${row.fund[0]?.fund_name ?? ''}`,
        sortable: true,
        required: true,
      },
      {
        name: 'record_status_id',
        label: 'Estado',
        align: 'left',
        field: 'record_status_id',
        sortable: true,
        required: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IGeneralRequests[],
    pages: general_requests_pages,
  })

  const loadData = async (filters: string = 'paginate=1') => {
    openMainLoader(true)

    tableProps.value.rows = []

    await _listAction(filters)

    let results = general_requests_list.value

    const searchTerm = filtersFormat.value['filter[search]']
    if (searchTerm && typeof searchTerm === 'string') {
      const searchLower = searchTerm.toLowerCase()

      const startsWithResults = results.filter((item) => {
        const name = String(item.name || '').toLowerCase()
        const number = String(item.number || '').toLowerCase()
        const businessName = String(
          item.business_trust?.name || ''
        ).toLowerCase()

        return (
          name.startsWith(searchLower) ||
          number.startsWith(searchLower) ||
          businessName.startsWith(searchLower)
        )
      })

      const containsResults = results.filter((item) => {
        const name = String(item.name || '').toLowerCase()
        const number = String(item.number || '').toLowerCase()
        const businessName = String(
          item.business_trust?.name || ''
        ).toLowerCase()

        const nameMatch = name.includes(searchLower)
        const numberMatch = number.includes(searchLower)
        const businessMatch = businessName.includes(searchLower)

        const startsWithMatch =
          name.startsWith(searchLower) ||
          number.startsWith(searchLower) ||
          businessName.startsWith(searchLower)

        return (nameMatch || numberMatch || businessMatch) && !startsWithMatch
      })

      results = [...startsWithResults, ...containsResults]
    }
    const hasResults = general_requests_list.value.length > 0

    showState.value = filters ? 1 : 0
    isGeneralRequestsEmpty.value = !hasResults
    tableProps.value.rows = results
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleUpdatePerPage = (rowsPerPage: number) => {
    currentRowsPerPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      paginate: 1,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleFilter = async ($filters: {
    'filter[project_id]': string
    'filter[status_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: currentRowsPerPage.value,
      paginate: 1,
    }
    loadData(formatParamsCustom(filtersFormat.value))
  }

  const handleFieldChange = async (values: Record<string, string | number>) => {
    const selectedProjectId = values['filter[project_id]']

    await _getResources(
      { trust_business: ['project_stage'] },
      `filter[business_trust_real_estate_project_stage_id]=${selectedProjectId}`
    )
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const handleOptions = async (option: string, id: number) => {
    if (option === 'view') handleGoTo('GeneralRequestsView', id)
    else if (option === 'edit') handleGoTo('GeneralRequestsEdit', id)
    else if (option === 'delete') {
      deleteModalConfig.value.id = id
      await deleteModalRef.value.openModal()
      return
    }
  }

  const handleDeleteItem = async () => {
    await _deleteAction(deleteModalConfig.value.id!)
    loadData()
    await deleteModalRef.value.closeModal()
  }

  const handleGoTo = (goURL: string, id?: number) =>
    router.push({ name: goURL, params: { id } })

  watch(
    () => general_requests_list.value,
    () => {
      tableProps.value.rows = general_requests_list.value
      tableProps.value.pages = general_requests_pages.value
    }
  )

  onMounted(async () => {
    await _getResources(keys)
    const reload = route.query.reload
    if (reload) {
      await loadData()
    }
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    showState,
    tableProps,
    handleGoTo,
    headerProps,
    handleFilter,
    filterConfig,
    handleOptions,
    deleteModalRef,
    handleDeleteItem,
    handleUpdatePage,
    deleteModalConfig,
    handleFieldChange,
    handleClearFilters,
    handleUpdatePerPage,
    isGeneralRequestsEmpty,
    validateRouter,
  }
}

export default useGeneralRequestsList
