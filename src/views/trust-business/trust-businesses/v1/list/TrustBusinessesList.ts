// Vue - pinia - moment
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { QTable } from 'quasar'

// Interfaces
import {
  IDownloadData,
  ITrustBusinessItemList,
} from '@/interfaces/customs/trust-business/TrustBusinesses'
import { IFieldFilters } from '@/interfaces/customs'

// Utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// Composables
import { useMainLoader, useRouteValidator } from '@/composables'

// Stores
import { useResourceStore } from '@/stores/resources-selects'
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'

const useTrustBusinessesList = () => {
  const {
    _getTrustBusinessList,
    _deleteTrustBusiness,
    _dowloadTrustBusinessList,
    _dowloadTrustBusinessByRow,
    _clearData,
  } = useTrustBusinessStore('v1')
  const { trust_business_list, trust_business_pages } = storeToRefs(
    useTrustBusinessStore('v1')
  )

  const {
    business_trust_statuses,
    business_trust_register_type,
    business_trust_types,
  } = storeToRefs(useResourceStore('v1'))
  const { _getTrustBusinessResources } = useResourceStore('v1')
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const keys = [
    'business_trust_statuses',
    'business_trust_types',
    'business_trust_subtypes',
  ]

  const headerProps = {
    title: 'Negocios Fiduciarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
        route: 'TrustBusinessesList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de negocios fiduciarios',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_code',
        field: 'business_code',
        required: true,
        label: 'Código de negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        field: 'name',
        required: true,
        label: 'Descripción de negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'start_date',
        field: 'start_date',
        required: true,
        label: 'Fecha inicio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type_registry',
        field: (row) => row.register_type ?? 'Falta definir',
        required: true,
        label: 'Tipo registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_type',
        field: (row) => row.type?.name ?? '',
        required: true,
        label: 'Tipo negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
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
    rows: [] as ITrustBusinessItemList[],
    pages: trust_business_pages.value,
  })

  const optionsCalendar = (date: string) =>
    date <= moment().format('YYYY/MM/DD')

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trust_statuses,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'register_type',
      label: 'Tipo de registro',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trust_register_type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'business_type_id',
      label: 'Tipo de negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trust_types,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
      rules: [
        (val: string) =>
          !val || val.length <= 50 || 'Debe contener como máximo 50 caracteres',
      ],
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      option_calendar: optionsCalendar,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      option_calendar: optionsCalendar,
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  // modal download
  const modalDownloadRef = ref()

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getTrustBusinessList(filters)
    tableProps.value.loading = false
  }

  const downloadAction = async () => {
    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    _dowloadTrustBusinessList(queryString ? '&' + queryString : '')
  }

  const downloadDataByRow = async (data: IDownloadData[]) => {
    _dowloadTrustBusinessByRow(
      alertModalConfig.value.entityId as number,
      data.map((item) => item.id)
    )
    modalDownloadRef.value?.closeModal()
  }

  const handleFilter = async ($filters: {
    'filter[status_id]': string
    'filter[register_type]': string
    'filter[business_type_id]': string
    'filter[search]': string
    'filter[start_date]': string
    'filter[end_date]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: filtersFormat.value.rows || 20,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el negocio?`
  }

  const changeStatusAction = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteTrustBusiness(alertModalConfig.value.entityId as number)

    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
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
    tableProps.value.pages = {
      currentPage: 1,
      lastPage: 1,
    }
  }

  onMounted(async () => {
    _clearData()
    await _getTrustBusinessResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  watch(
    () => trust_business_list.value,
    () => {
      tableProps.value.rows = trust_business_list.value
      tableProps.value.pages.currentPage =
        trust_business_pages.value.currentPage
      tableProps.value.pages.lastPage = trust_business_pages.value.lastPage
    },
    { deep: true }
  )

  const openDownloadModal = (id: number) => {
    alertModalConfig.value.entityId = id
    modalDownloadRef.value.openModal()
  }

  return {
    headerProps,
    tableProps,
    filterConfig,
    alertModalRef,
    modalDownloadRef,
    openDownloadModal,
    downloadDataByRow,
    handleFilter,
    updatePage,
    openAlertModal,
    changeStatusAction,
    downloadAction,
    validateRouter,
    updateRowsPerPage,
    handleClearFilters,
  }
}

export default useTrustBusinessesList
