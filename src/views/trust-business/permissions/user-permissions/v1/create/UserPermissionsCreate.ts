// Vue - pinia - router
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import router from '@/router'

// Interfaces
import { QTable } from 'quasar'
import {
  IBusinessPermissionListItem,
  IBusinessPermissionRowSelection,
  IManagePermissionsByUser,
} from '@/interfaces/customs/trust-business/Permissions'

// Composables
import { useRules, useMainLoader, useAlert, useTable, useRouteValidator } from '@/composables'

// Stores
import { useUserPermissionsStore } from '@/stores/trust-business/permissions/user-permissions'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useUserPermissionsCreate = () => {
  const { _managePermissionsByUser, _getBusinessListByUser, _clearData } =
    useUserPermissionsStore('v1')
  const { business_list_by_user, business_list_pages } = storeToRefs(
    useUserPermissionsStore('v1')
  )

  const { users_with_document } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { business_trusts_with_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { is_required, only_alphanumeric } = useRules()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { validateRouter } = useRouteValidator()
  const route = useRoute()

  const headerProps = {
    title: 'Gestionar permisos por usuario',
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
        label: 'Permisos por usuario',
        route: 'UserPermissionsList',
      },
      {
        label: 'Usuario',
        route: 'UserPermissionsList',
      },
      {
        label: 'Crear',
        route: 'UserPermissionsCreate',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de negocios',
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
          const code = row.code ?? 'No registra'
          const name = row.name ?? 'No registra'
          return `${code} - ${name}`
        },
        required: true,
        label: 'Código y nombre de negocio',
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
    rows: [] as IBusinessPermissionListItem[],
    pages: business_list_pages.value,
    wrapCells: true,
  })

  const { updateRowById } = useTable(tableProps)

  const formElementRef = ref()
  const tableListRef = ref()
  const selectedUser = ref<number | null>(null)
  const selectedBusiness = ref<number | null>(null)
  const businessSearch = ref<string | null>(null)
  const selectedRows = ref<IBusinessPermissionListItem[]>([])

  // Almacena temporalmente los cambios de permisos antes de guardarlos en el backend
  const pendingPermissions = ref<Map<number, boolean>>(new Map())

  const filtersFormat = ref<{
    userId?: number
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
    const { userId, ...restFilters } = filters
    if (!userId) return

    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getBusinessListByUser(userId, restFilters)

    tableProps.value.loading = false
  }

  const handleFilter = async () => {
    if (!(await formElementRef.value?.validate())) return
    if (!selectedUser.value) return

    filtersFormat.value.page = 1
    // Si se seleccionó un negocio, filtrar por id; si no, usar búsqueda por texto
    if (selectedBusiness.value) {
      filtersFormat.value['filter[id]'] = selectedBusiness.value
      filtersFormat.value['filter[search]'] = null
    } else {
      filtersFormat.value['filter[id]'] = null
      filtersFormat.value['filter[search]'] =
        businessSearch.value?.trim() || null
    }

    await listAction(filtersFormat.value)
  }

  const updatePage = async (page: number) => {
    if (!filtersFormat.value.userId) return

    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    if (!filtersFormat.value.userId) return

    filtersFormat.value.page = 1
    filtersFormat.value.rowsPerPage = rowsPerPage

    await listAction(filtersFormat.value)
  }

  const handleRowSelection = async (
    selection: IBusinessPermissionRowSelection
  ) => {
    const { selected } = selection
    if (!selected) return

    selectedRows.value = selected
  }

  const makeDataRequest = () => {
    const apiRequestBody: IManagePermissionsByUser = {
      business: Array.from(pendingPermissions.value.entries()).map(
        ([business_id, has_permission]) => ({
          business_id,
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

    const userId = Number(selectedUser.value)
    const payload = makeDataRequest()

    openMainLoader(true)
    const success = await _managePermissionsByUser(userId, payload)

    if (success) {
      pendingPermissions.value.clear()
      tableListRef.value?.clearSelection()
      selectedRows.value = []

      router.push({ name: 'UserPermissionsList' })
    }

    openMainLoader(false)
  }

  onMounted(async () => {
    _clearData()

    const paramId = +route.params.id
    if (!paramId) return

    selectedUser.value = paramId
    filtersFormat.value.userId = paramId

    await Promise.all([
      _getResources(
        { trust_business: ['users', 'business_trusts'] },
        `filter[id]=${selectedUser.value}`
      ),
      listAction(filtersFormat.value),
    ])
  })

  onBeforeUnmount(() => {
    _resetKeys({
      trust_business: ['users', 'users_with_document', 'business_trusts'],
    })
  })

  watch(
    business_list_by_user,
    (value) => {
      const updatedRows = value.map((row) => {
        // Verifica si el usuario ha hecho cambios pendientes por guardar en los permisos
        const pending = pendingPermissions.value.get(row.id)
        return pending !== undefined ? { ...row, has_permission: pending } : row
      })

      tableProps.value.rows = updatedRows

      const { currentPage, lastPage } = business_list_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(selectedUser, () => _clearData(), { deep: true })

  return {
    users_with_document,
    business_trusts_with_code,
    headerProps,
    tableProps,
    formElementRef,
    tableListRef,
    selectedUser,
    selectedBusiness,
    businessSearch,
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

export default useUserPermissionsCreate
