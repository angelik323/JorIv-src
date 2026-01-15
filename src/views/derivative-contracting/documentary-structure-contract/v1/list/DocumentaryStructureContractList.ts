// Vue - Pinia - Router - Quasar
import { ref, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useMainLoader, useRouteValidator, useUtils } from '@/composables'

// Interfaces
import { StatusID, IBaseTableProps } from '@/interfaces/global'
import { DocumentaryStructureContractQueryParam } from '@/interfaces/global/DerivativeContracting'
import { IFieldFilters } from '@/interfaces/customs'
import {
  IDocumentaryStructureContract,
  IDocumentaryStructureContractAnnexedDocument,
} from '@/interfaces/customs/derivative-contracting/DocumentaryStructureContract'

// Stores
import { useDocumentaryStructureContractStore } from '@/stores/derivative-contracting/documentary-structure-contract'

const useDocumentaryStructureContractList = () => {
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const { defaultIconsLucide, formatParamsCustom, formatCurrency } = useUtils()

  const store = useDocumentaryStructureContractStore('v1')
  const {
    _getListAction,
    _deleteAction,
    _getListAnnexedDocumentsAction,
    _updateStatusAnnexedDocumentAction,
    _clearData,
  } = store

  const {
    documentary_structure_contracts_list,
    documentary_structure_contracts_pages,
    annexed_documents_list,
    annexed_documents_pages,
  } = storeToRefs(store)

  const headerProps = {
    title: 'Estructura documental del contrato',
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
        label: 'Estructura documental del contrato',
        route: 'DocumentaryStructureContractList',
      },
    ],
    btnLabel: 'Crear',
    btnIcon: defaultIconsLucide.plusCircleOutline,
    btnColor: 'primary',
    btnTextColor: 'white',
    indentation: true,
    contentIndentation: true,
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscar documento',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-12 col-lg-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre del documento',
    },
  ])

  const tableProps = ref<IBaseTableProps<IDocumentaryStructureContract>>({
    title: 'Listado de documentos contractuales definidos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'selected',
        required: false,
        label: '',
        align: 'center',
        field: 'selected',
        sortable: false,
      },
      {
        name: 'contract_document_code',
        required: false,
        label: 'Código documento contractual',
        align: 'center',
        field: 'contract_document_code',
        sortable: true,
      },
      {
        name: 'contract_document_name',
        required: false,
        label: 'Nombre del documento contractual',
        align: 'center',
        field: 'contract_document_name',
        sortable: true,
      },
      {
        name: 'handle_stamp_duty',
        required: false,
        label: '¿Maneja impuesto de timbre?',
        align: 'center',
        field: 'handle_stamp_duty',
        sortable: true,
      },
      {
        name: 'taxable_base_unit',
        required: false,
        label: 'Unidad base gravable',
        align: 'center',
        field: 'taxable_base_unit',
        sortable: true,
      },
      {
        name: 'tax_base',
        required: false,
        label: 'Base gravable',
        align: 'center',
        field: 'tax_base',
        sortable: true,
        format: (val) => (val ? formatCurrency(val) || '' : ''),
      },
      {
        name: 'requires_publication',
        required: false,
        label: '¿Requiere publicación?',
        align: 'center',
        field: 'requires_publication',
        sortable: true,
      },
      {
        name: 'minimum_amount',
        required: false,
        label: 'Monto mínimo',
        align: 'center',
        field: 'minimum_amount',
        sortable: true,
        format: (val) => (val ? formatCurrency(val) || '' : ''),
      },
      {
        name: 'policy_management',
        required: false,
        label: '¿Maneja póliza?',
        align: 'center',
        field: 'policy_management',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const annexedTableProps = ref<
    IBaseTableProps<IDocumentaryStructureContractAnnexedDocument>
  >({
    title: 'Documentos anexos relacionados',
    loading: false,
    columns: [
      {
        name: 'type_attached_document',
        align: 'center',
        label: 'Tipo de documento',
        field: (row: IDocumentaryStructureContractAnnexedDocument) => {
          return row.type_attached_document?.name ?? ''
        },
        sortable: true,
      },
      {
        name: 'stage',
        align: 'center',
        label: 'Etapa',
        field: 'stage',
        sortable: true,
      },
      {
        name: 'mandatory',
        align: 'center',
        label: 'Obligatoriedad',
        field: 'mandatory',
        sortable: true,
      },
      {
        name: 'status_id',
        align: 'center',
        label: 'Estado',
        field: 'status_id',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })

  const alertModalAnnexedDocumentRef = ref()
  const alertModalAnnexedDocumentConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })

  const filtersFormat = ref<Record<string, string | number>>({})
  const annexedFiltersFormat = ref<Record<string, string | number>>({})
  const selectedDocument = ref<number | null>(null)

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    selectedDocument.value = null
    annexedTableProps.value.rows = []

    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    [DocumentaryStructureContractQueryParam.FILTER_SEARCH]: string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const handleFilterClear = () => {
    filtersFormat.value = {}
    _clearData()
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const openAlertModal = async (action: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.title = `¿Desea ${action} la estructura del documento seleccionado?  Se eliminará el registro asociado`
    await alertModalRef.value.openModal()
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    await alertModalRef.value.closeModal()
    openMainLoader(true)
    const responseSuccess = await _deleteAction(alertModalConfig.value.entityId)
    if (responseSuccess) {
      await listAction()
    }
    openMainLoader(false)
  }

  const handleSelectionChange = (documentId: number) => {
    selectedDocument.value = documentId
    annexedListAction()
  }

  const annexedListAction = async (filters: string = '') => {
    annexedTableProps.value.rows = []
    annexedTableProps.value.loading = true

    if (!selectedDocument.value) return

    const params = new URLSearchParams({
      [DocumentaryStructureContractQueryParam.FILTER_CONTRACT_DOCUMENT_ID]:
        String(selectedDocument.value),
    })

    await _getListAnnexedDocumentsAction(`${filters}&${params.toString()}`)

    annexedTableProps.value.loading = false
  }

  const updateAnnexedPage = async (page: number) => {
    annexedFiltersFormat.value = {
      ...annexedFiltersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(annexedFiltersFormat.value)

    annexedListAction(queryString ? '&' + queryString : '')
  }

  const updateAnnexedPerPage = (rowsPerPage: number) => {
    annexedFiltersFormat.value = {
      ...annexedFiltersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(annexedFiltersFormat.value)

    annexedListAction(queryString ? '&' + queryString : '')
  }

  const openAnnexedAlertModal = async (action: string, entityId: number) => {
    alertModalAnnexedDocumentConfig.value.entityId = entityId
    alertModalAnnexedDocumentConfig.value.title = `¿Está seguro que desea ${action} el documento anexo?`
    await alertModalAnnexedDocumentRef.value.openModal()
  }

  const changeStatusAnnexedDocumentAction = async () => {
    const entityId = alertModalAnnexedDocumentConfig.value.entityId
    if (!entityId) return

    await alertModalAnnexedDocumentRef.value.closeModal()
    openMainLoader(true)

    const responseSuccess = await _updateStatusAnnexedDocumentAction(entityId)
    if (responseSuccess && entityId) {
      const row = annexedTableProps.value.rows.find(
        (row: IDocumentaryStructureContractAnnexedDocument) =>
          row.id === entityId
      )
      if (row) {
        row.status_id =
          row.status_id === StatusID.ACTIVE
            ? StatusID.INACTIVE
            : StatusID.ACTIVE
      }
    }
    openMainLoader(false)
  }

  watch(
    () => documentary_structure_contracts_list.value,
    () => {
      tableProps.value.rows = documentary_structure_contracts_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...documentary_structure_contracts_pages.value,
      }
    }
  )

  watch(
    () => annexed_documents_list.value,
    () => {
      annexedTableProps.value.rows = annexed_documents_list.value
      annexedTableProps.value.pages = {
        ...annexedTableProps.value.pages,
        ...annexed_documents_pages.value,
      }
    }
  )

  onBeforeUnmount(() => {
    _clearData()
  })

  return {
    defaultIconsLucide,
    headerProps,
    tableProps,
    annexedTableProps,
    filterConfig,
    alertModalRef,
    alertModalConfig,
    alertModalAnnexedDocumentRef,
    alertModalAnnexedDocumentConfig,
    selectedDocument,
    StatusID,

    handleFilter,
    handleFilterClear,
    updatePage,
    updatePerPage,
    updateAnnexedPage,
    updateAnnexedPerPage,
    deleteAction,
    changeStatusAnnexedDocumentAction,
    openAlertModal,
    openAnnexedAlertModal,
    handleSelectionChange,
    validateRouter,
  }
}

export default useDocumentaryStructureContractList
