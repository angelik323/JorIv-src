// Vue - pinia - moment
import { ref, onBeforeMount, onBeforeUnmount, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import {
  IAuditUserSubmodulesResource,
  IFieldFilters,
  IPaginatedFiltersFormat,
  ResourceTypes,
} from '@/interfaces/customs'
import {
  IAuditDatabaseActivityLogsListItem,
  IAuditDatabaseActivityLogsParams,
} from '@/interfaces/customs/audit/AuditDatabaseLogs'

// Components
import FiltersComponent from '@/components/common/Filters/v2/FiltersComponent.vue'
import AlertModalComponent from '@/components/common/AlertModal/AlertModalComponent.vue'

// Composables
import {
  useAlert,
  useCalendarRules,
  useGoToUrl,
  useMainLoader,
  useRules,
  useUtils,
  useRouteValidator,
} from '@/composables'

// Stores
import {
  useResourceManagerStore,
  useUserResourceStore,
} from '@/stores/resources-manager'
import { useDatabaseLogsStore } from '@/stores/audit/database-logs'

// Constants

const useAuditDatabaseLogsList = () => {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { goToURL } = useGoToUrl()
  const { is_required } = useRules()
  const { openMainLoader } = useMainLoader()
  const { only_until } = useCalendarRules()
  const { showAlert } = useAlert()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { user_modules, user_submodules } = storeToRefs(
    useUserResourceStore('v1')
  )

  const { _getActivityLogsList } = useDatabaseLogsStore('v1')

  const moduleKey: ResourceTypes = { user: ['module_app'] }

  const subModuleKey: ResourceTypes = { user: ['submodules_app'] }

  const headerConfig = {
    title: 'Consultar log de bases de datos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Auditoría',
        route: '',
      },
      {
        label: 'Consultar log de bases de datos',
        route: 'AuditDatabaseLogsList',
      },
    ],
    btn: {
      route: 'AuditDatabaseLogsEdit',
      icon: defaultIconsLucide.cog,
      label: 'Configuración',
    },
  }

  // Refs and computed props

  const filtersRef = ref<InstanceType<typeof FiltersComponent> | null>(null)

  const filtersFormat = ref<IPaginatedFiltersFormat>({ page: 1, rows: 20 })

  const currentFilterValues = ref<{ module?: number; submodule?: number }>({})

  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'user_name',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      placeholder: 'Buscar por código o nombre',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
    },
    {
      name: 'module',
      label: 'Módulo*',
      type: 'q-select',
      value: null,
      options: user_modules,
      class: 'col-12 col-md-4',
      disable: false,
      autocomplete: true,
      placeholder: 'Seleccione',
      clean_value: true,
      rules: [(v: string) => is_required(v)],
      onChange: (v: number | null) => {
        currentFilterValues.value.module = v ?? undefined
        handleModuleFilterChange(v)
      },
    },
    {
      name: 'submodule',
      label: 'Submódulo',
      type: 'q-select',
      value: null,
      options: [],
      class: 'col-12 col-md-4',
      disable: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      clean_value: true,
      onChange: (v: number | null) => {
        currentFilterValues.value.submodule = v ?? undefined
        handleSubmoduleFilterChange(v)
      },
    },
    {
      name: 'action',
      label: 'Acción',
      type: 'q-select',
      value: null,
      options: [],
      class: 'col-12 col-md-4',
      autocomplete: true,
      placeholder: 'Seleccione',
      disable: true,
      clean_value: true,
    },
    {
      name: 'date_from',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: null,
      placeholder: 'AAAA-MM-DD',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'date_to',
      label: 'Fecha final*',
      type: 'q-date',
      value: null,
      placeholder: 'AAAA-MM-DD',
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      mask: 'YYYY-MM-DD',
      rules: [(val: string) => is_required(val)],
    },
  ])

  const currentSubmoduleOpts = ref<IAuditUserSubmodulesResource[]>([])
  const currentActionOpts = ref<IAuditUserSubmodulesResource[]>([])

  const tableProps = ref<IBaseTableProps<IAuditDatabaseActivityLogsListItem>>({
    title: 'Listado de consulta  log de bases de datos',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        sortable: true,
        align: 'left',
      },
      {
        name: 'submodule',
        field: 'submodule',
        label: 'Submódulo',
        sortable: true,
        align: 'left',
      },
      {
        name: 'action',
        field: 'action',
        label: 'Acción',
        sortable: true,
        align: 'left',
      },
      {
        name: 'table',
        field: 'table',
        label: 'Tabla',
        sortable: true,
        align: 'left',
      },
      {
        name: 'user',
        field: 'users',
        label: 'Nombre del usuario',
        sortable: true,
        align: 'left',
      },
      {
        name: 'phone',
        field: 'phone',
        label: 'Teléfono',
        sortable: true,
        align: 'left',
      },
      {
        name: 'ip',
        field: 'ip',
        label: 'IP',
        sortable: true,
        align: 'left',
      },
      // TODO: Uncomment once decided what to do with these two cols
      // {
      //   name: 'operation_number',
      //   field: 'operation_number',
      //   label: 'Número de operación',
      //   sortable: true,
      //   align: 'left',
      // },
      // {
      //   name: 'client_cost',
      //   field: () => '-',
      //   label: 'Costo para cliente',
      //   sortable: true,
      //   align: 'left',
      // },
      {
        name: 'date_time',
        field: (row) => formatDate(row.created_at, 'YYYY-MM-DD HH:mm'),
        label: 'Fecha y hora',
        sortable: true,
        align: 'left',
      },
      {
        name: 'old_data',
        field: 'id',
        label: 'Datos anteriores',
        sortable: false,
        align: 'center',
      },
      {
        name: 'new_data',
        field: 'id',
        label: 'Datos modificados',
        sortable: false,
        align: 'center',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const customCols = ['old_data', 'new_data']

  const isEnabledDownloadBtn = computed<boolean>(
    () => tableProps.value.rows.length > 0
  )

  const alertModalRef = ref<InstanceType<typeof AlertModalComponent> | null>(
    null
  )

  // Functions/Methods
  const isEnabledDownloadAction = () =>
    validateRouter('Audit', 'AuditDatabaseLogsList', 'export')

  const isEnabledEditAction = () =>
    validateRouter('Audit', 'AuditDatabaseLogsList', 'action_configure')

  const handleGoToList = () => goToURL(headerConfig.btn.route)

  const handleModuleFilterChange = async (value: number | null) => {
    filtersRef.value?.cleanFiltersByNames(['submodule'])
    _resetKeys(subModuleKey)

    const subModuleFilterObj = filtersConfig.value.find(
      (filter) => filter.name === 'submodule'
    )

    if (!subModuleFilterObj) return

    subModuleFilterObj.disable = true

    if (!value) return

    openMainLoader(true)
    const filters = `filter[module_app_id]=${value}&filter[main]=true`
    await _getResources(subModuleKey, filters)

    subModuleFilterObj.disable = false
    subModuleFilterObj.options = user_submodules.value
    currentSubmoduleOpts.value = user_submodules.value

    openMainLoader(false)
  }

  const handleSubmoduleFilterChange = async (value: number | null) => {
    filtersRef.value?.cleanFiltersByNames(['action'])
    _resetKeys(subModuleKey)

    const actionFilterObj = filtersConfig.value.find(
      (filter) => filter.name === 'action'
    )

    if (!actionFilterObj) return

    actionFilterObj.disable = true

    if (!value) return

    openMainLoader(true)
    const filters = `filter[module_app_id]=${currentFilterValues.value.module}&filter[main]=false&filter[to_activity]=true&filter[parent_permission_id]=${value}`
    await _getResources(subModuleKey, filters)

    actionFilterObj.disable = false
    actionFilterObj.options = user_submodules.value
    currentActionOpts.value = user_submodules.value

    openMainLoader(false)
  }

  const validateDateFilters = (
    startDate?: string,
    endDate?: string
  ): boolean => {
    if (startDate === undefined || endDate === undefined) return true

    const isStartBeforeEnd = only_until(endDate)(startDate)

    if (!isStartBeforeEnd) {
      showAlert('La fecha inicial no puede ser mayor a la fecha final', 'error')
      return false
    }

    return true
  }

  const buildParams = (
    filters: IPaginatedFiltersFormat
  ): IAuditDatabaseActivityLogsParams => {
    const {
      'filter[user_name]': userName,
      'filter[module]': module_app_id,
      'filter[submodule]': submodule,
      'filter[action]': action,
      'filter[date_from]': dateFrom,
      'filter[date_to]': dateTo,
    } = filters

    const submoduleOpt = currentSubmoduleOpts.value.find(
      (opt) => opt.id === submodule
    )
    const actionOpt = currentActionOpts.value.find((opt) => opt.id === action)

    const dateRange = `${dateFrom},${dateTo}`

    return {
      module_app_id: module_app_id as number,
      'filter[user_name]': userName as string,
      'filter[submodule]': submoduleOpt?.description,
      'filter[action]': actionOpt?.action,
      'filter[dateRange]': dateRange,
    }
  }

  const listAction = async (filters: IPaginatedFiltersFormat) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const resp = await _getActivityLogsList(filters)
    tableProps.value.rows = resp.list
    tableProps.value.pages = resp.pages
    tableProps.value.loading = false
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
  }

  const handleFilterSearch = async (rawFilters: IPaginatedFiltersFormat) => {
    const { 'filter[date_from]': startDate, 'filter[date_to]': endDate } =
      rawFilters
    if (!validateDateFilters(startDate as string, endDate as string)) return

    const params = buildParams(rawFilters)

    filtersFormat.value = {
      ...params,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const handleUpdatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const handleUpdateRowsPerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    await listAction(filtersFormat.value)
  }

  const selectedLog = ref<IAuditDatabaseActivityLogsListItem | null>(null)
  const showNewDataInModal = ref<boolean>(true)
  const modalContent = ref<string | null>(null)
  const modalLabel = ref<string>('')

  const handleOpenModal = async (
    row: IAuditDatabaseActivityLogsListItem,
    newData: boolean
  ) => {
    selectedLog.value = row
    showNewDataInModal.value = newData
    await alertModalRef.value?.openModal()
  }

  const handleCloseModal = () => {
    selectedLog.value = null
    modalContent.value = null
    modalLabel.value = ''
  }

  // Watchers

  watch(
    [selectedLog, showNewDataInModal],
    ([log, showNew]) => {
      if (!log) {
        modalContent.value = null
        modalLabel.value = ''
        return
      }

      if (showNew) {
        modalContent.value = JSON.parse(JSON.stringify(log.new_data, null, 4))
        modalLabel.value = 'Datos modificados'
        return
      }

      modalContent.value = JSON.parse(JSON.stringify(log.old_data, null, 4))
      modalLabel.value = 'Datos anteriores'
    },
    { immediate: true }
  )

  // Life cycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(moduleKey)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(moduleKey)
    _resetKeys(subModuleKey)
  })

  return {
    // composable refs and variables
    defaultIconsLucide,

    // composable functions

    // Refs and computed props
    headerConfig,
    filtersRef,
    filtersConfig,
    tableProps,
    customCols,
    isEnabledDownloadBtn,
    alertModalRef,
    modalContent,
    modalLabel,

    // Functions/Methods
    isEnabledDownloadAction,
    isEnabledEditAction,
    handleGoToList,
    handleClearFilters,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handleOpenModal,
    handleCloseModal,
  }
}

export default useAuditDatabaseLogsList
