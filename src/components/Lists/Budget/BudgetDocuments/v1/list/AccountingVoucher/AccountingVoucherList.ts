// Vue - pinia - moment
import { ref, watch } from 'vue'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IBudgetDocumentsAccountingVoucherListItem } from '@/interfaces/customs/budget/BudgetDocuments'

// Composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { usePaginatedTableList } from '@/composables/useTableList'
import { useUtils } from '@/composables/useUtils'

// Stores
import { useBudgetDocumentsStore } from '@/stores/budget/budget-documents'

const useAccountingVoucherList = (props: { documentId?: number }) => {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getDocumentAccountingVouchers } = useBudgetDocumentsStore('v1')

  // Refs and computed props
  const tableProps = ref<
    IBaseTableProps<IBudgetDocumentsAccountingVoucherListItem>
  >({
    title: 'Listado documentos contabilidad',
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
        name: 'period',
        field: 'period',
        label: 'Periodo',
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
        name: 'voucher',
        field: (row) => row.voucher.code,
        label: 'Comprobante',
        sortable: true,
        align: 'left',
      },
      {
        name: 'voucher_number',
        field: (row) => row.voucher.number,
        label: 'Número de comprobante',
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
  })

  const tableCustomCols = ['actions']

  // Functions/Methods
  const {
    getFilterFormatValues,
    handleFilterSearch,
    handleUpdatePage,
    handleUpdateRowsPerPage,
  } = usePaginatedTableList({
    tableProps,
    listPromiseFn: _getDocumentAccountingVouchers,
  })

  const handleGoToAccountingView = (
    row: IBudgetDocumentsAccountingVoucherListItem
  ) => {
    goToURL('AccountingReceiptView', row.id)
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

  // Life cycle hooks

  return {
    // composable refs and variables
    defaultIconsLucide,

    // Refs and computed props
    tableProps,
    tableCustomCols,

    // Functions/Methods
    handleUpdatePage,
    handleUpdateRowsPerPage,
    handleGoToAccountingView,
  }
}

export default useAccountingVoucherList
