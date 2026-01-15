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
import { useGoToUrl, useMainLoader, useRules, useAlert } from '@/composables'

// Stores
import {
  useResourceManagerStore,
  useUserResourceStore,
} from '@/stores/resources-manager'
import { useAuditEntryOfFunctionalitiesStore } from '@/stores/audit/audit-entry-of-functionalities'

// Constants

const useAuditEntryOfFunctionalitiesEdit = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { is_required } = useRules()
  const { showAlert } = useAlert()

  const { _getModulesListAction, _updateConfidential } =
    useAuditEntryOfFunctionalitiesStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { user_modules } = storeToRefs(useUserResourceStore('v1'))

  const headerConfig = {
    title: 'Configurar auditoría de ingreso de información confidencial',
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
        label: 'Consultar auditoría de ingreso a funcionalidades',
        route: 'AuditEntryOfFunctionalitiesList',
      },
      {
        label: 'Configurar auditoría de ingreso de información confidencial',
        route: 'AuditEntryOfFunctionalitiesEdit',
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
      label: 'Buscador',
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
    title: 'Editar configuraciones de funcionalidades a auditar',
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
    rows: [] as IAuditEntryFunctionalitiesModule[],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableCustomCols = ['module']

  const originalPermissionIds = ref<number[]>([])
  const originalHasPermission = ref<boolean[]>([])

  const isEnabledUpdateBtn = computed<boolean>(() => {
    return tableProps.value.rows.length > 0
  })

  // Functions/Methods
  const mapPermissionArrays = (modules: IAuditEntryFunctionalitiesModule[]) => {
    const permissionsIds: number[] = []
    const hasPermissions: boolean[] = []

    const [firstModule] = modules

    if (!firstModule) return { permissionsIds, hasPermissions }

    firstModule.submodule.forEach((sub) => {
      permissionsIds.push(sub.id)
      hasPermissions.push(sub.is_confidential)

      sub.actions.forEach((action) => {
        permissionsIds.push(action.id)
        hasPermissions.push(action.is_confidential)
      })
    })

    return { permissionsIds, hasPermissions }
  }

  const setOriginalPermmissions = (
    modules: IAuditEntryFunctionalitiesModule[]
  ) => {
    const { permissionsIds, hasPermissions } = mapPermissionArrays(modules)

    originalPermissionIds.value = permissionsIds
    originalHasPermission.value = hasPermissions
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
    hasPermissions: boolean[],
    changes: boolean[]
  ) => {
    const confidential_permissions: number[] = []
    const confidentials: boolean[] = []

    changes.forEach((change, idx) => {
      if (!change) return

      confidential_permissions.push(permissionsIds[idx])
      confidentials.push(hasPermissions[idx])
    })

    return { confidential_permissions, confidentials }
  }

  const handleUpdateClick = async () => {
    const { permissionsIds, hasPermissions } = mapPermissionArrays(
      tableProps.value.rows
    )

    const permissionsChanges = setHasPermissionsChangedArr(
      originalHasPermission.value,
      hasPermissions
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

    const payload = buildPayload(
      permissionsIds,
      hasPermissions,
      permissionsChanges
    )

    openMainLoader(true)
    const success = await _updateConfidential(payload)
    openMainLoader(false)

    if (success) handleGoToList()
  }

  const handleGoToList = () => goToURL('AuditEntryOfFunctionalitiesList')

  const listAction = async (filters: IPaginatedFiltersFormat) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const res = await _getModulesListAction(filters)

    tableProps.value.rows = res.list.map((module) => ({
      ...module,
      selected: module.submodule.every((sub) => sub.is_confidential === true),
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
      sub.is_confidential = value
      sub.actions.forEach((action) => {
        action.is_confidential = value
      })
    })
  }

  const toggleSubmodule = (
    module: IAuditEntryFunctionalitiesModule,
    submodule: IAuditEntryFunctionalitiesSubmodule,
    value: boolean
  ) => {
    submodule.is_confidential = value

    submodule.actions.forEach((action) => {
      action.is_confidential = value
    })

    module.selected = module.submodule.every((sub) => sub.is_confidential)
  }

  const toggleAction = (
    module: IAuditEntryFunctionalitiesModule,
    submodule: IAuditEntryFunctionalitiesSubmodule,
    action: IAuditEntryFunctionalitiesAction,
    value: boolean
  ) => {
    action.is_confidential = value

    submodule.is_confidential = submodule.actions.every(
      (action) => action.is_confidential
    )

    module.selected = module.submodule.every((sub) => sub.is_confidential)
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
    handleUpdateClick,
    handleGoToList,
    handleClearFilters,
    handleFilterSearch,
    toggleModule,
    toggleSubmodule,
    toggleAction,
  }
}

export default useAuditEntryOfFunctionalitiesEdit
