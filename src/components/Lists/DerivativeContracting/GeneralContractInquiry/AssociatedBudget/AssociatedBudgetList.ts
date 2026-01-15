import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IAssociatedBudget } from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

//Composables
import { useUtils } from '@/composables'

//Stores
import { useGeneralContractInquiryStore } from '@/stores/derivative-contracting/general-contract-inquiry'

const useAssociatedBudgetList = (
  props: {
    contractId?: number | null
  }
) => {

  const { _getAssociatedBudgetView, _getAssociatedBudgetCommitmentView } = useGeneralContractInquiryStore('v1')

  const { associated_budget_view, associated_budget_commitment_view, general_contract_inquiry_pages } = storeToRefs(
    useGeneralContractInquiryStore('v1')
  )

  const { formatDate, formatCurrency } = useUtils()

  let perPage = 20

  // Ref para almacenar la fila seleccionada de disponibilidad
  const selectedBudgetRow = ref<IAssociatedBudget | null>(null)

  const tableProps_associated_budget_availability = ref<IBaseTableProps<IAssociatedBudget>>({
    title: 'Disponibilidad',
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
        name: 'source',
        required: true,
        label: 'Fuente',
        align: 'left',
        field: 'source',
        sortable: true,
      },
      {
        name: 'contract_number',
        required: true,
        label: 'Número de contrato',
        align: 'left',
        field: 'contract_number',
        sortable: true,
      },
      {
        name: 'category',
        required: true,
        label: 'Categoría',
        align: 'center',
        field: 'category',
        sortable: true,
      },
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'center',
        field: 'validity',
        sortable: true,
      },
      {
        name: 'type_budget_document',
        required: true,
        label: 'Tipo de documento presupuestal',
        align: 'left',
        field: (row) => row.type_budget_document?.description || 'N/A',
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Número de documento',
        align: 'center',
        field: 'document_number',
        sortable: true,
      },
      {
        name: 'date',
        required: true,
        label: 'Fecha',
        align: 'center',
        field: 'date',
        sortable: true,
      },
      {
        name: 'document_value',
        required: true,
        label: 'Valor del documento',
        align: 'right',
        field: 'document_value',
        sortable: true,
      },
      {
        name: 'contract_assigned_value',
        required: true,
        label: 'Valor asignado al contrato',
        align: 'right',
        field: 'contract_assigned_value',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 }
  })

  const tableProps_associated_budget_commitment = ref<IBaseTableProps<IAssociatedBudget>>({
    title: 'Compromiso',
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
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'center',
        field: 'validity',
        sortable: true,
      },
      {
        name: 'type_budget_document',
        required: true,
        label: 'Tipo de documento presupuestal',
        align: 'left',
        field: (row) => row.type_budget_document?.description || 'N/A',
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Número',
        align: 'center',
        field: 'document_number',
        sortable: true,
      },
      {
        name: 'date',
        required: true,
        label: 'Fecha',
        align: 'center',
        field: 'date',
        sortable: true,
      },
      {
        name: 'document_value',
        required: true,
        label: 'Valor documento',
        align: 'right',
        field: 'document_value',
        sortable: true,
      },
    ],
    rows: [],
    pages: general_contract_inquiry_pages.value
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async () => {
    if (!props.contractId) return

    tableProps_associated_budget_availability.value.rows = []
    tableProps_associated_budget_availability.value.loading = true

    // Solo cargamos la disponibilidad inicialmente
    await _getAssociatedBudgetView(props.contractId)

    tableProps_associated_budget_availability.value.loading = false
  }

  // Función para manejar el clic en una fila de disponibilidad
  const handleRowClick = async (row: IAssociatedBudget) => {
    if (!props.contractId) return

    selectedBudgetRow.value = row
    tableProps_associated_budget_commitment.value.rows = []
    tableProps_associated_budget_commitment.value.loading = true

    // Cargar los compromisos asociados a la fila seleccionada
    await _getAssociatedBudgetCommitmentView(
      props.contractId,
      row.source,      // "contrato" o "adicion"
      row.source === 'contrato' ? row.id : row.id           // ID del presupuesto
    )

    tableProps_associated_budget_commitment.value.loading = false
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
    () => associated_budget_view.value,
    () => {
      tableProps_associated_budget_availability.value.rows = associated_budget_view.value
    },
    { deep: true }
  )

  watch(
    () => associated_budget_commitment_view.value,
    () => {
      tableProps_associated_budget_commitment.value.rows = associated_budget_commitment_view.value

      const { currentPage, lastPage } = general_contract_inquiry_pages.value
      tableProps_associated_budget_commitment.value.pages = {
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
    formatDate,
    formatCurrency,
    tableProps_associated_budget_availability,
    tableProps_associated_budget_commitment,
    updatePage,
    updatePerPage,
    handleRowClick,
  }
}

export default useAssociatedBudgetList
