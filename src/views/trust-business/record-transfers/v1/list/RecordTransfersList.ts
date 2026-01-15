// vue - quasar - router - pinia
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

// store
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useRecordTransfersStore } from '@/stores/trust-business/record-transfers'
import { useResourceManagerStore } from '@/stores/resources-manager'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// interfaces
import { IRecordTransfers } from '@/interfaces/customs/trust-business/RecordTransfers'

// composables
import {
  useAlert,
  useMainLoader,
  useRouteValidator,
  useRules,
} from '@/composables'

const useRecordTransfersList = () => {
  // imports
  const router = useRouter()
  const route = useRoute()
  const { validateRouter } = useRouteValidator()

  const {
    _getListAction,
    _downloadByRowdData,
    _downloadGeneralReport,
    _deleteRecordTransfers,
  } = useRecordTransfersStore('v1')

  const { record_transfers_list, record_transfers_pages } = storeToRefs(
    useRecordTransfersStore('v1')
  )

  const { participant_transfer_status, participant_types } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { showAlert } = useAlert()
  const { openMainLoader } = useMainLoader()

  const keys = {
    trust_business: ['participant_transfer_status', 'participant_types'],
  }

  const currentRowsPerPage = ref<number>(20)

  // props
  const headerProps = {
    title: 'Registrar cesiones',
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
        label: 'Registrar cesiones',
        route: 'RecordTransfersList',
      },
    ],
  }

  // table
  const tableProps = ref({
    title: 'Listado de registro de cesiones',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código de negocio',
        align: 'left',
        field: (row) => row.business_trust?.business_code,
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre del negocio',
        align: 'left',
        field: (row) => row.business_trust?.name,
        sortable: true,
      },
      {
        name: 'start_date',
        required: true,
        label: 'Fecha de registro',
        align: 'left',
        field: 'created_at',
        sortable: true,
      },
      {
        name: 'transfer_type_text',
        required: true,
        label: 'Tipo cesión',
        align: 'left',
        field: 'transfer_type_text',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
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
    rows: [] as IRecordTransfers[],
    pages: record_transfers_pages.value,
  })

  const filterConfig = ref([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: participant_transfer_status,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'transfer_type',
      label: 'Tipo de cesión',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: participant_types,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre o código',
      rules: [
        (val: string) => useRules().max_length(val, 50),
        (val: string) => useRules().only_alphanumeric(val),
      ],
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[status_id]': string
    'filter[transfer_type]': string
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[search]': string
  }) => {
    const startDate = new Date($filters['filter[start_date]'])
    const endDate = new Date($filters['filter[end_date]'])

    if (startDate > endDate) {
      showAlert(
        'La fecha final debe ser mayor o igual a la fecha inicial',
        'error'
      )
      return
    }

    filtersFormat.value = {
      ...$filters,
      rows: currentRowsPerPage.value,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

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

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const downloadByRowExcel = async (id: number) => {
    await _downloadByRowdData(id)
  }

  const downloadExcel = async () => {
    await _downloadGeneralReport()
  }

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el negocio?`
  }

  const deleteRecord = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteRecordTransfers(alertModalConfig.value.entityId as number)
    openMainLoader(false)

    filtersFormat.value = {
      ...filtersFormat.value,
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

  onMounted(async () => {
    await _getResources(keys)
    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => record_transfers_list.value,
    () => {
      tableProps.value.rows = record_transfers_list.value
      tableProps.value.pages = record_transfers_pages.value
    },
    { immediate: true, deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    filtersFormat,
    alertModalRef,

    downloadExcel,
    handleFilter,
    handlerGoTo,
    updatePage,
    handleClearFilters,
    downloadByRowExcel,
    deleteRecord,
    openAlertModal,
    validateRouter,
    updateRowsPerPage,
  }
}

export default useRecordTransfersList
