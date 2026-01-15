// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import {
  IAccountsPayableNotificationsBusinessTypesIdsBase,
  IAccountsPayableNotificationsListItem,
} from '@/interfaces/customs/accounts-payable/AccountsPayableNotifications'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { StatusID } from '@/interfaces/global/Status'
import { IRolesList } from '@/interfaces/customs/roles'
import { status } from '@/constants'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Stores
import { useAccountsPayableNotificationsStore } from '@/stores/accounts-payable/accounts-payable-notifications'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useAccountsPayableNotificationsList = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const {
    _getAccountsPayableNotificationsList,
    _toggleAccountsPayableNotificationStatus,
    _deleteAccountsPayableNotification,
  } = useAccountsPayableNotificationsStore('v1')

  const { business_trust_types } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { notification_modules } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const showState = ref(false)
  const isAccountsPayableNotificationsListEmpty = ref(true)

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Está seguro que desea eliminar la notificación?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    action: '' as 'change-status' | 'delete',
    id: null as null | number,
  })

  const headerProps = {
    title: 'Notificaciones',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Notificaciones',
        route: 'AccountsPayableNotificationsList',
      },
    ],
    btn: {
      icon: defaultIconsLucide.plusCircleOutline,
      label: 'Crear',
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_type_ids',
      label: 'Tipo de negocio',
      type: 'q-select',
      value: '',
      class: 'col-3',
      options: business_trust_types,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'module',
      label: 'Módulo',
      type: 'q-select',
      value: '',
      class: 'col-3',
      options: notification_modules,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: 0,
      class: 'col-3',
      options: status,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'id',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-3',
      prepend_icon: 'Search',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Buscar notificación',
    },
  ])

  const tableProps = ref<
    IBaseTableProps<IAccountsPayableNotificationsListItem>
  >({
    title: 'Listado de notificaciones',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'id',
        required: false,
        label: 'Número de notificación',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'module',
        required: false,
        label: 'Módulo',
        align: 'left',
        field: (row) => row.module?.label ?? '',
        sortable: true,
      },
      {
        name: 'process',
        required: false,
        label: 'Proceso',
        align: 'left',
        field: (row) => row.process?.label ?? '',
        sortable: true,
      },
      {
        name: 'recipients',
        required: false,
        label: 'Destinatario/Rol',
        align: 'left',
        field: (row) => showRecipients(row.recipients),
        sortable: true,
      },
      {
        name: 'type_business',
        required: false,
        label: 'Tipo de negocio',
        align: 'left',
        field: (row) => showBusinessTypes(row.business_type_ids),
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: (row) => row.status.id,
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id',
        align: 'center',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const showRecipients = (recipients: IRolesList[]) => {
    if (!recipients || recipients.length === 0) return
    return recipients[0].name + (recipients.length > 1 ? ' , ...' : '')
  }

  const showBusinessTypes = (
    business_types: IAccountsPayableNotificationsBusinessTypesIdsBase[]
  ) => {
    if (!business_types || business_types.length === 0) return
    return business_types[0].name + (business_types.length > 1 ? ' , ...' : '')
  }

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const result = await _getAccountsPayableNotificationsList(filters)
    if (result) {
      tableProps.value.rows = result.list
      tableProps.value.pages = result.pages
    }
    tableProps.value.loading = false
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const handleFilter = async ($filters: {
    'filter[business_type_ids]'?: string
    'filter[module]'?: string
    'filter[status_id]'?: string
    'filter[id]'?: string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    clearData()

    await listAction(filtersFormat.value)

    showState.value = true
    isAccountsPayableNotificationsListEmpty.value =
      tableProps.value.rows.length === 0
  }

  const handleClearFilters = async () => {
    clearData()
    isAccountsPayableNotificationsListEmpty.value = true
    showState.value = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction(filtersFormat.value)
  }

  const updateRowsPerPage = (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    listAction(filtersFormat.value)
  }

  const clearData = () => {
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 1,
      lastPage: 1,
    }
  }

  const openAlertModal = (
    row: IAccountsPayableNotificationsListItem,
    action: 'change-status' | 'delete'
  ) => {
    if (
      action === 'change-status' &&
      !validateRouter(
        'AccountsPayable',
        'AccountsPayableNotificationsList',
        'edit'
      )
    )
      return
    alertModalConfig.value.id = row.id
    alertModalConfig.value.action = action

    if (action === 'change-status') {
      const newStatus =
        row.status.id === StatusID.ACTIVE ? 'Inactivar' : 'Activar'

      alertModalConfig.value.description = `¿Está seguro que desea ${newStatus} la notificación?`
    } else {
      alertModalConfig.value.description =
        '¿Está seguro que desea eliminar la notificación?'
    }

    alertModalRef.value?.openModal()
  }

  const handleConfirmButtonModal = () => {
    if (alertModalConfig.value.action === 'change-status') {
      toggleStatus()
    } else {
      deleteItem()
    }
    alertModalRef.value.closeModal()
  }

  const toggleStatus = async () => {
    if (!alertModalConfig.value.id) return

    const success = await _toggleAccountsPayableNotificationStatus(
      alertModalConfig.value.id
    )

    if (success) {
      const selected_row = tableProps.value.rows.find(
        (row: IAccountsPayableNotificationsListItem) =>
          row.id === alertModalConfig.value.id
      )

      if (selected_row) {
        selected_row.status.id =
          selected_row.status.id === StatusID.ACTIVE
            ? StatusID.INACTIVE
            : StatusID.ACTIVE
      }
    }
  }

  const deleteItem = async () => {
    if (!alertModalConfig.value.id) return
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    const result = await _deleteAccountsPayableNotification(
      alertModalConfig.value.id
    )
    if (result) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const keys = {
    trust_business: ['business_trust_types'],
    accounts_payable: ['notification_modules'],
  }

  onMounted(async () => {
    await _getResources(keys)
    filterConfig.value[0].options.unshift({ label: 'Todos', value: '' })
    filterConfig.value[1].options.unshift({ label: 'Todos', value: '' })
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    defaultIconsLucide,
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isAccountsPayableNotificationsListEmpty,
    alertModalRef,
    alertModalConfig,
    isRowActive,
    handleFilter,
    handleClearFilters,
    openAlertModal,
    handleConfirmButtonModal,
    updatePage,
    updateRowsPerPage,
    goToURL,
    validateRouter,
  }
}

export default useAccountsPayableNotificationsList
