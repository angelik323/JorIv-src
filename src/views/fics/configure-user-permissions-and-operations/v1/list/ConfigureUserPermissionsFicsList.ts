// Vue - Vue Router - Pinia
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import {
  ref,
  watch,
  computed,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
} from 'vue'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { ITabs, StatusID } from '@/interfaces/global'
import {
  IOfficePermission,
  IOperationPermission,
  ICollectiveInvestmentFund,
} from '@/interfaces/customs/fics/ConfigureUserPermissions'

// Composables
import { useAlert, useAlertModal, useMainLoader, useUtils } from '@/composables'

// Stores
import { useConfigureUserPermissionsFicsStore } from '@/stores/fics/configure-user-permissions-fics-and-operations'
import { useUserResourceStore } from '@/stores/resources-manager/users'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useConfigureUserPermissionsList = () => {
  const { showAlertInformationWithCustomInputSelect } = useAlertModal()
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { funds, regions } = storeToRefs(useFicResourceStore('v1'))
  const { users } = storeToRefs(useUserResourceStore('v1'))

  const configureUserPermissionsFicsStore =
    useConfigureUserPermissionsFicsStore('v1')

  const selectedRow = ref<PermissionRow | null>(null)
  const rowToDelete = ref<PermissionRow | null>(null)
  const selectedUser = ref<number | null>(null)
  const selectedOfficeIds = ref<number[]>([])
  const assignOfficeModalRef = ref()
  const deleteModalRef = ref()
  const alertModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Está seguro que desea cambiar el estado de este permiso?',
  })

  const deleteModalConfig = ref({
    description: '¿Está seguro que desea eliminar este permiso?',
  })

  type PermissionRow =
    | ICollectiveInvestmentFund
    | IOfficePermission
    | IOperationPermission

  type UserFilter = {
    page: number
    rows: number
    'filter[user_id]': number | null
  }

  const perPageFunds = ref(20)
  const filtersFunds = ref<UserFilter>({
    page: 1,
    rows: perPageFunds.value,
    'filter[user_id]': null,
  })

  const perPageOffice = ref(20)
  const filtersOffice = ref<UserFilter>({
    page: 1,
    rows: perPageOffice.value,
    'filter[user_id]': null,
  })

  const perPageOperation = ref(20)
  const filtersOperation = ref<UserFilter>({
    page: 1,
    rows: perPageOperation.value,
    'filter[user_id]': null,
  })

  const headerProperties = {
    title: 'Configurar permisos por usuario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Configurar permisos por usuario',
        route: 'ConfigureUserPermissionsFicsList',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'user_id',
      label: 'Usuario',
      type: 'q-select',
      value: null,
      options: users,
      class: 'col-md-12',
      disable: false,
      clean_value: true,
      placeholder: 'Buscar usuario*',
      autocomplete: true,
    },
  ])

  const tablePermissionsFundsByUser = ref({
    title: 'Permisos fondos por usuario',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'funds',
        required: true,
        label: 'Fondo',
        align: 'left',
        field: (row) => row.permissible?.fund_code || '',
        sortable: true,
      },
      {
        name: 'funds_description',
        required: true,
        label: 'Descripción de fondo',
        align: 'left',
        field: (row) => row.permissible?.fund_name || '',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: true,
        format: (val: number) =>
          val === StatusID.ACTIVE ? 'Activo' : 'Inactivo',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as ICollectiveInvestmentFund[],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tablePermissionsByOffice = ref({
    title: 'Permisos por oficina',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'region',
        required: true,
        label: 'Región',
        align: 'left',
        field: (row) => row.permissible?.office_code || '',
        sortable: true,
      },
      {
        name: 'office',
        required: true,
        label: 'Oficina',
        align: 'left',
        field: (row) => row.permissible?.office_description || '',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: true,
        format: (val: number) =>
          val === StatusID.ACTIVE ? 'Activo' : 'Inactivo',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IOfficePermission[],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tableMonetaryOperationsPermits = ref({
    title: 'Permisos por operación',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'operation_code',
        required: true,
        label: 'Código operación',
        align: 'left',
        field: (row) => row.permissible?.code || '',
        sortable: true,
      },
      {
        name: 'operation_description',
        required: true,
        label: 'Descripción de la operación',
        align: 'left',
        field: (row) => row.permissible?.description || '',
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status_id',
        sortable: true,
        format: (val: number) =>
          val === StatusID.ACTIVE ? 'Activo' : 'Inactivo',
      },
    ] as QTable['columns'],
    rows: [] as IOperationPermission[],
    pages: {
      currentPage: 1,
      lastPage: 1,
      rowsPerPage: 20,
      rowsNumber: 0,
    },
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleFilter = async (
    filters: Record<string, string | number | null>
  ) => {
    const userId = filters?.['filter[user_id]'] ?? null

    selectedUser.value = userId ? Number(userId) : null

    filtersFunds.value['filter[user_id]'] = selectedUser.value
    filtersOffice.value['filter[user_id]'] = selectedUser.value
    filtersOperation.value['filter[user_id]'] = selectedUser.value
  }

  const handleClear = async () => {
    selectedUser.value = null

    filtersFunds.value['filter[user_id]'] = null
    filtersOffice.value['filter[user_id]'] = null
    filtersOperation.value['filter[user_id]'] = null
  }

  const updatePage = async (
    table: 'funds' | 'office' | 'operation',
    page: number
  ) => {
    let filters
    let listAction: (params: string) => Promise<void>

    switch (table) {
      case 'funds':
        filters = filtersFunds
        filters.value.page = page
        listAction = async (params: string) =>
          await configureUserPermissionsFicsStore._listActionFundsPermission(
            params
          )
        break
      case 'office':
        filters = filtersOffice
        filters.value.page = page
        listAction = async (params: string) =>
          await configureUserPermissionsFicsStore._listActionOfficesPermission(
            params
          )
        break
      case 'operation':
        filters = filtersOperation
        filters.value.page = page
        listAction = async (params: string) =>
          await configureUserPermissionsFicsStore._listActionOperationType(
            params
          )
        break
    }

    const queryString = formatParamsCustom(filters.value)
    await listAction(queryString ? '&' + queryString : '')

    switch (table) {
      case 'funds':
        tablePermissionsFundsByUser.value.rows =
          configureUserPermissionsFicsStore.collective_investment_fund_list.map(
            (r) => ({
              ...r,
              fund_code: r.permissible?.fund_code ?? '',
              fund_name: r.permissible?.fund_name ?? '',
              status_id: r.status?.id ?? 0,
            })
          )
        const pagesFunds =
          configureUserPermissionsFicsStore.collective_investment_fund_pages
        tablePermissionsFundsByUser.value.pages = {
          currentPage: pagesFunds.currentPage,
          lastPage: pagesFunds.lastPage,
        }
        break
      case 'office':
        tablePermissionsByOffice.value.rows =
          configureUserPermissionsFicsStore.office_permission_list.map((r) => ({
            ...r,
            office_code: r.permissible?.office_code ?? '',
            office_description: r.permissible?.office_description ?? '',
            status_id: r.status?.id ?? 0,
          }))
        const pagesOffice =
          configureUserPermissionsFicsStore.office_permission_pages
        tablePermissionsByOffice.value.pages = {
          currentPage: pagesOffice.currentPage,
          lastPage: pagesOffice.lastPage,
        }
        break
      case 'operation':
        tableMonetaryOperationsPermits.value.rows =
          configureUserPermissionsFicsStore.operation_permission_list.map(
            (r) => ({
              ...r,
              operation_code: r.permissible?.code ?? '',
              operation_description: r.permissible?.description ?? '',
              status_id: r.status?.id ?? 0,
            })
          )
        const pagesOperation =
          configureUserPermissionsFicsStore.operation_permission_pages
        tableMonetaryOperationsPermits.value.pages = {
          currentPage: pagesOperation.currentPage,
          lastPage: pagesOperation.lastPage,
          rowsPerPage: tableMonetaryOperationsPermits.value.pages.rowsPerPage,
          rowsNumber: pagesOperation.rowsNumber ?? 0,
        }
        break
    }
  }

  const updatePerPage = async (
    table: 'funds' | 'office' | 'operation',
    rowsPerPage: number
  ) => {
    let filters
    let listAction: (params: string) => Promise<void>

    switch (table) {
      case 'funds':
        filters = filtersFunds
        filters.value.rows = rowsPerPage
        filters.value.page = 1
        listAction = async (params: string) =>
          await configureUserPermissionsFicsStore._listActionFundsPermission(
            params
          )
        break
      case 'office':
        filters = filtersOffice
        filters.value.rows = rowsPerPage
        filters.value.page = 1
        listAction = async (params: string) =>
          await configureUserPermissionsFicsStore._listActionOfficesPermission(
            params
          )
        break
      case 'operation':
        filters = filtersOperation
        filters.value.rows = rowsPerPage
        filters.value.page = 1
        listAction = async (params: string) =>
          await configureUserPermissionsFicsStore._listActionOperationType(
            params
          )
        break
    }

    const queryString = formatParamsCustom(filters.value)
    await listAction(queryString ? '&' + queryString : '')

    await updatePage(table, filters.value.page)
  }
  const selectedUserInfo = computed(() => {
    if (!selectedUser.value) return null
    return users.value.find((u) => u.id === selectedUser.value) || null
  })

  const loadPermissionsByUser = async () => {
    if (!selectedUser.value) {
      const pages =
        configureUserPermissionsFicsStore.collective_investment_fund_pages

      tablePermissionsFundsByUser.value.rows = []
      tablePermissionsFundsByUser.value.pages = {
        currentPage: pages.currentPage,
        lastPage: pages.lastPage,
      }

      const pagesOfficePermission =
        configureUserPermissionsFicsStore.office_permission_pages

      tablePermissionsByOffice.value.rows = []
      tablePermissionsByOffice.value.pages = {
        currentPage: pagesOfficePermission.currentPage,
        lastPage: pagesOfficePermission.lastPage,
      }

      const pagesOperationPermission =
        configureUserPermissionsFicsStore.operation_permission_pages

      tableMonetaryOperationsPermits.value.rows = []
      tableMonetaryOperationsPermits.value.pages = {
        currentPage: pagesOperationPermission.currentPage,
        lastPage: pagesOperationPermission.lastPage,
        rowsPerPage: tableMonetaryOperationsPermits.value.pages.rowsPerPage,
        rowsNumber: pagesOperationPermission.rowsNumber ?? 0,
      }

      return
    }

    const params = formatParamsCustom({ 'filter[user_id]': selectedUser.value })

    tablePermissionsFundsByUser.value.loading = true
    await configureUserPermissionsFicsStore._listActionFundsPermission(params)
    tablePermissionsFundsByUser.value.rows =
      configureUserPermissionsFicsStore.collective_investment_fund_list.map(
        (r) => ({
          ...r,
          fund_code: r.permissible?.fund_code ?? '',
          fund_name: r.permissible?.fund_name ?? '',
          status_id: r.status?.id ?? 0,
        })
      )
    const pages =
      configureUserPermissionsFicsStore.collective_investment_fund_pages
    tablePermissionsFundsByUser.value.pages = {
      currentPage: pages.currentPage,
      lastPage: pages.lastPage,
    }
    tablePermissionsFundsByUser.value.loading = false

    tablePermissionsByOffice.value.loading = true
    await configureUserPermissionsFicsStore._listActionOfficesPermission(params)
    tablePermissionsByOffice.value.rows =
      configureUserPermissionsFicsStore.office_permission_list.map((r) => ({
        ...r,
        office_code: r.permissible?.office_code ?? '',
        office_description: r.permissible?.office_description ?? '',
        status_id: r.status?.id ?? 0,
      }))

    const pagesOfficePermission =
      configureUserPermissionsFicsStore.office_permission_pages
    tablePermissionsByOffice.value.pages = {
      currentPage: pagesOfficePermission.currentPage,
      lastPage: pagesOfficePermission.lastPage,
    }
    tablePermissionsByOffice.value.loading = false

    tableMonetaryOperationsPermits.value.loading = true
    await configureUserPermissionsFicsStore._listActionOperationType(params)
    tableMonetaryOperationsPermits.value.rows =
      configureUserPermissionsFicsStore.operation_permission_list.map((r) => ({
        ...r,
        operation_code: r.permissible?.code ?? '',
        operation_description: r.permissible?.description ?? '',
        status_id: r.status?.id ?? 0,
      }))

    const pagesOperationPermission =
      configureUserPermissionsFicsStore.operation_permission_pages
    tableMonetaryOperationsPermits.value.pages = {
      currentPage: pagesOperationPermission.currentPage,
      lastPage: pagesOperationPermission.lastPage,
      rowsPerPage: tableMonetaryOperationsPermits.value.pages.rowsPerPage,
      rowsNumber: pagesOperationPermission.rowsNumber ?? 0,
    }
    tableMonetaryOperationsPermits.value.loading = false
  }

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const handleAddUserPermissions = async () => {
    if (!selectedUser.value) {
      showAlert('Debe seleccionar un usuario', 'warning')
      return
    }

    const result = await showAlertInformationWithCustomInputSelect({
      title: 'Agregar permisos fondos por usuario',
      params_html: '<div id="custom-selector"></div>',
      input_value: undefined,
      input_options: funds.value,
      confirm_button_text: 'Agregar',
      cancel_button_text: 'Cancelar',
      show_cancel_button: true,
    })

    if (!result.isConfirmed) return

    const selectedFundId = Number(result.value)
    const fundExists = funds.value.some((f) => f.id === selectedFundId)
    if (!fundExists) {
      showAlert('Debe seleccionar un fondo', 'warning')
      return
    }

    const success =
      await configureUserPermissionsFicsStore.assignFundPermission(
        Number(selectedUser.value),
        [selectedFundId]
      )

    if (success) {
      const params = formatParamsCustom({
        'filter[user_id]': selectedUser.value,
      })

      tablePermissionsFundsByUser.value.loading = true
      await configureUserPermissionsFicsStore._listActionFundsPermission(params)
      tablePermissionsFundsByUser.value.rows =
        configureUserPermissionsFicsStore.collective_investment_fund_list.map(
          (row) => ({
            ...row,
            status_id: row.status?.id ?? null,
          })
        )
      const pages =
        configureUserPermissionsFicsStore.collective_investment_fund_pages
      tablePermissionsFundsByUser.value.pages = {
        currentPage: pages.currentPage,
        lastPage: pages.lastPage,
      }
      tablePermissionsFundsByUser.value.loading = false
    }
  }

  const openAlertModal = (row: PermissionRow) => {
    selectedRow.value = row
    alertModalRef.value.openModal()
    _getResources({ fics: ['regions'] })
  }

  const changeStatusAction = async () => {
    if (!selectedRow.value) return

    const success = await configureUserPermissionsFicsStore._updateStatus(
      selectedRow.value.id
    )

    if (success) {
      const newStatus =
        selectedRow.value.status_id === StatusID.ACTIVE
          ? StatusID.INACTIVE
          : StatusID.ACTIVE

      selectedRow.value.status_id = newStatus
      if (selectedRow.value.status) {
        selectedRow.value.status.id = newStatus
        selectedRow.value.status.status =
          newStatus === StatusID.ACTIVE ? 'Activo' : 'Inactivo'
      }
    }

    alertModalRef.value.closeModal()
    selectedRow.value = null
  }

  const openDeleteModal = (row: PermissionRow) => {
    rowToDelete.value = row
    deleteModalRef.value.openModal()
  }

  const confirmDeleteAction = async () => {
    if (!rowToDelete.value) return

    const success = await configureUserPermissionsFicsStore._deletePermission(
      rowToDelete.value.id
    )

    if (success) {
      tablePermissionsFundsByUser.value.rows =
        tablePermissionsFundsByUser.value.rows.filter(
          (r) => r.id !== rowToDelete.value?.id
        )
      tablePermissionsByOffice.value.rows =
        tablePermissionsByOffice.value.rows.filter(
          (r) => r.id !== rowToDelete.value?.id
        )
      tableMonetaryOperationsPermits.value.rows =
        tableMonetaryOperationsPermits.value.rows.filter(
          (r) => r.id !== rowToDelete.value?.id
        )
    }
    deleteModalRef.value.closeModal()

    rowToDelete.value = null
  }

  const handleAssignOffices = async () => {
    if (!selectedUser.value) {
      showAlert('Debe seleccionar un usuario', 'warning')
      return
    }

    if (!selectedOfficeIds.value.length) {
      showAlert('Debe seleccionar al menos una oficina', 'warning')
      return
    }

    const success =
      await configureUserPermissionsFicsStore.assignOfficePermission(
        Number(selectedUser.value),
        selectedOfficeIds.value
      )

    if (success) {
      const params = formatParamsCustom({
        'filter[user_id]': selectedUser.value,
      })

      tablePermissionsByOffice.value.loading = true
      await configureUserPermissionsFicsStore._listActionOfficesPermission(
        params
      )
      tablePermissionsByOffice.value.rows =
        configureUserPermissionsFicsStore.office_permission_list.map((row) => ({
          ...row,
          status_id: row.status?.id ?? null,
        }))
      const pagesOfficePermission =
        configureUserPermissionsFicsStore.office_permission_pages
      tablePermissionsFundsByUser.value.pages = {
        currentPage: pagesOfficePermission.currentPage,
        lastPage: pagesOfficePermission.lastPage,
      }
      tablePermissionsByOffice.value.loading = false

      assignOfficeModalRef.value.closeModal()
    }
  }

  const addPermissionsByOffice = () => {
    _getResources({ fics: ['regions'] })
    assignOfficeModalRef.value.openModal()
  }

  onBeforeMount(async () => {
    await _getResources({ fics: ['funds'] }, 'filter[keep_availables]=1')
    await _getResources({ fics: ['regions'] })
  })

  onMounted(async () => {
    openMainLoader(true)

    await _getResources({ user: ['users'] })

    setTimeout(() => openMainLoader(false), 1000)
  })

  onBeforeUnmount(() =>
    _resetKeys({
      fics: ['regions', 'funds'],
      user: ['users'],
    })
  )

  watch(selectedUser, async () => await loadPermissionsByUser())

  return {
    tabs,
    regions,
    tabActive,
    updatePage,
    handleClear,
    isRowActive,
    tabActiveIdx,
    filterConfig,
    handleFilter,
    alertModalRef,
    updatePerPage,
    deleteModalRef,
    openAlertModal,
    openDeleteModal,
    selectedUserInfo,
    alertModalConfig,
    headerProperties,
    deleteModalConfig,
    selectedOfficeIds,
    changeStatusAction,
    defaultIconsLucide,
    handleAssignOffices,
    confirmDeleteAction,
    assignOfficeModalRef,
    addPermissionsByOffice,
    handleAddUserPermissions,
    tablePermissionsByOffice,
    tablePermissionsFundsByUser,
    tableMonetaryOperationsPermits,
  }
}

export default useConfigureUserPermissionsList
