// Vue - pinia - moment
import {
  ref,
  computed,
  onBeforeMount,
  onBeforeUnmount,
  type ComputedRef,
} from 'vue'
import { storeToRefs } from 'pinia'
// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import {
  ResourceTypes,
  IFieldFilters,
  IGenericResource,
  INullablePaginatedFiltersFormat,
} from '@/interfaces/customs'
import { IAuditEntryOfFunctionalitiesList } from '@/interfaces/customs/audit/AuditEntryOfFunctionalities'

// Components
import FiltersComponentV2 from '@/components/common/Filters/v2/FiltersComponent.vue'

// Composables
import {
  useRouteValidator,
  useMainLoader,
  useGoToUrl,
  useUtils,
  useAlert,
  useRules,
} from '@/composables'
// Stores
import {
  useResourceManagerStore,
  useUserResourceStore,
} from '@/stores/resources-manager'
import { useAuditEntryOfFunctionalitiesStore } from '@/stores/audit/audit-entry-of-functionalities'
// Constants
import { YES_NO_OPTIONS } from '@/constants/resources/audit'
// Utils:
import moment from 'moment'

const useAuditEntryOfFunctionalities = () => {
  // Composables:
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { is_required } = useRules()
  const { validateRouter } = useRouteValidator()
  // Stores:
  const { _listAction } = useAuditEntryOfFunctionalitiesStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { user_roles, user_modules, user_submodules } = storeToRefs(
    useUserResourceStore('v1')
  )
  // Computed:
  const userRolesWithAllOption: ComputedRef<IGenericResource[]> = computed(
    () => [
      { label: 'Todos', value: 'todos' },
      ...user_roles.value.map((role: IGenericResource) => ({
        value: role.label,
        label: role.label,
      })),
    ]
  )
  // Refs:
  const filtersRef = ref<InstanceType<typeof FiltersComponentV2> | null>(null)
  const filtersFormat = ref<INullablePaginatedFiltersFormat>({
    page: 1,
    rows: 20,
  })

  const currentFilters = ref<{
    moduleAppId?: number
    submoduleAppId?: number
    isConfidential?: boolean
  }>({})

  const headerConfig = {
    title: 'Consultar auditoría de ingreso a funcionalidades',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Auditoría',
      },
      {
        label: 'Consultar auditoría de ingreso a funcionalidades',
        route: 'AuditEntryOfFunctionalitiesList',
      },
    ],
    btn: {
      route: 'AuditEntryOfFunctionalitiesEdit',
      icon: defaultIconsLucide.cog,
      label: 'Configurar',
    },
  }

  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'is_confidential',
      label: '¿Incluir ingresos a información confidencial?',
      type: 'q-select',
      value: false,
      placeholder: 'No',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      options: YES_NO_OPTIONS,
      onChange: (value: boolean | null) => {
        currentFilters.value.isConfidential = value ?? undefined
        handleIsConfidentialChange(currentFilters.value.isConfidential)
      },
    },
    {
      name: 'date_from',
      label: 'Fecha inicial*',
      type: 'q-date',
      value: null,
      placeholder: 'AAAA-MM-DD',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      hide_bottom_space: true,
      rules: [(val) => is_required(val, 'El campo fecha inicial es requerido')],
    },
    {
      name: 'date_to',
      label: 'Fecha final*',
      type: 'q-date',
      value: null,
      placeholder: 'AAAA-MM-DD',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      hide_bottom_space: true,
      rules: [(val) => is_required(val, 'El campo fecha final es requerido')],
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      placeholder: 'Buscar por nombre del usuario o dirección IP',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'role_name',
      label: 'Rol',
      type: 'q-select',
      value: 'todos',
      placeholder: 'Todos',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      options: userRolesWithAllOption,
      autocomplete: true,
    },
    {
      name: 'module_app_id',
      label: 'Módulo*',
      type: 'q-select',
      value: null,
      placeholder: 'Seleccione',
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      options: user_modules,
      autocomplete: true,
      rules: [(val) => is_required(val, 'El campo módulo es requerido')],
      onChange: (value: number | null) => {
        currentFilters.value.moduleAppId = value ?? undefined
        handleModuleAppIdChange(currentFilters.value.moduleAppId)
      },
    },
    {
      name: 'parent_permission_id',
      label: 'Submódulo',
      type: 'q-select',
      value: null,
      placeholder: 'Seleccione módulo para continuar',
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      autocomplete: true,
      options: [],
      onChange: (value: number | null) => {
        currentFilters.value.submoduleAppId = value ?? undefined
        handleParentPermissionIdChange(currentFilters.value.submoduleAppId)
      },
    },
    {
      name: 'permission_id',
      label: 'Funcionalidad/Componente',
      type: 'q-select',
      value: null,
      placeholder: 'Seleccione',
      class: 'col-12 col-md-3 mb-1',
      disable: false,
      clean_value: true,
      autocomplete: true,
      options: [],
    },
  ])

  const detailsTableProps = ref<
    IBaseTableProps<IAuditEntryOfFunctionalitiesList>
  >({
    title: 'Listado de consulta auditoría de ingreso a funcionalidades',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'submodule',
        field: (row) => row.parent_permission_description ?? 'Sin información',
        label: 'Submódulo',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'component',
        field: (row) => row.permission_description ?? 'Sin información',
        label: 'Funcionalidad/componente',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'ip',
        field: (row) => row.ip_address,
        label: 'IP',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'user_name',
        field: (row) => row.user_name,
        label: 'Nombre del usuario',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'user_role',
        field: (row) => row.role_name,
        label: 'Rol',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'date',
        field: (row) => row.accessed_at,
        label: 'Fecha y hora',
        required: false,
        sortable: true,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const handleIsConfidentialChange = async (isConfidential?: boolean) => {
    filtersRef.value?.cleanFiltersByNames(['module_app_id'])

    const userKeys = {
      user: ['module_app'],
    }
    const additionalFilters = isConfidential
      ? `filter[is_confidential]=${isConfidential}`
      : undefined
    await _getResources(userKeys, additionalFilters)
  }

  const handleModuleAppIdChange = async (moduleAppId?: number) => {
    filtersRef.value?.cleanFiltersByNames(['parent_permission_id'])

    const parentPermissionIdObj = filtersConfig.value.find(
      (filter) => filter.name === 'parent_permission_id'
    )

    if (!parentPermissionIdObj) return

    parentPermissionIdObj.disable = true

    if (!moduleAppId) return

    const filters = `filter[main]=true&filter[module_app_id]=${moduleAppId}`
    parentPermissionIdObj.placeholder = 'Cargando...'
    await _getResources({ user: ['submodules_app'] }, filters)
    parentPermissionIdObj.placeholder = 'Seleccione módulo para continuar'
    parentPermissionIdObj.options = user_submodules.value
    parentPermissionIdObj.disable = false
  }

  const handleParentPermissionIdChange = async (
    parentPermissionId?: number
  ) => {
    filtersRef.value?.cleanFiltersByNames(['permission_id'])

    const permissionIdObj = filtersConfig.value.find(
      (filter) => filter.name === 'permission_id'
    )

    if (!permissionIdObj) return

    permissionIdObj.disable = true

    if (!parentPermissionId) return

    const filters = `filter[main]=false&filter[module_app_id]=${currentFilters.value.moduleAppId}&filter[parent_permission_id]=${parentPermissionId}`
    permissionIdObj.placeholder = 'Cargando...'
    await _getResources({ user: ['submodules_app'] }, filters)
    permissionIdObj.placeholder = 'Seleccione'
    permissionIdObj.options = user_submodules.value
    permissionIdObj.disable = false
  }

  const listAction = async (filters: INullablePaginatedFiltersFormat) => {
    detailsTableProps.value.rows = []
    detailsTableProps.value.loading = true
    const res = await _listAction(filters)
    detailsTableProps.value.rows = res.list
    detailsTableProps.value.pages = res.pages
    detailsTableProps.value.loading = false
  }

  const handleClearFilters = () => {
    detailsTableProps.value.rows = []
  }

  const handleFilterSearch = async (
    rawFilters: INullablePaginatedFiltersFormat
  ) => {
    if (!preparatePayload(rawFilters)) return
    // List
    await listAction(filtersFormat.value)
  }

  const preparatePayload = (
    rawFilters: INullablePaginatedFiltersFormat
  ): boolean => {
    let dateRange: string | null = null
    const {
      'filter[date_from]': _dateFrom,
      'filter[date_to]': _dateTo,
      ...filters
    } = rawFilters

    if (filters['filter[role_name]'] === 'todos')
      filters['filter[role_name]'] = null

    if (_dateFrom || _dateTo) {
      if (!isValidFilterDate(_dateFrom?.toString(), _dateTo?.toString()))
        return false
      dateRange = `${_dateFrom},${_dateTo}`
    }

    filtersFormat.value = { 'filter[dateRange]': dateRange ?? null, ...filters }
    return true
  }

  const isValidFilterDate = (
    date_from?: string | null,
    date_to?: string | null
  ): boolean => {
    if (date_from && !date_to) {
      showAlert('Seleccione una fecha final para continuar', 'error')
      return false
    }
    if (date_to && !date_from) {
      showAlert('Seleccione una fecha inicial para continuar', 'error')
      return false
    }

    if (moment(date_from).isAfter(date_to)) {
      showAlert('La fecha inicial no puede ser mayor a la fecha final', 'error')
      return false
    }

    return true
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

  const userKeys: ResourceTypes = {
    user: ['roles', 'module_app'],
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(userKeys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({ ...userKeys })
  })

  return {
    // Refs and computed props
    filtersRef,
    headerConfig,
    filtersConfig,
    detailsTableProps,

    // Functions/Methods
    goToURL,
    validateRouter,
    handleUpdatePage,
    handleClearFilters,
    handleFilterSearch,
    handleUpdateRowsPerPage,
  }
}

export default useAuditEntryOfFunctionalities
