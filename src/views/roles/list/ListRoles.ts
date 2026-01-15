// Vue & utils:
import {
  defaultIconsLucide,
  formatParamsCustom,
  returnArrayRulesValidation,
} from '@/utils'
import { onMounted, ref, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Composables
import { useMainLoader, useRouteValidator } from '@/composables'

// Interfaces
import { IRowRoles, IPermissionRole } from '@/interfaces/customs'

// Stores
import { useResourcesStore, useResourceStore, useRolesModule } from '@/stores'

// Assets

const useRolList = () => {
  const router = useRouter()

  const {
    _getList,
    _changeStatusRegister,
    _downloadRegisters,
    _setUrlExportXlsx,
  } = useRolesModule()

  const { getResources } = useResourcesStore()

  const {
    urlExportXlsx,
    rolesCount,
    rolesList,
    pages,
    firtsTime,
    formDataRole,
  } = storeToRefs(useRolesModule())
  const { status } = storeToRefs(useResourceStore('v1'))

  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const rowInfo = ref<IRowRoles>()

  const tableProperties = ref({
    title: 'Listado de roles',
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
        name: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
        style: {
          'max-width': '250px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'status',
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
    rows: [] as typeof rolesList.value,
    pages: pages,
    wrapCells: true,
  })

  // filters
  const filterConfig = ref([
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: 0,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6 q-py-md',
      options: status.value,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },

    {
      name: 'name',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6 q-py-md',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por nombre',
    },
  ])

  const filtersFormat = ref<Record<string, string | number>>({})

  const handleFilter = ($filters: {
    'filter[status_id]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '?' + queryString : '')
  }

  const handleClearFilters = () => {
    tableProperties.value.rows = []
    _setUrlExportXlsx(null)
    for (const key in filtersFormat.value) filtersFormat.value[key] = ''
    for (const key in statsProps.value) statsProps.value[key].count = 0
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '?' + queryString : '')
  }

  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '?' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getList(filters)
    tableProperties.value.loading = false
    setStatsProps()
  }

  const cleanStore = () => {
    firtsTime.value = 0
    formDataRole.value = {
      name: null,
      description: null,
      priority_level: null,
      authorization_level_id: null,
      permissions: [] as IPermissionRole | any,
      is_schedule_restricted: false,
      schedule_start_hour: null,
      schedule_end_hour: null,
      has_expiration: null,
      expired_months: null,
      requires_mfa: false,
      mfa_duration_months: null,
      has_password_policy: false,
      password_expiration_days: null,
    }
  }

  // modal
  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const createHeaderProperties = (
    title: string,
    subtitle: string,
    extraBreadcrumb?: {
      label: string | number | any
      route?: string
    },
    extraBreadcrumbTwo?: {
      label: string | number | any
      route?: string
    }
  ) => {
    const breadcrumbs = [
      {
        label: 'Usuarios',
      },
      {
        label: 'Roles',
        route: 'RolesList',
      },
    ]

    if (extraBreadcrumb) {
      breadcrumbs.push(extraBreadcrumb)
    }
    if (extraBreadcrumbTwo) {
      breadcrumbs.push(extraBreadcrumbTwo)
    }

    return {
      title,
      subtitle,
      breadcrumbs,
      btn: {
        label: 'Crear',
        icon: 'mdi-plus-circle-outline',
      },
    }
  }

  const headerProperties = createHeaderProperties('Gestión de Roles', '')

  // cards
  const statsProps = ref()

  const setStatsProps = () => {
    statsProps.value = [
      {
        count: rolesCount.value?.total ?? 0,
        image: defaultIconsLucide.accountMultiple,
        label: 'Total',
      },
      {
        count: rolesCount.value?.active ?? 0,
        image: defaultIconsLucide.accountCheck,
        label: 'Activos',
      },
      {
        count: rolesCount.value?.inactive ?? 0,
        image: defaultIconsLucide.accountOff,
        label: 'Inactivos',
      },
    ]
  }
  const clearStatsProps = () => {
    statsProps.value = [
      {
        count: 0,
        image: defaultIconsLucide.accountMultiple,
        label: 'Total',
      },
      {
        count: 0,
        image: defaultIconsLucide.accountCheck,
        label: 'Activos',
      },
      {
        count: 0,
        image: defaultIconsLucide.accountOff,
        label: 'Inactivos',
      },
    ]
  }

  const changeStatus = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    await _changeStatusRegister(alertModalConfig.value.entityId, null)
    filtersFormat.value = {
      ...filtersFormat.value,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '?' + queryString : '')
    alertModalConfig.value.entityId = null
    openMainLoader(false)
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el rol?`
  }

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const handlerAction = async (action: string, row?: IRowRoles | any) => {
    alertModalConfig.value.entityId = null
    rowInfo.value = row
    switch (action) {
      case 'edit':
        router.push({ name: 'EditRoles', params: { id: row?.id } })
        break

      case 'view':
        router.push({ name: 'ViewRoles', params: { id: row?.id } })
        break

      case 'download':
        filtersFormat.value = {
          ...filtersFormat.value,
        }
        const queryString = formatParamsCustom(filtersFormat.value)
        _downloadRegisters(queryString ? '&' + queryString : '')

        break

      default:
        break
    }
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  // onMounted
  onBeforeMount(async () => {
    await getResources('keys[]=module_app&keys[]=authorization_level')
  })

  onMounted(() => {
    cleanStore()
    clearStatsProps()
  })

  watch(
    () => rolesList.value,
    () => {
      tableProperties.value.rows = [...rolesList.value]
    }
  )

  rolesList

  return {
    tableProperties,
    urlExportXlsx,
    statsProps,
    rolesList,
    alertModalRef,
    alertModalConfig,
    filterConfig,
    headerProperties,

    openAlertModal,
    changeStatus,
    listAction,
    handlerGoTo,
    handlerAction,
    handleClearFilters,
    handleFilter,
    updatePage,
    updateRows,
    returnArrayRulesValidation,
    validateRouter,
  }
}

export default useRolList
