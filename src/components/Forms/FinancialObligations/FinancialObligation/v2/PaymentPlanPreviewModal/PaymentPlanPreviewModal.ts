import { ref } from 'vue'
import { useUtils } from '@/composables'

const usePaymentPlanPreviewModal = () => {
  // composables
  const { formatCurrencyString } = useUtils()

  // state
  const isOpen = ref(false)
  
  // types
  interface PaymentPlanPreviewRow {
    id?: number | string
    obligation_id?: number | string
    number_quota?: number | string
    [key: string]: unknown
  }
  // columns
  const columns = [
    { name: 'id', label: '#', field: (row: PaymentPlanPreviewRow) => row?.id ?? row?.obligation_id ?? row?.number_quota, align: 'center' as const, sortable: false },
    { name: 'number_quota', label: 'No. Cuota', field: 'number_quota', align: 'center' as const, sortable: true },
    { name: 'initial_balance', label: 'Saldo inicial', field: 'initial_balance', align: 'right' as const, sortable: false },
    { name: 'total_quota', label: 'Valor total de la cuota', field: 'total_quota', align: 'right' as const, sortable: false },
    { name: 'interest_mora', label: 'Interés por mora', field: 'interest_mora', align: 'right' as const, sortable: false },
    { name: 'capital', label: 'Cuota capital', field: 'capital', align: 'right' as const, sortable: true },
    { name: 'final_balance', label: 'Saldo final', field: 'final_balance', align: 'right' as const, sortable: true },
    { name: 'payment_date', label: 'Fecha de vencimiento', field: 'payment_date', align: 'center' as const, sortable: true },
    { name: 'status', label: 'Estado', field: 'status', align: 'center' as const, sortable: false },
  ]

  // utils
  const formatCurrency = (value: number): string => {
    return formatCurrencyString(value) ?? '$0,00'
  }

  // modal actions
  const openModal = () => {
    isOpen.value = true
  }

  const closeModal = () => {
    isOpen.value = false
  }

  return {
    // state
    isOpen,

    // columns
    columns,

    // utils
    formatCurrency,

    // modal actions
    openModal,
    closeModal,
  }
}

export default usePaymentPlanPreviewModal
