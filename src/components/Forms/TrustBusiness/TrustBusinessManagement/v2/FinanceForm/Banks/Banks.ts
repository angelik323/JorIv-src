// vue - pinia - quasar
import { computed, onMounted, ref } from 'vue'
import { QTable } from 'quasar'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { IBankAccount } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// composables
import { useUtils } from '@/composables'
const { defaultIconsLucide } = useUtils()

const useBanks = (props: { data?: IBankAccount[]; action: ActionType }) => {
  const tableProps = ref({
    title: 'Listado de cuentas bancarias',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        field: 'id',
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'bank',
        required: true,
        field: (row) => row.bank?.description,
        label: 'Banco',
        align: 'center',
        sortable: true,
      },
      {
        name: 'bank_account_type',
        field: (row) => row.account_type,
        required: true,
        label: 'Tipo de cuenta bancaria',
        align: 'center',
        sortable: true,
      },
      {
        name: 'bank_account_number',
        required: true,
        field: (row) => row.account_number,
        label: 'Número de cuenta',
        align: 'center',
        sortable: true,
      },
      {
        name: 'bank_account_name',
        required: true,
        field: (row) => row.account_name,
        label: 'Nombre cuenta',
        align: 'center',
        sortable: true,
      },
      {
        name: 'status_id',
        field: (row) => row.status?.id,
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as unknown,
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

  // lifecycle
  onMounted(() => {
    tableProps.value.rows = props.data as []
  })

  return {
    defaultIconsLucide,

    tableProps,
    paginated,
    pageSize,
    update_rows_per_page,
  }
}

export default useBanks
