
// Vue , Pinia
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IContractFutureValidityMilestone } from '@/interfaces/customs/derivative-contracting/PaymentMilestonesModification'

//Stores
import { usePaymentMilestonesModificationStore } from '@/stores/derivative-contracting/payment-milestones-modification'

const useFutureTermsList = (props: { milestones_id: number }) => {
  const { formatCurrency } = useUtils()

  const {
    contract_future_validity,
  } = storeToRefs(usePaymentMilestonesModificationStore('v1'))

  const { _getContractFutureValidity } = usePaymentMilestonesModificationStore('v1')

  const tablePropsFutureValidity = ref<IBaseTableProps<IContractFutureValidityMilestone>>({
    columns: [
      {
        name: 'fiscal_year',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: (row) => row.futureValidity?.fiscal_year,
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Numero documento presupuestal',
        align: 'left',
        field: (row) => row.id,
        sortable: true,
      },
      {
        name: 'budget_resource',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: (row) => row.futureValidity?.budget_resource?.code,
        sortable: true,
      },
      {
        name: 'budget_area',
        required: true,
        label: 'Area',
        align: 'left',
        field: (row) => row.futureValidity?.budget_area?.code,
        sortable: true,
      },
      {
        name: 'budget_item',
        required: true,
        label: 'Rubro',
        align: 'left',
        field: (row) => row.futureValidity?.budget_item?.code,
        sortable: true,
      },
      {
        name: 'projected_value',
        required: true,
        label: 'Valor proyectado',
        align: 'right',
        field: (row) => row.futureValidity?.projected_value,
        format: (val: string | number) => formatCurrency(val) || '0',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const loadData = async () => {
    tablePropsFutureValidity.value.loading = true
    await _getContractFutureValidity(props.milestones_id, {
      page: tablePropsFutureValidity.value.pages.currentPage,
    })
    tablePropsFutureValidity.value.loading = false
  }

  // Fetch payment types on mount
  onMounted(async () => {
    await loadData()
  })

  //contract_future_validity watcher
  watch(
    () => contract_future_validity.value,
    () => {
      tablePropsFutureValidity.value.rows = contract_future_validity.value
    },
    { deep: true, immediate: true }
  )

  const updatePage = (page: number) => {
    tablePropsFutureValidity.value.pages.currentPage = page
    loadData()
  }

  const updatePerPage = () => {
    // Logic to update rows per page
  }

  return {
    tablePropsFutureValidity,
    updatePage,
    updatePerPage
  }
}

export default useFutureTermsList
