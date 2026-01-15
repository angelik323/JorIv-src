// core
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// interfaces
import { StatusID } from '@/interfaces/global'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import {
  IMovementManagementFilters,
  IMovementManagementItem,
} from '@/interfaces/customs/accounts-payable/MovementManagement'

// constants
import { status, disbursementTypeOptions } from '@/constants/resources'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useMovementManagementStore } from '@/stores/accounts-payable/movement-management'

const useMovementManagementList = () => {
  // composables
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { movement_management_code_name } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const {
    _getMovementList,
    _toggleStatusMovement,
    _deleteMovement,
    _clearData,
  } = useMovementManagementStore('v1')

  const { movement_management_list, movement_management_pages } = storeToRefs(
    useMovementManagementStore('v1')
  )

  // refs
  const keys = ref({ accounts_payable: ['movement_management_code_name'] })
  const filtersFormat = ref<Record<string, string | number>>({})
  const showState = ref(false)
  const isMovementListEmpty = ref(true)
  const alertModalRef = ref()
  const perPage = ref(20)
  const statusModalRef = ref()

  // configs
  const headerProps = {
    title: 'Gestión de movimientos de cuentas por pagar',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Gestión de movimientos de cuentas por pagar',
        route: 'MovementManagementList',
      },
    ],
    btn: {
      label: validateRouter(
        'AccountsPayable',
        'MovementManagementList',
        'create'
      )
        ? 'Crear'
        : undefined,
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'code_name',
      label: 'Movimiento',
      type: 'q-select',
      value: null,
      class: 'col-4',
      options: movement_management_code_name,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'disbursement_type',
      label: 'Tipo de desembolso',
      type: 'q-select',
      value: 'Todos',
      class: 'col-4',
      options: disbursementTypeOptions,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: 0,
      class: 'col-4',
      options: status,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: IMovementManagementItem[]
    pages: typeof movement_management_pages
  }>({
    title: 'Listado de tipos de movimientos por pagar',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code_name',
        required: false,
        label: 'Código de movimiento',
        align: 'left',
        field: 'code_name',
        sortable: true,
      },
      {
        name: 'disbursement_type_label',
        required: false,
        label: 'Tipo de desembolso',
        align: 'left',
        field: 'disbursement_type_label',
        sortable: true,
      },
      {
        name: 'has_handle_budget',
        required: false,
        label: '¿Maneja presupuesto?',
        align: 'center',
        field: 'has_handle_budget',
        sortable: true,
      },
      {
        name: 'has_contract_execution',
        required: false,
        label: '¿Ejecución de contratos?',
        align: 'center',
        field: 'has_contract_execution',
        sortable: true,
      },
      {
        name: 'has_generates_accrual',
        required: false,
        label: '¿Genera causación?',
        align: 'center',
        field: 'has_generates_accrual',
        sortable: true,
      },
      {
        name: 'has_generates_treasury',
        required: false,
        label: '¿Cumplimiento sin tesorería?',
        align: 'center',
        field: 'has_generates_treasury',
        sortable: true,
      },
      {
        name: 'has_amortizes_fund',
        required: false,
        label: '¿Amortiza fondo?',
        align: 'center',
        field: 'has_amortizes_fund',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'center',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    customColumns: [
      'has_handle_budget',
      'has_contract_execution',
      'has_generates_accrual',
      'has_generates_treasury',
      'has_amortizes_fund',
      'status',
      'actions',
    ],
    rows: [],
    pages: movement_management_pages,
  })

  const alertModalConfig = ref({
    description: '¿Desea eliminar el movimiento de cuentas por pagar?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  const alertStatusModalConfig = ref({
    title: 'Advertencia',
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  // actions
  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const openStatusModal = (row: IMovementManagementItem) => {
    alertStatusModalConfig.value.id = row.id
    alertStatusModalConfig.value.description = isRowActive(row.status.id)
      ? '¿Desea inactivar el tipo de movimiento por pagar?'
      : '¿Desea activar el tipo de movimiento por pagar?'

    statusModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    openMainLoader(true)
    await _toggleStatusMovement(alertStatusModalConfig.value.id!)
    await listAction(filtersFormat.value)
    openMainLoader(false)

    statusModalRef.value.closeModal()
  }

  const listAction = async (filters: typeof filtersFormat.value) => {
    filters['order_by'] = 'created_at,desc'
    tableProps.value.loading = true

    if (filters['filter[disbursement_type]'] == 'Todos')
      delete filters['filter[disbursement_type]']

    if (filters['filter[status_id]'] == 0) delete filters['filter[status_id]']

    openMainLoader(true)
    await _getMovementList(filters)
    openMainLoader(false)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: IMovementManagementFilters) => {
    filtersFormat.value = { ...$filters }

    await listAction(filtersFormat.value)

    const hasResults = movement_management_list.value.length > 0
    showState.value = filtersFormat.value ? true : false
    isMovementListEmpty.value = !hasResults
  }

  const handleClearFilters = async () => {
    _clearData()
  }

  const openDeleteModal = (id: number) => {
    alertModalConfig.value.id = id
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return

    openMainLoader(true)
    await alertModalRef.value.closeModal()
    const result = await _deleteMovement(alertModalConfig.value.id)

    if (result) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage.value,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    await listAction(filtersFormat.value)
  }

  // lifecycle hooks
  watch(
    () => movement_management_list.value,
    () => {
      tableProps.value.rows = movement_management_list.value
      tableProps.value.pages.currentPage =
        movement_management_pages.value.currentPage
      tableProps.value.pages.lastPage = movement_management_pages.value.lastPage
    }
  )

  onMounted(async () => {
    await _getResources(keys.value)
  })

  onBeforeUnmount(() => _resetKeys(keys.value))

  return {
    // configs
    headerProps,
    filterConfig,
    tableProps,
    alertModalConfig,
    alertStatusModalConfig,

    // refs
    isMovementListEmpty,
    showState,
    alertModalRef,
    statusModalRef,

    // utils
    defaultIconsLucide,

    // methods
    handleFilter,
    handleClearFilters,
    handleDelete,
    openDeleteModal,
    isRowActive,
    changeStatusAction,
    updatePage,
    updatePerPage,
    goToURL,
    validateRouter,
    openStatusModal,
  }
}

export default useMovementManagementList
