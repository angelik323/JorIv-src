// Vue - pinia - router
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import router from '@/router'

// Interfaces
import { QTable } from 'quasar'
import {
  IUserPermissionListItem,
  IUserPermissionRowSelection,
  IManagePermissionsByBusiness,
} from '@/interfaces/customs/trust-business/Permissions'

// Composables
import { useRules, useMainLoader, useAlert, useTable, useRouteValidator } from '@/composables'

// Stores
import { useBusinessPermissionsStore } from '@/stores/trust-business/permissions/business-permissions'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBusinessPermissionsCreate = () => {
  const { _managePermissionsByBusiness, _getUserListByBusiness, _clearData } =
    useBusinessPermissionsStore('v1')
  const { user_list_by_business, user_list_pages } = storeToRefs(
    useBusinessPermissionsStore('v1')
  )

  const { business_trusts_with_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { users_with_document } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { is_required, only_alphanumeric } = useRules()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { validateRouter } = useRouteValidator()
  const route = useRoute()

  const headerProps = {
    title: 'Gestionar permisos por negocio',
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
        label: 'Permisos por negocio',
        route: 'BusinessPermissionsList',
      },
      {
        label: 'Negocio',
        route: 'BusinessPermissionsList',
      },
      {
        label: 'Crear',
        route: 'BusinessPermissionsCreate',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de usuarios',
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
        name: 'name',
        field: (row) => {
          const document = row.document ?? 'No registra'
          const name = row.name ?? 'No registra'
          const lastName = row.last_name ?? ''
          return `${document} - ${name} ${lastName}`
        },
        required: true,
        label: 'Código y nombre de usuario',
        align: 'left',
        sortable: true,
      },
      {
        name: 'has_permission',
        field: (row) => (row.has_permission ? 'Si' : 'No'),
        required: true,
        label: 'Tiene permisos',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IUserPermissionListItem[],
    pages: user_list_pages.value,
    wrapCells: true,
  })

  const { updateRowById } = useTable(tableProps)

  const formElementRef = ref()
  const tableListRef = ref()
  const selectedBusiness = ref<number | null>(null)
  const selectedUser = ref<number | null>(null)
  const userSearch = ref<string | null>(null)
  const selectedRows = ref<IUserPermissionListItem[]>([])

  // Almacena temporalmente los cambios de permisos antes de guardarlos en el backend
  const pendingPermissions = ref<Map<number, boolean>>(new Map())

  const filtersFormat = ref<{
    businessId?: number
    page: number
    rowsPerPage: number
    'filter[search]': string | null
    'filter[id]'?: number | null
  }>({
    page: 1,
    rowsPerPage: 20,
    'filter[search]': null,
  })

  const listAction = async (filters: typeof filtersFormat.value) => {
    const { businessId, ...restFilters } = filters
    if (!businessId) return

    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getUserListByBusiness(businessId, restFilters)

    tableProps.value.loading = false
  }

  const handleFilter = async () => {
    if (!(await formElementRef.value?.validate())) return
    if (!selectedBusiness.value) return

    filtersFormat.value.page = 1
    if (selectedUser.value) {
      filtersFormat.value['filter[id]'] = selectedUser.value
      filtersFormat.value['filter[search]'] = null
    } else {
      filtersFormat.value['filter[id]'] = null
      filtersFormat.value['filter[search]'] = userSearch.value?.trim() || null
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    if (!filtersFormat.value.businessId) return

    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    if (!filtersFormat.value.businessId) return

    filtersFormat.value.page = 1
    filtersFormat.value.rowsPerPage = rowsPerPage

    await listAction(filtersFormat.value)
  }

  const handleRowSelection = async (selection: IUserPermissionRowSelection) => {
    const { selected } = selection
    if (!selected) return

    selectedRows.value = selected
  }

  const makeDataRequest = () => {
    const apiRequestBody: IManagePermissionsByBusiness = {
      users: Array.from(pendingPermissions.value.entries()).map(
        ([user_id, has_permission]) => ({
          user_id,
          has_permission,
        })
      ),
    }

    return apiRequestBody
  }

  const onManagePermissions = (action: 'add' | 'remove') => {
    if (!selectedRows.value) return

    const hasPermission = action === 'add'
    const message = hasPermission
      ? 'Se han dado los permisos exitosamente'
      : 'Se han quitado los permisos exitosamente'

    selectedRows.value.forEach((row) => {
      // Actualización de permisos pendientes por guardar y tabla
      pendingPermissions.value.set(row.id, hasPermission)
      updateRowById(row.id, { has_permission: hasPermission })
    })

    showAlert(message, 'success', undefined, 5000)
    tableListRef.value?.clearSelection()
    selectedRows.value = []
  }

  const onSubmit = async () => {
    if (pendingPermissions.value.size === 0) return

    const businessId = Number(selectedBusiness.value)
    const payload = makeDataRequest()

    openMainLoader(true)
    const success = await _managePermissionsByBusiness(businessId, payload)

    if (success) {
      pendingPermissions.value.clear()
      tableListRef.value?.clearSelection()
      selectedRows.value = []

      router.push({ name: 'BusinessPermissionsList' })
    }

    openMainLoader(false)
  }

  onMounted(async () => {
    _clearData()

    const paramId = +route.params.id
    if (!paramId) return

    selectedBusiness.value = paramId
    filtersFormat.value.businessId = paramId

    await Promise.all([
      _getResources(
        { trust_business: ['business_trusts', 'users'] },
        `filter[business_id]=${selectedBusiness.value}`
      ),
      listAction(filtersFormat.value),
    ])
  })

  onBeforeUnmount(() => {
    _resetKeys({
      trust_business: [
        'business_trusts',
        'business_trusts_with_code',
        'users',
        'users_with_document',
      ],
    })
  })

  watch(
    user_list_by_business,
    (value) => {
      const updatedRows = value.map((row) => {
        // Verifica si el usuario ha hecho cambios pendientes por guardar en los permisos
        const pending = pendingPermissions.value.get(row.id)
        return pending !== undefined ? { ...row, has_permission: pending } : row
      })

      tableProps.value.rows = updatedRows

      const { currentPage, lastPage } = user_list_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(selectedBusiness, () => _clearData(), { deep: true })

  return {
    business_trusts_with_code,
    users_with_document,
    headerProps,
    tableProps,
    formElementRef,
    tableListRef,
    selectedBusiness,
    selectedUser,
    userSearch,
    selectedRows,
    pendingPermissions,

    is_required,
    only_alphanumeric,
    handleFilter,
    updatePage,
    updateRowsPerPage,
    handleRowSelection,
    onManagePermissions,
    onSubmit,
    validateRouter,
  }
}

export default useBusinessPermissionsCreate
