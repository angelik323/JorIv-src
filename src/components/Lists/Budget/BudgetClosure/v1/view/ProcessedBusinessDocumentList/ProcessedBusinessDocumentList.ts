// Vue - pinia - moment
import { ref, watch } from 'vue'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IBudgetClosureProcessedBusinessDocumentListItemDetail } from '@/interfaces/customs/budget/BudgetClosure'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useBudgetClosureStore } from '@/stores/budget/budget-closure'

const useProcessedBusinessDocumentList = (props: {
  businessId: number | null
  processId: number
}) => {
  const { formatCurrency } = useUtils()

  const { _getProcessedBusinessDocuments } = useBudgetClosureStore('v1')

  const tableProps = ref<
    IBaseTableProps<IBudgetClosureProcessedBusinessDocumentListItemDetail>
  >({
    title: 'Listado de documentos del negocio',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'document_number',
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'document_type',
        field: 'document_type',
        label: 'Tipo de documento',
        align: 'left',
        sortable: true,
      },
      {
        name: 'document_number',
        field: 'document_number',
        label: 'Documento',
        align: 'left',
        sortable: true,
      },
      {
        name: 'level',
        field: 'level',
        label: 'Nivel',
        align: 'left',
        sortable: true,
      },
      {
        name: 'budget_item',
        field: 'budget_item',
        label: 'Rubro presupuestal',
        align: 'left',
        sortable: true,
      },
      {
        name: 'budget_resource',
        field: 'budget_resource',
        label: 'Recurso',
        align: 'left',
        sortable: true,
      },
      {
        name: 'responsability_area',
        field: 'area',
        label: 'Área',
        align: 'left',
        sortable: true,
      },
      {
        name: 'balance',
        field: (row) => formatCurrency(row.balance),
        label: 'Saldo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'value',
        field: (row) => formatCurrency(row.value),
        label: 'Valor',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const documents = ref<
    IBudgetClosureProcessedBusinessDocumentListItemDetail[]
  >([])

  // Functions/Methods
  const rowsPerPage = ref(20)
  const handleTablePagination = () => {
    tableProps.value.pages.lastPage =
      documents.value.length > 0
        ? Math.ceil(documents.value.length / rowsPerPage.value)
        : 1

    const page =
      tableProps.value.pages.currentPage <= tableProps.value.pages.lastPage
        ? tableProps.value.pages.currentPage
        : 1

    tableProps.value.rows = documents.value.slice(
      (page - 1) * rowsPerPage.value,
      page * rowsPerPage.value
    )
  }

  const handleUpdatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
    handleTablePagination()
  }

  const handleUpdateRowsPerPage = (rows: number) => {
    rowsPerPage.value = rows
    tableProps.value.pages.currentPage = 1
    handleTablePagination()
  }

  const listAction = async (processId: number, businessId: number) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const res = await _getProcessedBusinessDocuments(processId, businessId)
    tableProps.value.loading = false
    if (!res) return

    documents.value = res.details
    handleTablePagination()
  }

  watch(
    [() => props.businessId, () => props.processId],
    async ([businessId, processId]) => {
      if (!businessId) return

      await listAction(processId, businessId)
    },
    { immediate: true }
  )

  return {
    // Refs and computed props
    tableProps,

    // Functions/Methods
    handleUpdatePage,
    handleUpdateRowsPerPage,
  }
}

export default useProcessedBusinessDocumentList
