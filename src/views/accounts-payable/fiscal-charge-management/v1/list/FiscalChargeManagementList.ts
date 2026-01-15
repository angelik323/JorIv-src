// Vue - pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IFiscalChargeManagementItem } from '@/interfaces/customs/accounts-payable/FiscalChargeManagement'
import { IFieldFilters } from '@/interfaces/customs'
import { IBaseTableProps, StatusID } from '@/interfaces/global'
import { status } from '@/constants'

// Composables
import { useGoToUrl, useMainLoader, useRules, useUtils } from '@/composables'

// Stores
import { useFiscalChargeManagementStore } from '@/stores/accounts-payable/fiscal-charge-management'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useFiscalChargeManagementList = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { fiscal_charge_management_list, fiscal_charge_management_pages } =
    storeToRefs(useFiscalChargeManagementStore('v1'))

  const {
    _getFiscalChargeManagementList,
    _updateFiscalChargeManagementStatus,
    _deleteFiscalChargeManagement,
    _clearData,
  } = useFiscalChargeManagementStore('v1')

  const { tax_types, tax_natures, fiscal_charges } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const { is_required } = useRules()

  const showState = ref(false)
  const isFiscalChargeManagementListEmpty = ref(true)

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE
  const selectedRow = ref<IFiscalChargeManagementItem>()
  const selectedAlertModalAction = ref<'delete' | 'status'>('delete')

  const alertModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar el cargo fiscal?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  const headerProps = {
    title: 'Gestión de cargo fiscal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Gestión de cargo fiscal',
        route: 'FiscalChargeManagementList',
      },
    ],
    btn: {
      icon: defaultIconsLucide.plusCircleOutline,
      label: 'Crear',
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'id',
      label: 'Código y nombre del cargo fiscal*',
      type: 'q-select',
      autocomplete: true,
      value: 'Todos',
      class: 'col-3',
      options: fiscal_charges,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (val: string) => is_required(val, 'El cargo fiscal es requerido'),
      ],
    },
    {
      name: 'tax_type_id',
      label: 'Tipo de tributo',
      type: 'q-select',
      value: '',
      class: 'col-3',
      options: tax_types,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'tax_nature_id',
      label: 'Naturaleza del tributo',
      type: 'q-select',
      value: '',
      class: 'col-3',
      options: tax_natures,
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
  ])

  const tableProps = ref<IBaseTableProps<IFiscalChargeManagementItem>>({
    title: 'Listado de gestión de cargo fiscal',
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
        name: 'fiscal_charge_name',
        required: false,
        label: 'Cargo fiscal',
        align: 'left',
        field: (row) => `${row.code} - ${row.name}`,
        sortable: true,
      },
      {
        name: 'tax_type_description',
        required: false,
        label: 'Tipo de tributo',
        align: 'left',
        field: (row) =>
          `${row.tax_type.abbreviation} - ${row.tax_type.description}`,
        sortable: true,
      },
      {
        name: 'tax_nature_name',
        required: false,
        label: 'Naturaleza del tributo',
        align: 'left',
        field: (row) => row.tax_nature.name ?? '-',
        sortable: true,
      },
      {
        name: 'revenue_beneficiary_entity_name',
        required: false,
        label: 'Entidad beneficiaria del recaudo',
        align: 'left',
        field: (row) => row.revenue_beneficiary_entity.name ?? '-',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        field: (row) => row.status.id,
        sortable: true,
        align: 'left',
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
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getFiscalChargeManagementList(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[id]'?: string
    'filter[tax_type_id]': number
    'filter[tax_nature_id]': number
    'filter[status_id]': number
  }) => {
    if ($filters['filter[id]'] === 'Todos') {
      delete $filters['filter[id]']
    }
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    _clearData()

    await listAction(filtersFormat.value)

    showState.value = true
    isFiscalChargeManagementListEmpty.value =
      fiscal_charge_management_list.value.length === 0
  }

  const handleClearFilters = async () => {
    _clearData()
    isFiscalChargeManagementListEmpty.value = true
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

  const openAlertModal = (
    row: IFiscalChargeManagementItem,
    action: 'delete' | 'status'
  ) => {
    selectedAlertModalAction.value = action
    selectedRow.value = row

    if (action === 'delete') {
      alertModalConfig.value.description = `¿Desea eliminar el cargo fiscal: ${row.code} - ${row.name}`
    } else {
      const newStatus =
        row.status.id === StatusID.ACTIVE ? 'inactivar' : 'activar'
      alertModalConfig.value.description = `¿Desea ${newStatus} el cargo fiscal: ${row.code} - ${row.name}?`
    }

    alertModalRef.value?.openModal()
  }

  const handleConfirmAction = () => {
    if (selectedAlertModalAction.value === 'delete') {
      handleDelete()
    } else {
      toggleStatus()
    }
    alertModalRef.value?.closeModal()
  }

  const toggleStatus = async () => {
    if (!selectedRow.value) return

    const success = await _updateFiscalChargeManagementStatus(
      selectedRow.value.id
    )

    if (success) {
      const newStatus =
        selectedRow.value.status.id === StatusID.ACTIVE
          ? StatusID.INACTIVE
          : StatusID.ACTIVE

      selectedRow.value.status.id = newStatus
    }
  }

  const handleDelete = async () => {
    if (!selectedRow.value) return
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    const result = await _deleteFiscalChargeManagement(selectedRow.value.id)
    if (result) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  const keys = {
    accounts_payable: ['tax_types', 'tax_natures', 'fiscal_charges'],
  }

  onMounted(async () => {
    await _getResources(keys, 'sort=id')
    filterConfig.value[0].options.unshift({ label: 'Todos', value: 'Todos' })
    filterConfig.value[1].options.unshift({ label: 'Todos', value: '' })
    filterConfig.value[2].options.unshift({ label: 'Todos', value: '' })
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    () => fiscal_charge_management_list.value,
    (val) => {
      tableProps.value.rows = val

      const { currentPage, lastPage } = fiscal_charge_management_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isFiscalChargeManagementListEmpty,
    alertModalRef,
    alertModalConfig,
    selectedAlertModalAction,
    handleFilter,
    handleClearFilters,
    openAlertModal,
    handleConfirmAction,
    updatePage,
    updateRowsPerPage,
    isRowActive,
    goToURL,
  }
}

export default useFiscalChargeManagementList
