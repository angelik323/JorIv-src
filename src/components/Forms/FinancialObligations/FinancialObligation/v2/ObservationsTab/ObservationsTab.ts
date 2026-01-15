// vue - pinia
import { ref, computed, onMounted } from 'vue'

// interfaces
import { IFinancialObligationAuthorizationObservation } from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'
import { IBaseTableProps } from '@/interfaces/global'

const useObservationsTab = (props: {
  observations: IFinancialObligationAuthorizationObservation[]
}) => {
  // table
  const tableProperties = ref<
    IBaseTableProps<IFinancialObligationAuthorizationObservation>
  >({
    title: 'Observaciones de autorización del registro',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'observation',
        required: false,
        label: 'Observación',
        align: 'left',
        field: 'observation',
        sortable: true,
      },
      {
        name: 'user_name',
        required: false,
        label: 'Nombre del usuario',
        align: 'left',
        field: 'user_name',
        sortable: true,
      },
      {
        name: 'decision_date',
        required: false,
        label: 'Fecha de decisión',
        align: 'left',
        field: (row) => row.decision_date?.slice(0, 10) ?? '',
        sortable: true,
      },
      {
        name: 'status_name',
        required: false,
        label: 'Estado del registro',
        align: 'left',
        field: 'status_name',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  // computed
  const hasObservations = computed(() => props.observations.length > 0)

  // lifecycle
  onMounted(() => {
    tableProperties.value.rows = [...props.observations]
  })

  return {
    tableProperties,
    hasObservations,
  }
}

export default useObservationsTab
