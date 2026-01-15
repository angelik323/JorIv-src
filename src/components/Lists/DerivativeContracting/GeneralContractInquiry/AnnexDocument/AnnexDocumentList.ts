import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IAnnexDocument, IAnnexRelation, IPolicyCoverage, IAttachment } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

//Composables
import {
  useUtils,
} from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'


//Stores
import { useGeneralContractInquiryStore } from '@/stores/derivative-contracting/general-contract-inquiry'

const useAnnexDocumentList = (
  props: {
    contractId?: number | null
  }
) => {

  const { _getAnnexDocumentsView, _getRelationAnnexDocumentsView, _getCoveringsView, _getAttachedDocumentsView, _getDocumentFileView } = useGeneralContractInquiryStore('v1')

  const { general_contract_inquiry_pages, annex_documents_view, relation_annex_documents_view, coverings_view, attached_documents_view, clauses_view, document_file_view } = storeToRefs(
    useGeneralContractInquiryStore('v1')
  )

  let perPage = 20

  const { defaultIconsLucide, formatDate, formatCurrency } = useUtils()

  const { goToURL } = useGoToUrl()
  

  // Ref para almacenar la fila seleccionada de documentos anexos
  const selectedAnnexRow = ref<IAnnexDocument | null>(null)

  const tableProps_annex_document = ref<IBaseTableProps<IAnnexDocument>>({
    title: 'Documentos anexos del contrato',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: (row) => row.id,
        sortable: true,
      },
      {
        name: 'contract_number',
        required: true,
        label: 'Contrato',
        align: 'center',
        field: 'contract_number',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'status',
        sortable: true,
      },
      {
        name: 'document_name',
        required: true,
        label: 'Documento',
        align: 'left',
        field: 'document_name',
        sortable: true,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: (row) => row.type?.name || 'N/A',
        sortable: true,
      },
      {
        name: 'effective_date',
        required: true,
        label: 'Fecha inicio',
        align: 'center',
        field: 'effective_date',
        sortable: true,
      },
      {
        name: 'expiration_date',
        required: true,
        label: 'Fecha fin',
        align: 'center',
        field: 'expiration_date',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const tableProps_annex_relation = ref<IBaseTableProps<IAnnexRelation>>({
    title: 'Relación de documento anexo',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'policy_type',
        required: true,
        label: 'Tipo de póliza',
        align: 'left',
        field: (row) => row.policy_type?.name || 'N/A',
        sortable: true,
      },
      {
        name: 'insurance_company',
        required: true,
        label: 'Aseguradora',
        align: 'left',
        field: (row) => row.insurance_company?.name || 'N/A',
        sortable: true,
      },
      {
        name: 'policy_number',
        required: true,
        label: 'Número de póliza',
        align: 'center',
        field: 'policy_number',
        sortable: true,
      },
      {
        name: 'beneficiary',
        required: true,
        label: 'Beneficiario',
        align: 'left',
        field: 'beneficiary',
        sortable: true,
      },
      {
        name: 'insured_value',
        required: true,
        label: 'Valor asegurado',
        align: 'right',
        field: 'insured_value',
        sortable: true,
      },
      {
        name: 'start_validity_date',
        required: true,
        label: 'Fecha inicio de vigencia',
        align: 'center',
        field: 'start_validity_date',
        sortable: true,
      },
      {
        name: 'end_validity_date',
        required: true,
        label: 'Fecha fin de vigencia',
        align: 'center',
        field: 'end_validity_date',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const tableProps_policy_coverage = ref<IBaseTableProps<IPolicyCoverage>>({
    title: 'Cubrimientos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: (row) => row.id,
        sortable: true,
      },
      {
        name: 'risk',
        required: true,
        label: 'Riesgos',
        align: 'left',
        field: (row) => row.risk?.name || 'N/A',
        sortable: true,
      },
      {
        name: 'coverage_percentage',
        required: true,
        label: '% de cubrimiento',
        align: 'center',
        field: 'coverage_percentage',
        sortable: true,
      },
      {
        name: 'coverage_max_value',
        required: true,
        label: 'Valor máximo de cubrimiento',
        align: 'right',
        field: 'coverage_max_value',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const tableProps_attached_documents = ref<IBaseTableProps<IAttachment>>({
    title: 'Documentos anexos',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'document_name',
        required: true,
        label: 'Documento',
        align: 'left',
        field: 'document_name',
        sortable: true,
      },
      {
        name: 'weight',
        required: true,
        label: 'Peso (MB)',
        align: 'center',
        field: 'weight',
        sortable: true,
      },
      {
        name: 'date_loading',
        required: true,
        label: 'Fecha de cargue',
        align: 'center',
        field: 'date_loading',
        sortable: true,
      },
      {
        name: 'user_name',
        required: true,
        label: 'Usuario',
        align: 'left',
        field: 'user_name',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: () => undefined,
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const filtersFormat = ref<Record<string, string | number>>({})
  const alertModalViewRef = ref()
  const alertModalViewConfig = ref({
    title: 'Detalle documento anexo',
    id: 0 as number | 0,
  })

  const listAction = async () => {
    if (!props.contractId) return

    tableProps_annex_document.value.rows = []
    tableProps_annex_document.value.loading = true

    // Solo cargamos los documentos anexos inicialmente
    await _getAnnexDocumentsView(props.contractId)

    tableProps_annex_document.value.loading = false
  }

  // Función para manejar el clic en una fila de documentos anexos
  const handleRowClick = async (row: IAnnexDocument) => {
    if (!props.contractId) return

    selectedAnnexRow.value = row

    // Siempre cargar los documentos adjuntos para cualquier tipo de documento anexo
    tableProps_attached_documents.value.rows = []
    tableProps_attached_documents.value.loading = true

    // Solo cargar la relación y cubrimientos si el tipo de documento es "poliza"
    if (row.type?.type === 'poliza') {
      tableProps_annex_relation.value.rows = []
      tableProps_annex_relation.value.loading = true
      tableProps_policy_coverage.value.rows = []
      tableProps_policy_coverage.value.loading = true

      // Cargar la relación de la póliza, los cubrimientos y documentos adjuntos en paralelo
      await Promise.all([
        _getRelationAnnexDocumentsView(
          props.contractId,
          row.id,           // ID del documento anexo
          row.source        // "contrato" o "adicion"
        ),
        _getCoveringsView(
          props.contractId,
          row.id,           // ID del documento anexo
          row.source        // "contrato" o "adicion"
        ),
        _getAttachedDocumentsView(
          props.contractId,
          row.id,           // ID del documento anexo
          row.source        // "contrato" o "adicion"
        )
      ])

      tableProps_annex_relation.value.loading = false
      tableProps_policy_coverage.value.loading = false
      tableProps_attached_documents.value.loading = false
    } else {
      // Si no es una póliza, solo cargar documentos adjuntos
      await _getAttachedDocumentsView(
        props.contractId,
        row.id,           // ID del documento anexo
        row.source        // "contrato" o "adicion"
      )

      // Limpiar las tablas de relación y cubrimientos
      tableProps_annex_relation.value.rows = []
      tableProps_policy_coverage.value.rows = []
      tableProps_attached_documents.value.loading = false
    }
  }

  const openModalView = async (fileId: number, sourceType: string) => {
    if (props.contractId) {
      await _getDocumentFileView(props.contractId, sourceType, fileId)
      alertModalViewConfig.value.id = fileId
      alertModalViewRef.value.openModal()
    } 
  }

  const closeModalView = () => {
    alertModalViewRef.value.closeModal()
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    await listAction()
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    }

    await listAction()
  }

  onMounted(async () => {
    if (props.contractId) {
      filtersFormat.value = {
        rows: perPage,
      }
      await listAction()
    }
  })

  watch(
    () => annex_documents_view.value,
    () => {
      tableProps_annex_document.value.rows = annex_documents_view.value

      const { currentPage, lastPage } = general_contract_inquiry_pages.value
      tableProps_annex_document.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    () => relation_annex_documents_view.value,
    () => {
      tableProps_annex_relation.value.rows = relation_annex_documents_view.value

      const { currentPage, lastPage } = general_contract_inquiry_pages.value
      tableProps_annex_relation.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    () => coverings_view.value,
    () => {
      tableProps_policy_coverage.value.rows = coverings_view.value

      const { currentPage, lastPage } = general_contract_inquiry_pages.value
      tableProps_policy_coverage.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    () => attached_documents_view.value,
    () => {
      tableProps_attached_documents.value.rows = attached_documents_view.value

      const { currentPage, lastPage } = general_contract_inquiry_pages.value
      tableProps_attached_documents.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch(
    () => props.contractId,
    async (newId) => {
      if (newId) {
        filtersFormat.value = {
          rows: perPage,
        }
        await listAction()
      }
    }
  )

  return {
    goToURL,
    defaultIconsLucide,
    formatDate,
    formatCurrency,
    tableProps_annex_document,
    tableProps_annex_relation,
    tableProps_policy_coverage,
    tableProps_attached_documents,
    openModalView,
    closeModalView,
    updatePage,
    updatePerPage,
    handleRowClick,
    selectedAnnexRow,
    alertModalViewRef,
    alertModalViewConfig,
    clauses_view,
    document_file_view,
  }
}

export default useAnnexDocumentList
