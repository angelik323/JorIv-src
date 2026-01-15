// Composable
import { useMainLoader, useUtils, useRouteValidator } from '@/composables'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { BalancePointStatusID } from '@/interfaces/global/Status'

// Stores
import { useBalancePointStore } from '@/stores/trust-business/balance-point'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

// Utils
import { formatParamsCustom } from '@/utils'

// Vue
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const useBalancePointList = () => {
  const router = useRouter()
  const route = useRoute()
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  const { headerPropsDefault, data_balance_point_list, pages } = storeToRefs(
    useBalancePointStore('v1')
  )
  const {
    _getListBalancePoint,
    _exportXlsxBalancePointList,
    _deleteAction,
    _exportXlsxBalancePointRow,
    _downloadZipBalancePointByRow,
  } = useBalancePointStore('v1')
  const headerProperties = headerPropsDefault.value

  const {
    business_trust_statuses,
    project_status,
    project_stage,
    equilibrium_point_statuses,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-xs-12 col-sm-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar por nombre del negocio o proyecto inmobiliario',
    },
    {
      name: 'business_trust_real_estate_project_stage_id',
      label: 'Etapa',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4',
      disable: false,
      options: project_stage,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
    },
    {
      name: 'registration_date',
      label: 'Fecha de registro',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4',
      disable: false,
      options: [],
      clean_value: true,
    },
    {
      name: 'business_status_id',
      label: 'Estado del negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4',
      disable: false,
      options: business_trust_statuses,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'project_status_id',
      label: 'Estado del proyecto',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4',
      disable: false,
      options: project_status,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
    {
      name: 'equilibrium_status_id',
      label: 'Estado punto de equilibrio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4',
      disable: false,
      options: equilibrium_point_statuses,
      clean_value: true,
      placeholder: 'Todos',
      autocomplete: true,
    },
  ])
  const filtersFormat = ref<Record<string, string | number>>({})

  const tableProperties = ref({
    title: 'Listado de punto de equilibrio',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: 'business_name',
        sortable: true,
      },
      {
        name: 'project_name',
        required: true,
        label: 'Nombre del proyecto inmobiliario',
        align: 'left',
        field: 'project_name',
        sortable: true,
      },
      {
        name: 'stage',
        required: true,
        label: 'Etapa',
        align: 'left',
        field: 'stage',
        sortable: true,
      },
      {
        name: 'registration_date',
        required: true,
        label: 'Fecha de registro',
        align: 'left',
        field: 'registration_date',
        sortable: true,
      },
      {
        name: 'business_status_id',
        required: true,
        label: 'Estado del negocio',
        align: 'left',
        field: 'business_status_id',
        sortable: true,
      },
      {
        name: 'project_status_id',
        required: true,
        label: 'Estado del proyecto',
        align: 'left',
        field: 'project_status_id',
        sortable: true,
      },
      {
        name: 'equilibrium_status_id',
        required: true,
        label: 'Estado punto de equilibrio',
        align: 'left',
        field: 'equilibrium_status_id',
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
    rows: data_balance_point_list,
    pages: pages,
    wrapCells: true,
  })

  const listAction = async () => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    const queryString = formatParamsCustom(filtersFormat.value)
    await _getListBalancePoint(queryString ? '&' + queryString : '')
    tableProperties.value.loading = false
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
  }
  const handleFilterSearch = ($filters: {}) => {
    filtersFormat.value = {
      ...$filters,
      rows: currentRowsPerPage.value,
      page: 1,
    }

    listAction()
  }

  const updatePage = (pageNumber: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: pageNumber as number,
    }
    listAction()
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    currentRowsPerPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage as number,
    }
    listAction()
  }

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el punto de equilibrio?',
    id: null as number | null,
  })

  // Computed property to check if download button should be disabled
  const isDownloadDisabled = computed(() => {
    // Check if table has data
    const hasTableData =
      tableProperties.value.rows && tableProperties.value.rows.length > 0

    return !hasTableData
  })

  const isIndividualDownloadDisabled = (status_id: number) => {
    return status_id !== BalancePointStatusID.AUTHORIZED
  }

  const isEditDisabled = (status_id: number) => {
    return (
      status_id !== BalancePointStatusID.REGISTERED &&
      status_id !== BalancePointStatusID.REJECTED
    )
  }

  const openModalDelete = async (id: number) => {
    if (id) {
      alertModalConfig.value.id = id
      await alertModalRef.value.openModal()
    }
  }

  const handleDelete = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteAction(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  const downloadExcel = async () => {
    openMainLoader(true)
    const queryString = formatParamsCustom(filtersFormat.value)
    await _exportXlsxBalancePointList(queryString)
    openMainLoader(false)
  }

  const downloadExcelByRow = async (id: number) => {
    openMainLoader(true)
    await _exportXlsxBalancePointRow(id)
    await _downloadZipBalancePointByRow(id)
    openMainLoader(false)
  }

  const keys = {
    trust_business: [
      'business_trust_statuses',
      'project_status',
      'project_stage',
      'equilibrium_point_statuses',
    ],
  }

  const currentRowsPerPage = ref<number>(20)

  onMounted(async () => {
    _getResources(keys)

    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProperties,
    filterConfig,
    tableProperties,
    isDownloadDisabled,
    alertModalRef,
    alertModalConfig,
    defaultIconsLucide,
    isIndividualDownloadDisabled,
    isEditDisabled,
    handleClearFilters,
    handleFilterSearch,
    updatePage,
    updateRowsPerPage,
    handlerGoTo,
    openModalDelete,
    handleDelete,
    downloadExcel,
    downloadExcelByRow,
    validateRouter,
  }
}

export default useBalancePointList
