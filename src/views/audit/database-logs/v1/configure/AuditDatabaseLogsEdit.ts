// Vue - pinia - moment
import { ref, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import {
  IFieldFilters,
  IPaginatedFiltersFormat,
  ResourceTypes,
} from '@/interfaces/customs'
import {
  IAuditEntryFunctionalitiesAction,
  IAuditEntryFunctionalitiesModule,
  IAuditEntryFunctionalitiesSubmodule,
} from '@/interfaces/customs/audit/AuditEntryOfFunctionalities'

// Components

// Composables
import { useRules, useGoToUrl, useMainLoader, useAlert } from '@/composables'

// Stores
import {
  useResourceManagerStore,
  useUserResourceStore,
} from '@/stores/resources-manager'
import { useAuditEntryOfFunctionalitiesStore } from '@/stores/audit/audit-entry-of-functionalities'
import { useDatabaseLogsStore } from '@/stores/audit/database-logs'

// Constants

const useAuditDatabaseLogsEdit = () => {
  const { is_required } = useRules()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { user_modules } = storeToRefs(useUserResourceStore('v1'))

  const { _getModulesListAction } = useAuditEntryOfFunctionalitiesStore('v1')
  const { _updateHasLogs } = useDatabaseLogsStore('v1')

  const headerConfig = {
    title: 'Configuración log de bases de datos',
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
      {
        label: 'Configuración log de bases de datos',
        route: 'AuditDatabaseLogsEdit',
      },
    ],
  }

  // Refs and computed props
  const filtersFormat = ref<IPaginatedFiltersFormat>({ page: 1, rows: 20 })

  const filtersConfig = ref<IFieldFilters[]>([
    {
      name: 'id',
      type: 'q-select',
      class: 'col-12',
      label: 'Módulo*',
      placeholder: 'Seleccione',
      value: null,
      clean_value: true,
      disable: false,
      options: user_modules,
      autocomplete: true,
      rules: [(v) => is_required(v)],
    },
  ])

  const tableProps = ref<IBaseTableProps<IAuditEntryFunctionalitiesModule>>({
    title: 'Configurar funcionalidades a auditar',
    loading: false,
    columns: [
      {
        name: 'module',
        field: 'id',
        label: 'module',
        sortable: true,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableCustomCols = ['module']

  const originalPermissionIds = ref<number[]>([])
  const originalHasLogs = ref<boolean[]>([])

  const isEnabledUpdateBtn = computed<boolean>(() => {
    return tableProps.value.rows.length > 0
  })

  // Functions/Methods
  const handleGoToList = () => goToURL('AuditDatabaseLogsList')

  const mapPermissionArrays = (modules: IAuditEntryFunctionalitiesModule[]) => {
    const permissionsIds: number[] = []
    const hasLogs: boolean[] = []

    const [firstModule] = modules

    if (!firstModule) return { permissionsIds, hasLogs }

    firstModule.submodule.forEach((sub) => {
      permissionsIds.push(sub.id)
      hasLogs.push(sub.has_logs)

      sub.actions.forEach((action) => {
        permissionsIds.push(action.id)
        hasLogs.push(action.has_logs)
      })
    })

    return { permissionsIds, hasLogs }
  }

  const setOriginalPermmissions = (
    modules: IAuditEntryFunctionalitiesModule[]
  ) => {
    const { permissionsIds, hasLogs } = mapPermissionArrays(modules)

    originalPermissionIds.value = permissionsIds
    originalHasLogs.value = hasLogs
  }

  const listAction = async (filters: IPaginatedFiltersFormat) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const res = await _getModulesListAction(filters, true)

    tableProps.value.rows = res.list.map((module) => ({
      ...module,
      selected: module.submodule.every((sub) => sub.has_logs === true),
    }))

    setOriginalPermmissions(res.list)

    tableProps.value.pages = res.pages
    tableProps.value.loading = false
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
  }

  const handleFilterSearch = async (filters: IPaginatedFiltersFormat) => {
    filtersFormat.value = {
      ...filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const toggleModule = (
    module: IAuditEntryFunctionalitiesModule,
    value: boolean
  ) => {
    module.selected = value

    module.submodule.forEach((sub) => {
      sub.has_logs = value
      sub.actions.forEach((action) => {
        action.has_logs = value
      })
    })
  }

  const toggleSubmodule = (
    module: IAuditEntryFunctionalitiesModule,
    submodule: IAuditEntryFunctionalitiesSubmodule,
    value: boolean
  ) => {
    submodule.has_logs = value

    submodule.actions.forEach((action) => {
      action.has_logs = value
    })

    module.selected = module.submodule.every((sub) => sub.has_logs)
  }

  const toggleAction = (
    module: IAuditEntryFunctionalitiesModule,
    submodule: IAuditEntryFunctionalitiesSubmodule,
    action: IAuditEntryFunctionalitiesAction,
    value: boolean
  ) => {
    action.has_logs = value

    submodule.has_logs = submodule.actions.every((action) => action.has_logs)

    module.selected = module.submodule.every((sub) => sub.has_logs)
  }

  const setHasPermissionsChangedArr = (
    orginal: boolean[],
    updated: boolean[]
  ): boolean[] | null => {
    if (orginal.length !== updated.length) return null

    const result: boolean[] = []

    orginal.forEach((value, idx) => {
      result.push(value !== updated[idx])
    })

    return result
  }

  const buildPayload = (
    permissionsIds: number[],
    hasLogs: boolean[],
    changes: boolean[]
  ) => {
    const has_logs_permissions: number[] = []
    const has_logs: boolean[] = []

    changes.forEach((change, idx) => {
      if (!change) return

      has_logs_permissions.push(permissionsIds[idx])
      has_logs.push(hasLogs[idx])
    })

    return { has_logs_permissions, has_logs }
  }

  const handleUpdateClick = async () => {
    const { permissionsIds, hasLogs } = mapPermissionArrays(
      tableProps.value.rows
    )

    const permissionsChanges = setHasPermissionsChangedArr(
      originalHasLogs.value,
      hasLogs
    )

    if (!permissionsChanges) {
      showAlert(
        'Hubo un problema al calcular la actualización de permisos',
        'error'
      )
      return
    }

    if (permissionsChanges.every((per) => per === false)) {
      showAlert('Se debe modificar al menos una funcionalidad', 'info')
      return
    }

    const payload = buildPayload(permissionsIds, hasLogs, permissionsChanges)

    openMainLoader(true)
    const success = await _updateHasLogs(payload)
    openMainLoader(false)

    if (success) handleGoToList()
  }

  // Watchers

  // Life cycle hooks

  const userKeys: ResourceTypes = {
    user: ['module_app'],
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(userKeys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(userKeys))

  return {
    // composable refs and variables
    // composable functions

    // Refs and computed props
    headerConfig,
    filtersConfig,
    tableProps,
    tableCustomCols,
    isEnabledUpdateBtn,

    // Functions/Methods
    handleGoToList,
    handleClearFilters,
    handleFilterSearch,
    toggleModule,
    toggleSubmodule,
    toggleAction,
    handleUpdateClick,
  }
}

export default useAuditDatabaseLogsEdit
