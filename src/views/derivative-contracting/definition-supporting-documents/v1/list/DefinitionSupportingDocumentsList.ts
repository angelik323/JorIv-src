// Vue - pinia - moment
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IDefinitionSupportingDocumentsList } from '@/interfaces/customs/derivative-contracting/DefinitionSupportingDocuments'
import { IFieldFilters } from '@/interfaces/customs/Filters'

// Stores
import {
  useResourceManagerStore,
  useDerivativeContractingResourceStore,
  useAccountingResourceStore,
} from '@/stores/resources-manager'
import { useDefinitionSupportingDocumentsStore } from '@/stores/derivative-contracting'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRules,
  useUtils,
  useRouteValidator,
} from '@/composables'

// Constantes
import { status } from '@/constants'

const useDefinitionDocumentsList = () => {
  const {
    _getDefinitionDocumentsList,
    _deleteDefinitionDocuments,
    _clearData,
    _changeStatus,
  } = useDefinitionSupportingDocumentsStore('v1')
  const { definition_documents_list, definition_documents_pages } = storeToRefs(
    useDefinitionSupportingDocumentsStore('v1')
  )
  const {
    definition_documentation_module,
    definition_documentation_type,
    definition_documentation_codes,
  } = storeToRefs(useDerivativeContractingResourceStore('v1'))

  const { account_chart_structure_code_accounting } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const deleteModalRef = ref()
  const rowToDelete = ref<IDefinitionSupportingDocumentsList | null>(null)
  const selectedRow = ref<IDefinitionSupportingDocumentsList | null>(null)
  const alertModalConfig = ref({
    title: '',
  })
  const alertModalRef = ref()

  const isRowActive = (status: string) => status === 'Activo'

  const keys = {
    derivative_contracting: [
      'definition_documentation_type',
      'definition_documentation_module',
    ],
  }

  const keysAccounting = {
    accounting: ['account_chart_structure_code_accounting'],
  }

  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'structure_id',
      label: 'Código de estructura documental*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: account_chart_structure_code_accounting,
      rules: [(val: string) => useRules().is_required(val)],
      onChange: selectCodeByStructureId,
    },
    {
      name: 'document_code',
      label: 'Código documental',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      options: definition_documentation_codes,
    },
    {
      name: 'type',
      label: 'Tipo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      options: definition_documentation_type,
    },
    {
      name: 'module',
      label: 'Módulo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      options: definition_documentation_module,
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
      options: status,
    },
  ])

  const headerProps = {
    title: 'Definición documentos soporte',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contratación derivada',
        route: '',
      },
      {
        label: 'Definición documentos soporte',
        route: 'DefinitionSupportingDocumentsList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de documentos',
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
        name: 'document_code',
        field: 'document_code',
        required: true,
        label: 'Código documental',
        align: 'left',
        sortable: true,
      },
      {
        name: 'name',
        field: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type',
        field: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'module',
        field: (row) => row.module ?? 'Sin información',
        required: true,
        label: 'Módulo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
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
    rows: [] as IDefinitionSupportingDocumentsList[],
    pages: definition_documents_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const selectCodeByStructureId = async (id: number) => {
    _resetKeys({
      derivative_contracting: ['definition_documentation_codes'],
    })

    if (id) {
      await _getResources({
        derivative_contracting: [
          `definition_documentation_codes&filter[structure_id]=${id}`,
        ],
      })
    }
  }

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getDefinitionDocumentsList(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const handleFilter = async ($filters: {
    'filter[structure_id]': string
    'filter[document_code]': string
    'filter[type]': string
    'filter[module]': string
    'filter[status_id]': string | number
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rowsPerPage: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rowsPerPage

    await listAction(filtersFormat.value)
  }

  const handleClear = async () => {
    tableProps.value.rows = []
  }

  const openDeleteModal = (row: IDefinitionSupportingDocumentsList) => {
    rowToDelete.value = row
    deleteModalRef.value.openModal()
  }

  const confirmDeleteAction = async () => {
    if (!rowToDelete.value) return

    openMainLoader(true)
    const success = await _deleteDefinitionDocuments(rowToDelete.value.id)

    if (success) {
      await listAction(filtersFormat.value)
    }

    openMainLoader(false)
    deleteModalRef.value.closeModal()
    rowToDelete.value = null
  }

  const openAlertModal = (row: IDefinitionSupportingDocumentsList) => {
    selectedRow.value = row
    alertModalConfig.value.title = `¿Desea ${
      isRowActive(row.status) ? 'inactivar' : 'activar'
    } el documento seleccionado?`

    alertModalRef.value.openModal()
  }

  const changeStatusAction = async () => {
    if (!selectedRow.value) return
    const { id, status } = selectedRow.value

    openMainLoader(true)
    const success = await _changeStatus(id)
    openMainLoader(false)

    if (success) {
      const newStatus = isRowActive(status) ? 'Inactivo' : 'Activo'
      selectedRow.value.status = newStatus
    }

    alertModalRef.value.closeModal()
    selectedRow.value = null
  }

  onMounted(async () => {
    _clearData()

    openMainLoader(true)
    await _getResources(keys)
    await _getResources(keysAccounting, '', 'v2')
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    definition_documents_list,
    () => {
      tableProps.value.rows = definition_documents_list.value
      const { currentPage, lastPage } = definition_documents_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    deleteModalRef,
    defaultIconsLucide,
    alertModalConfig,
    alertModalRef,
    isRowActive,
    openAlertModal,
    changeStatusAction,
    goToURL,
    confirmDeleteAction,
    openDeleteModal,
    handleClear,
    updatePerPage,
    handleFilter,
    updatePage,
    validateRouter,
  }
}

export default useDefinitionDocumentsList
