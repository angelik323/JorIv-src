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
  ITypeOfDocumentFilters,
  ITypeOfDocumentItem,
} from '@/interfaces/customs/accounts-payable/TypeOfDocuments'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useTypeOfDocumentsStore } from '@/stores/accounts-payable/type-of-documents'

type ConfirmMode = 'toggle' | 'delete'

const useTypeOfDocumentsList = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    document_type_statuses,
    document_type_code_name,
    document_types_operation_type,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const {
    _getTypeOfDocumentsList,
    _toggleStatusTypeOfDocument,
    _deleteTypeOfDocument,
    _clearData,
  } = useTypeOfDocumentsStore('v1')

  const { type_of_documents_list, type_of_documents_pages } = storeToRefs(
    useTypeOfDocumentsStore('v1')
  )

  const keys = {
    accounts_payable: [
      'document_type_statuses',
      'document_type_code_name',
      'document_types_operation_type',
    ],
  }
  const filtersFormat = ref<Record<string, string | number>>({})
  const showState = ref(false)
  const isListEmpty = ref(true)
  const perPage = ref(20)

  const alertModalRef = ref()
  const selectedRow = ref<ITypeOfDocumentItem>()
  const confirmMode = ref<ConfirmMode>('toggle')
  const alertModalConfig = ref({
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
  })

  const openAlertModal = (row: ITypeOfDocumentItem) => {
    selectedRow.value = row
    confirmMode.value = 'toggle'
    const verb = row.status.id === StatusID.ACTIVE ? 'inactivar' : 'activar'
    alertModalConfig.value.description = `¿Desea ${verb} el tipo de documento: ${row.code} - ${row.name}?`
    alertModalRef.value?.openModal()
  }

  const openDeleteModal = (row: ITypeOfDocumentItem) => {
    selectedRow.value = row
    confirmMode.value = 'delete'
    alertModalConfig.value.description = `¿Desea eliminar el documento: ${row.code} - ${row.name}?`
    alertModalRef.value?.openModal()
  }

  const handleConfirmAction = async () => {
    if (!selectedRow.value) return
    if (confirmMode.value === 'toggle') {
      await changeStatusAction(selectedRow.value)
    } else {
      await deleteAction(selectedRow.value)
    }
    alertModalRef.value?.closeModal()
  }

  const canEdit = validateRouter(
    'AccountsPayable',
    'TypeOfDocumentsList',
    'edit'
  )
  const canDelete = validateRouter(
    'AccountsPayable',
    'TypeOfDocumentsList',
    'delete'
  )

  const headerProps = {
    title: 'Gestión de tipos de documentos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      { label: 'Gestión de tipos de documento', route: 'TypeOfDocumentsList' },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircleOutline,
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'document',
      label: 'Código y nombre del documento',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: document_type_code_name,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'operation_type',
      label: 'Tipo de operación',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: document_types_operation_type,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: document_type_statuses,
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    customColumns: string[]
    rows: ITypeOfDocumentItem[]
    pages: typeof type_of_documents_pages
  }>({
    title: 'Listado de tipos de documentos',
    loading: false,
    columns: [
      { name: 'id', label: '#', align: 'left', field: 'id', sortable: true },
      {
        name: 'code_name',
        label: 'Código y nombre',
        align: 'left',
        field: (row) => `${row?.code ?? ''} - ${row?.name ?? ''}`,
        sortable: true,
      },

      {
        name: 'numbering',
        label: 'Numeración',
        align: 'left',
        field: 'numbering',
        sortable: true,
      },
      {
        name: 'document_type',
        label: 'Tipo de documento',
        align: 'left',
        field: 'document_type',
        sortable: true,
      },
      {
        name: 'operation_type',
        label: 'Tipo de operación',
        align: 'left',
        field: 'operation_type',
        sortable: true,
      },
      {
        name: 'has_internal_consecutive',
        label: 'Consecutivo interno',
        align: 'center',
        field: 'has_internal_consecutive',
        sortable: true,
      },
      {
        name: 'has_client_consecutive',
        label: 'Consecutivo cliente',
        align: 'center',
        field: 'has_client_consecutive',
        sortable: true,
      },
      {
        name: 'has_order',
        label: 'Orden de pedido',
        align: 'center',
        field: 'has_order',
        sortable: true,
      },
      {
        name: 'has_other_references',
        label: 'Otras referencias',
        align: 'center',
        field: 'has_other_references',
        sortable: true,
      },
      {
        name: 'has_legalization_date',
        label: 'Fecha legalización',
        align: 'center',
        field: 'has_legalization_date',
        sortable: true,
      },
      {
        name: 'has_expiration_date',
        label: 'Fecha vencimiento',
        align: 'center',
        field: 'has_expiration_date',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        align: 'center',
        field: (row) => row.status?.name ?? '',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'left',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    customColumns: [
      'has_internal_consecutive',
      'has_client_consecutive',
      'has_order',
      'has_other_references',
      'has_legalization_date',
      'has_expiration_date',
      'status',
      'actions',
    ],
    rows: [],
    pages: type_of_documents_pages,
  })

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const changeStatusAction = async (row: ITypeOfDocumentItem) => {
    openMainLoader(true)
    const ok = await _toggleStatusTypeOfDocument(row.id!)
    openMainLoader(false)
    if (ok) {
      row.status.id =
        row.status.id === StatusID.ACTIVE ? StatusID.INACTIVE : StatusID.ACTIVE
    }
  }

  const deleteAction = async (row: ITypeOfDocumentItem) => {
    openMainLoader(true)
    const ok = await _deleteTypeOfDocument(row.id!)
    if (ok) {
      await listAction({
        ...filtersFormat.value,
        rows: perPage.value,
        page: type_of_documents_pages.value.currentPage ?? 1,
      })
    }
    openMainLoader(false)
  }

  const onToggleClick = (row: ITypeOfDocumentItem) => {
    if (!canEdit) return
    openAlertModal(row)
  }

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.loading = true
    openMainLoader(true)
    await _getTypeOfDocumentsList(filters)
    openMainLoader(false)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: ITypeOfDocumentFilters) => {
    const filters: Record<string, string | number> = { ...$filters }

    if (filters['filter[document]']) {
      filters['filter[code]'] = filters['filter[document]']
      delete filters['filter[document]']
    }

    filtersFormat.value = { ...filters, rows: perPage.value, page: 1 }
    await listAction(filtersFormat.value)

    const hasResults = type_of_documents_list.value.length > 0
    showState.value = Boolean(filtersFormat.value)
    isListEmpty.value = !hasResults
  }

  const handleClearFilters = async () => {
    _clearData()
  }

  const updatePage = async (page: number) => {
    await listAction({ ...filtersFormat.value, rows: perPage.value, page })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = { ...filtersFormat.value, rows: rowsPerPage, page: 1 }
    await listAction(filtersFormat.value)
  }

  watch(
    () => type_of_documents_list.value,
    () => {
      tableProps.value.rows = type_of_documents_list.value
      tableProps.value.pages.currentPage =
        type_of_documents_pages.value.currentPage
      tableProps.value.pages.lastPage = type_of_documents_pages.value.lastPage
    }
  )

  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    // configs
    headerProps,
    filterConfig,
    tableProps,

    // flags
    isListEmpty,
    showState,

    // modal
    alertModalRef,
    alertModalConfig,
    handleConfirmAction,
    openDeleteModal,

    // utils
    defaultIconsLucide,
    goToURL,
    validateRouter,
    canEdit,
    canDelete,

    // actions
    handleFilter,
    handleClearFilters,
    updatePage,
    updatePerPage,

    // estado
    isRowActive,
    onToggleClick,
  }
}

export default useTypeOfDocumentsList