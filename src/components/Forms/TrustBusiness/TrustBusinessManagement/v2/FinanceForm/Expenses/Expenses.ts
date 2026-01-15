// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ITrustBusinessGeneralOrders } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useUtils } from '@/composables'
const { formatCurrency } = useUtils()

const useExpenses = (props: {
  data?: ITrustBusinessGeneralOrders[]
  action: ActionType
}) => {
  // computed
  const selected = ref<number>()
  const selected_expense = ref<ITrustBusinessGeneralOrders>()

  const isLoading = ref(true)

  // table
  const tableProps = ref({
    title: 'Listado encargos',
    loading: false,
    columns: [
      {
        name: 'checked',
        required: true,
        label: '',
        align: 'center',
        field: 'checked',
        sortable: true,
      },
      {
        name: 'id',
        required: true,
        field: 'id',
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'number',
        required: true,
        field: 'number',
        label: 'Número de encargo',
        align: 'center',
        sortable: true,
      },
      {
        name: 'name',
        field: 'name',
        required: true,
        label: 'Nombre del encargo',
        align: 'center',
        sortable: true,
      },
      {
        name: 'stage',
        required: true,
        field: (row) => row.stage?.stage_number,
        label: 'Etapa',
        align: 'center',
        sortable: true,
      },
      {
        name: 'available_balance',
        required: true,
        field: (row) => row.currency?.value,
        label: 'Saldo disponible',
        align: 'center',
        sortable: true,
      },
      {
        name: 'record_status_id',
        field: 'record_status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as ITrustBusinessGeneralOrders[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const pageSize = ref(20)

  const paginated = computed(() => {
    const start = (tableProps.value.pages.currentPage - 1) * pageSize.value
    return (tableProps.value.rows as []).slice(start, start + pageSize.value)
  })

  const update_rows_per_page = (val: number) => {
    pageSize.value = val
    tableProps.value.pages.currentPage = 1
  }

  // actions
  const getInfoRow = () => {
    if (!selected.value) return

    selected_expense.value = tableProps.value.rows.find(
      (row) => row.id === selected.value
    )
  }

  // lifecycle
  onMounted(() => {
    isLoading.value = true
    tableProps.value.rows = props.data || []
    isLoading.value = false
  })

  // watchs
  watch(
    selected,
    async () => {
      await getInfoRow()
    },
    { deep: true }
  )

  return {
    selected,
    selected_expense,
    isLoading,

    tableProps,
    paginated,

    update_rows_per_page,
    formatCurrency,
  }
}

export default useExpenses
