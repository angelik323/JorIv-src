import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import router from '@/router'

// Utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// Composables
import { useMainLoader, useRouteValidator } from '@/composables'

// Interfaces
import { IFiduciaryTrust } from '@/interfaces/customs/trust-business/FiduciaryTrust'

// Stores
import { useFiduciaryTrustStore } from '@/stores/trust-business/fiduciary-trust'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useFiduciaryTrustList = () => {
  const { validateRouter } = useRouteValidator()

  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _listAction, _deleteAction } = useFiduciaryTrustStore('v1')
  const { fiduciary_trust_list, fiduciary_trust_pages } = storeToRefs(
    useFiduciaryTrustStore('v1')
  )

  const {
    business_trust_real_estate_project: project,
    fiduciary_mandates_statuses,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const filtersFormat = ref<Record<string, string | number>>({})
  const isFiduciaryTrustEmpty = ref(true)
  const deleteModalRef = ref()
  const showState = ref(0)

  const keys = [
    'business_trust_real_estate_project',
    'fiduciary_mandates_statuses',
  ]

  const currentRowsPerPage = ref<number>(20)

  const deleteModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el encargo fiduciario?',
    id: null as string | null,
  })

  const headerProps = {
    title: 'Encargos fiduciarios',
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
        label: 'Encargos fiduciarios',
        route: 'FiduciaryTrustList',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircle,
    },
  }

  const filterConfig = ref([
    {
      name: 'real_estate_project_id',
      label: 'Proyecto inmobiliario',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: project,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: fiduciary_mandates_statuses,
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
      placeholder: 'Buscar por número o nombre del encargo',
    },
  ])

  const tableProps = ref({
    title: 'Listado de encargos fiduciarios',
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
        name: 'business_trust_id',
        label: 'Número de encargo',
        align: 'left',
        field: (row) => row.mandate_code || '-',
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
        name: 'real_estate_project',
        label: 'Proyecto inmobiliario',
        align: 'left',
        field: (row) => row.real_estate_project?.project_name || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'stage',
        label: 'Etapa',
        align: 'left',
        field: (row) => row.real_estate_project_stage?.stage_number || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'investment_fund',
        label: 'Fondo de inversión',
        align: 'left',
        field: (row) => row.fund[0]?.fund_name || '-',
        sortable: true,
        required: true,
      },
      {
        name: 'status_id',
        label: 'Estado',
        align: 'left',
        field: 'status_id',
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
    rows: [] as IFiduciaryTrust[],
    pages: fiduciary_trust_pages,
  })

  const loadData = async (filters: string = 'paginate=1') => {
    openMainLoader(true)

    tableProps.value.rows = []

    await _listAction(filters)

    let results = fiduciary_trust_list.value

    const searchTerm = filtersFormat.value['filter[search]']
    if (searchTerm && typeof searchTerm === 'string') {
      const searchLower = searchTerm.toLowerCase()

      const startsWithResults = results.filter((item) => {
        const name = String(item.name || '').toLowerCase()
        const mandateCode = String(item.mandate_code || '').toLowerCase()
        const businessName = String(
          item.business_trust?.name || ''
        ).toLowerCase()

        return (
          name.startsWith(searchLower) ||
          mandateCode.startsWith(searchLower) ||
          businessName.startsWith(searchLower)
        )
      })

      const containsResults = results.filter((item) => {
        const name = String(item.name || '').toLowerCase()
        const mandateCode = String(item.mandate_code || '').toLowerCase()
        const businessName = String(
          item.business_trust?.name || ''
        ).toLowerCase()

        const nameMatch = name.includes(searchLower)
        const mandateMatch = mandateCode.includes(searchLower)
        const businessMatch = businessName.includes(searchLower)

        const startsWithMatch =
          name.startsWith(searchLower) ||
          mandateCode.startsWith(searchLower) ||
          businessName.startsWith(searchLower)

        return (nameMatch || mandateMatch || businessMatch) && !startsWithMatch
      })

      results = [...startsWithResults, ...containsResults]
    }

    const hasResults = results.length > 0

    showState.value = filters ? 1 : 0
    isFiduciaryTrustEmpty.value = !hasResults

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
    'filter[real_estate_project_id]': string
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

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const handleOptions = async (option: string, id: string) => {
    if (option === 'view') handleGoTo('FiduciaryTrustView', id)
    else if (option === 'edit') handleGoTo('FiduciaryTrustEdit', id)
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

  const handleGoTo = (goURL: string, id?: string) =>
    router.push({ name: goURL, params: { id } })

  watch(
    () => fiduciary_trust_list.value,
    () => {
      tableProps.value.rows = fiduciary_trust_list.value
      tableProps.value.pages = fiduciary_trust_pages.value
    }
  )

  onMounted(async () => {
    await _getResources({ trust_business: keys })
    if (route.query.reload === 'true') loadData()
  })

  onBeforeUnmount(() =>
    _resetKeys({ trust_business: ['business_trust_real_estate_project'] })
  )

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
    handleClearFilters,
    handleUpdatePerPage,
    isFiduciaryTrustEmpty,
    validateRouter,
  }
}

export default useFiduciaryTrustList
