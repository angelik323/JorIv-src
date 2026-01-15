// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IBusinessPermissionListItem } from '@/interfaces/customs/trust-business/Permissions'

// Composables
import { useRules, useMainLoader, useRouteValidator } from '@/composables'

// Stores
import { useUserPermissionsStore } from '@/stores/trust-business/permissions/user-permissions'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useUserPermissionsList = () => {
  const { _getBusinessListByUser, _clearData } = useUserPermissionsStore('v1')
  const { business_list_by_user, business_list_pages } = storeToRefs(
    useUserPermissionsStore('v1')
  )

  const { users_with_document } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { is_required } = useRules()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const headerProps = {
    title: 'Permisos por usuario',
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
    ],
  }

  const tableProps = ref({
    title: 'Listado de negocios por usuario',
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
  })

  const selectedUser = ref<number | null>(null)
  const filtersFormat = ref<{
    userId?: number
    page: number
    rowsPerPage: number
  }>({
    page: 1,
    rowsPerPage: 20,
  })

  const listAction = async (filters: typeof filtersFormat.value) => {
    const { userId, ...restFilters } = filters
    if (!userId) return

    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getBusinessListByUser(userId, {
      ...restFilters,
      'filter[has_permission]': true,
    })

    tableProps.value.loading = false
  }

  const handleFilter = async () => {
    if (!selectedUser.value) return

    filtersFormat.value = {
      userId: Number(selectedUser.value),
      page: 1,
      rowsPerPage: filtersFormat.value.rowsPerPage,
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

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources({ trust_business: ['users'] })
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      trust_business: ['users', 'users_with_document'],
    })
  })

  watch(
    business_list_by_user,
    () => {
      tableProps.value.rows = [...business_list_by_user.value]

      const { currentPage, lastPage } = business_list_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    selectedUser,
    () => {
      _clearData()
    },
    { deep: true }
  )

  return {
    users_with_document,
    headerProps,
    tableProps,
    selectedUser,

    is_required,
    handleFilter,
    updatePage,
    updateRowsPerPage,
    validateRouter,
  }
}

export default useUserPermissionsList
