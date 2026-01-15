// Vue - pinia - moment
import { ref, watch } from 'vue'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IBudgetDocumentsPaymentOrderListItem } from '@/interfaces/customs/budget/BudgetDocuments'

// Composables
import { usePaginatedTableList } from '@/composables/useTableList'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useBudgetDocumentsStore } from '@/stores/budget/budget-documents'

const usePaymentOrderList = (props: { documentId?: number }) => {
  const { defaultIconsLucide, formatDate } = useUtils()

  const { _getDocumentPaymentOrders } = useBudgetDocumentsStore('v1')

  // Refs and computed props
  const tableProps = ref<IBaseTableProps<IBudgetDocumentsPaymentOrderListItem>>(
    {
      title: 'Listado de órdenes de pago',
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
          name: 'date',
          field: (row) => formatDate(row.date, 'YYYY-MM-DD'),
          label: 'Fecha',
          sortable: true,
          align: 'left',
        },
        {
          name: 'payment_order',
          field: 'payment_order',
          label: 'Comprobante',
          sortable: true,
          align: 'left',
        },
        {
          name: 'actions',
          field: 'id',
          label: 'Acciones',
          required: false,
          sortable: false,
          align: 'left',
        },
      ],
      rows: [],
      pages: { currentPage: 0, lastPage: 0 },
    }
  )

  const tableCustomCols = ['actions']

  // Functions/Methods
  const {
    getFilterFormatValues,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
  } = usePaginatedTableList({
    tableProps,
    listPromiseFn: _getDocumentPaymentOrders,
  })

  const handleGoToCXPView = (_row: IBudgetDocumentsPaymentOrderListItem) => {
    // TODO: Update route redirection
    // goToURL('AccountingReceiptView', row.id)
  }

  // Watchers
  watch(
    () => props.documentId,
    async (documentId) => {
      if (!documentId) return

      await handleFilterSearch({
        ...getFilterFormatValues(),
        documentId,
      })
    },
    { immediate: true }
  )

  return {
    // composable refs and variables
    defaultIconsLucide,

    // Refs and computed props
    tableProps,
    tableCustomCols,

    // Functions/Methods
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handleGoToCXPView,
  }
}

export default usePaymentOrderList
