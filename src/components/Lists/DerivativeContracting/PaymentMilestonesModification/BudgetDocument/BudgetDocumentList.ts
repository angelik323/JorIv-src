// Vue , Pinia
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables/useUtils'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IBudgetRecord } from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

// Store
import { usePaymentMilestonesModificationStore } from '@/stores/derivative-contracting/payment-milestones-modification'

const useBudgetDocumentList = (props: {
  contractSubscriptionDate: string
  isLocalCurrency: boolean
  contractValue: number
  foreignValue: number
  trm: number
  currentTotalLocal: number
  currentTotalForeign: number
  milestoneNumber: string
  milestone_id?: number
}) => {
  const { budget_records } = storeToRefs(usePaymentMilestonesModificationStore('v1'))
  const { _getContractBudgetDocument } = usePaymentMilestonesModificationStore('v1')
  const { formatCurrency, formatDate } = useUtils()

  const tableProps = ref<IBaseTableProps<IBudgetRecord>>({
    title: 'Documento presupuestal',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: (row) => row.contract_budget_document?.validity,
        sortable: true,
      },
      {
        name: 'document_type',
        required: true,
        label: 'Tipo documento',
        align: 'left',
        field: (row) => row.contract_budget_document?.budget_document_type_id, // TODO: Map to name if available
        sortable: true,
      },
      {
        name: 'document_value',
        required: true,
        label: 'Valor documento',
        align: 'right',
        field: (row) => row.contract_budget_document?.budget_document_value,
        format: (val) => formatCurrency(val) || '0',
        sortable: true,
      },
      {
        name: 'document_date',
        required: true,
        label: 'Fecha documento',
        align: 'left',
        field: (row) => row.contract_budget_document?.created_at,
        format: (val) => formatDate(val, 'YYYY-MM-DD'),
        sortable: true,
      },
      {
        name: 'available_balance',
        required: true,
        label: 'Saldo disponible',
        align: 'right',
        field: (row) => row.contract_budget_document?.available_balance,
        format: (val) => formatCurrency(val) || '0',
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Numero de documento',
        align: 'left',
        field: (row) => row.contract_budget_document?.budget_document_number,
        sortable: true,
      }
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const loadData = async () => {
    if (props.milestone_id) {
      tableProps.value.loading = true
      await _getContractBudgetDocument(props.milestone_id, {})
      tableProps.value.loading = false
    }
  }

  // Fetch payment types on mount
  onMounted(async () => {
    await loadData()
  })

  watch(() => props.milestone_id, loadData)

  watch(
    () => budget_records.value,
    (newVal) => {
      tableProps.value.rows = newVal || []
    },
    { deep: true, immediate: true }
  )

  const resetForm = () => {
    tableProps.value.rows = []
    loadData()
  }

  const updatePage = (page: number) => {
    tableProps.value.pages.currentPage = page
    loadData()
  }

  const updatePerPage = () => {
    // Implement if needed
  }

  return {
    tableProps,
    resetForm,
    updatePage,
    updatePerPage
  }
}

export default useBudgetDocumentList
