// vue - pinia -    quasar
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useRoute } from 'vue-router'

// interfaces
import {
  ITrustBusinessItemList,
  IDownloadData,
} from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'
import { IFieldFilters } from '@/interfaces/customs'

// composables
import {
  useMainLoader,
  useRouteValidator,
  useUtils,
  useRules,
} from '@/composables'
const { defaultIconsLucide, formatParamsCustom } = useUtils()

// stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'

// constants
import { business_trust_register_type } from '@/constants'

const useTrustBusinessManagementList = () => {
  // router
  const route = useRoute()

  // imports
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  // principal data store
  const {
    _getTrustBusinessList,
    _dowloadTrustBusinessList,
    _dowloadTrustBusinessByRow,
    _deleteTrustBusiness,
    _clearData,
  } = useTrustBusinessStore('v2')

  const { headerPropsDefault, trust_business_list, trust_business_pages } =
    storeToRefs(useTrustBusinessStore('v2'))

  // data selects
  const { business_trust_statuses, business_trust_types } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    trust_business: [
      'business_trust_statuses',
      'business_trust_types',
      'business_trust_subtypes',
    ],
  }

  const filtersRef = ref()

  const businessTrustTypesOptions = computed(() => [
    ...business_trust_types.value,
  ])

  const onChangeRegisterType = async (registerType: string | null) => {
    const key = {
      trust_business: ['business_trust_types'],
    }

    _resetKeys(key)

    if (registerType) {
      await _getResources(key, `filter[register_type]=${registerType}`)
    }

    filtersRef.value?.cleanFiltersByNames(['business_type_id'])
  }

  // breadcrumb
  const headerPropsList = {
    title: headerPropsDefault.value.title,
    breadcrumbs: headerPropsDefault.value.breadcrumbs,
  }

  const selectedStartDate = ref<string | null>(null)
  const selectedEndDate = ref<string | null>(null)

  const optionsEndDate = (date: string) => {
    if (!selectedStartDate.value) return true
    return date >= selectedStartDate.value
  }

  const optionsStartDate = (date: string) => {
    if (!selectedEndDate.value) return true
    return date <= selectedEndDate.value
  }

  // filters
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
      onChange: onChangeRegisterType,
    },
    {
      name: 'business_type_id',
      label: 'Tipo de negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: businessTrustTypesOptions,
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
      option_calendar: optionsStartDate,
      onChange: (value: string | number) => {
        if (value) {
          const dateStr = String(value)
          selectedStartDate.value = dateStr.replace(/-/g, '/')
        } else {
          selectedStartDate.value = null
          filterConfig.value[4].value = null
        }
      },
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      option_calendar: optionsEndDate,
      onChange: (value: string | number) => {
        if (value) {
          const dateStr = String(value)
          selectedEndDate.value = dateStr.replace(/-/g, '/')
        } else {
          selectedEndDate.value = null
        }
      },
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-9',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
      rules: [(val: string) => useRules().max_length(val, 50)],
    },
  ])

  const currentRowsPerPage = ref<number>(20)

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = async ($filters: {
    'filter[status_id]': string
    'filter[register_type]': string
    'filter[business_type_id]': string
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      rows: currentRowsPerPage.value,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  // table
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
        label: 'Nombre de negocio',
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

  // actions

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

  const downloadAllDataByRow = async (id: number) => {
    _dowloadTrustBusinessByRow(id, [1, 2, 3, 4])
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

  // modals
  const alertModalRef = ref()
  const modalDownloadRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openDownloadModal = (id: number) => {
    alertModalConfig.value.entityId = id
    modalDownloadRef.value.openModal()
  }

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el negocio?`
  }

  // lifecycles
  onMounted(async () => {
    _clearData()
    await _getResources(keys)

    const reload = route.query.reload
    if (reload) {
      await listAction()
    }
  })

  // watch
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

  onBeforeUnmount(async () => await _resetKeys(keys))

  return {
    headerPropsList,
    tableProps,
    filterConfig,
    alertModalRef,
    modalDownloadRef,
    filtersRef,
    currentRowsPerPage,

    openDownloadModal,
    downloadDataByRow,
    downloadAllDataByRow,
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

export default useTrustBusinessManagementList
