// Vue - pinia - moment
import { ref, watch } from 'vue'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IBudgetDocumentsAssociatedListItem } from '@/interfaces/customs/budget/BudgetDocuments'

// Composables
import { useUtils } from '@/composables/useUtils'
import { usePaginatedTableList } from '@/composables/useTableList'

// Stores
import { useBudgetDocumentsStore } from '@/stores/budget/budget-documents'

const useAssociatedBudgetDocumentsList = (props: { documentId: number }) => {
  const { formatCurrency } = useUtils()

  const { _getAssociatedDocumentsById } = useBudgetDocumentsStore('v1')

  // Refs and computed props
  const tableProps = ref<IBaseTableProps<IBudgetDocumentsAssociatedListItem>>({
    title: 'Listado documentos asociados',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        sortable: true,
        align: 'left',
      },
      {
        name: 'validity',
        field: 'vigency',
        label: 'Vigencia',
        sortable: true,
        align: 'left',
      },
      {
        name: 'document_type',
        field: (row) => row.document_type.name,
        label: 'Tipo de documento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'document_type_number',
        field: (row) => row.document_type.document_number,
        label: 'Número de documento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'balance',
        field: (row) => formatCurrency(row.balance),
        label: 'Valor',
        sortable: true,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const selectedDocument = ref<IBudgetDocumentsAssociatedListItem | null>(null)

  // Functions/Methods
  const {
    getFilterFormatValues,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
  } = usePaginatedTableList({
    tableProps,
    listPromiseFn: _getAssociatedDocumentsById,
  })

  const handleSelectedDocuments = (
    selectedDocuments: IBudgetDocumentsAssociatedListItem[]
  ) => {
    const [document] = selectedDocuments
    if (!document) return

    selectedDocument.value = document
  }

  // Watchers
  watch(
    () => props.documentId,
    async (documentId) => {
      await handleFilterSearch({
        ...getFilterFormatValues(),
        documentId,
      })
    },
    { immediate: true }
  )

  return {
    // Refs and computed props
    tableProps,
    selectedDocument,

    // Functions/Methods
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handleSelectedDocuments,
  }
}

export default useAssociatedBudgetDocumentsList
