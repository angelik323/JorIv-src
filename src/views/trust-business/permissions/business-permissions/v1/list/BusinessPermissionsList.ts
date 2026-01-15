// Vue - pinia
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IUserPermissionListItem } from '@/interfaces/customs/trust-business/Permissions'

// Composables
import { useRules, useMainLoader, useRouteValidator } from '@/composables'
import { createAndDownloadBlobByArrayBuffer } from '@/utils'

// Stores
import { useBusinessPermissionsStore } from '@/stores/trust-business/permissions/business-permissions'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBusinessPermissionsList = () => {
  const { _getUserListByBusiness, _downloadUsersByBusiness, _clearData } =
    useBusinessPermissionsStore('v1')
  const { user_list_by_business, user_list_pages } = storeToRefs(
    useBusinessPermissionsStore('v1')
  )

  const { business_trusts_with_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { is_required } = useRules()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const headerProps = {
    title: 'Permisos por negocio',
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
    ],
  }

  const tableProps = ref({
    title: 'Listado de usuarios por negocio',
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
  })

  const selectedBusiness = ref<number | null>(null)
  const filtersFormat = ref<{
    businessId?: number
    page: number
    rowsPerPage: number
  }>({
    page: 1,
    rowsPerPage: 20,
  })

  const listAction = async (filters: typeof filtersFormat.value) => {
    const { businessId, ...restFilters } = filters
    if (!businessId) return

    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getUserListByBusiness(businessId, {
      ...restFilters,
      'filter[has_permission]': true,
    })

    tableProps.value.loading = false
  }

  const handleFilter = async () => {
    if (!selectedBusiness.value) return

    filtersFormat.value = {
      businessId: Number(selectedBusiness.value),
      page: 1,
      rowsPerPage: filtersFormat.value.rowsPerPage,
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

  const downloadAction = async () => {
    const { businessId } = filtersFormat.value
    if (!businessId) return

    openMainLoader(true)

    const business = business_trusts_with_code.value.find(
      (item) => item.id === businessId
    )
    const businessName = business?.label || `negocio_${businessId}`

    const response = await _downloadUsersByBusiness(businessId)
    if (response) {
      const date = new Date().toISOString().slice(0, 10)
      const sanitizedName = businessName.replace(/[^a-zA-Z0-9_-]/g, '_')
      const fileName = `Permisos_por_negocio_${sanitizedName}_${date}.xlsx`
      createAndDownloadBlobByArrayBuffer(response, fileName)
    }

    openMainLoader(false)
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources({ trust_business: ['business_trusts'] })
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys({
      trust_business: ['business_trusts', 'business_trusts_with_code'],
    })
  })

  watch(
    user_list_by_business,
    () => {
      tableProps.value.rows = [...user_list_by_business.value]

      const { currentPage, lastPage } = user_list_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    selectedBusiness,
    () => {
      _clearData()
    },
    { deep: true }
  )

  return {
    business_trusts_with_code,
    headerProps,
    tableProps,
    selectedBusiness,

    is_required,
    handleFilter,
    updatePage,
    updateRowsPerPage,
    downloadAction,
    validateRouter,
  }
}

export default useBusinessPermissionsList
