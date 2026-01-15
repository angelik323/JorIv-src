import { onMounted, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'

//Interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { 
  IScheduledPaymentMilestone, 
  IMilestoneBudget 
} from '@/interfaces/customs/derivative-contracting/GeneralContractInquiry'

//Stores
import { useGeneralContractInquiryStore } from '@/stores/derivative-contracting/general-contract-inquiry'

const useScheduledPaymentMilestonesList = (
  props: {
    contractId?: number | null
  }
) => {

  const { _getScheduledPaymentMilestonesView } = useGeneralContractInquiryStore('v1')

  const { scheduled_payment_milestones_view, general_contract_inquiry_pages } = storeToRefs(
    useGeneralContractInquiryStore('v1')
  )

  let perPage = 20

  // Tabla de Hitos de Pago Programados
  const milestonesTableProps = ref<IBaseTableProps<IScheduledPaymentMilestone>>({
    title: 'Hitos de pago programados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'milestone',
        required: true,
        label: '#',
        align: 'center',
        field: (row) => row.milestone,
        sortable: true,
      },
      {
        name: 'contract_number',
        required: true,
        label: 'Número de Contrato',
        align: 'left',
        field: (row) => {
          return row.addition_number 
            ? `${row.contract_number} - ${row.addition_number}` 
            : row.contract_number
        },
        sortable: true,
      },
      {
        name: 'category',
        required: true,
        label: 'Categoría',
        align: 'center',
        field: (row) => row.category,
        sortable: true,
      },
      {
        name: 'payment_type',
        required: true,
        label: 'Tipo de pago',
        align: 'center',
        field: (row) => row.payment_type || 'N/A',
        sortable: true,
      },
      {
        name: 'milestone_date',
        required: true,
        label: 'Fecha',
        align: 'center',
        field: (row) => row.milestone_date,
        sortable: true,
      },
      {
        name: 'foreign_amount',
        required: true,
        label: 'Monto extranjero',
        align: 'right',
        field: 'foreign_amount',
        sortable: true,
      },
      {
        name: 'milestone_value',
        required: true,
        label: 'Valor del hito',
        align: 'right',
        field: 'milestone_value',
        sortable: true,
      },
      {
        name: 'budget_status',
        required: true,
        label: 'Presupuesto',
        align: 'center',
        field: (row) => {
          // TODO: Implementar lógica de estado del presupuesto
          // Ejecutado, Asignado, Proyectado
          return row.applies_budget ? 'Asignado' : 'N/A'
        },
        sortable: true,
      },
      {
        name: 'payment_request',
        required: false,
        label: 'Solicitud de pago',
        align: 'right',
        field: () => {
          // TODO: Implementar cuando se tenga la información de solicitud de pago
          return 0
        },
        sortable: true,
      },
      {
        name: 'payment_order',
        required: false,
        label: 'Orden de pago',
        align: 'center',
        field: () => {
          // TODO: Implementar cuando se tenga la información de orden de pago
          return 0
        },
        sortable: true,
      },
      {
        name: 'payment_order_status',
        required: false,
        label: 'Estado de la orden de pago',
        align: 'center',
        field: () => {
          // TODO: Implementar cuando se tenga la información del estado
          return 'N/A'
        },
        sortable: true,
      },
      {
        name: 'milestone_status',
        required: true,
        label: 'Estado del hito',
        align: 'center',
        field: 'status',
        sortable: true,
      },
      {
        name: 'applies_budget',
        required: true,
        label: 'Aplica presupuesto',
        align: 'center',
        field: 'applies_budget',
        sortable: true,
      },
    ],
    rows: [],
    pages: general_contract_inquiry_pages.value
  })

  // Tabla de Presupuesto de Hito
  const budgetTableProps = ref<IBaseTableProps<IMilestoneBudget>>({
    title: 'Presupuesto de hito',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'budget_resource',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: (row) => {
          return `${row.budget_resource.code} - ${row.budget_resource.description}`
        },
        sortable: true,
      },
      {
        name: 'area_resposability',
        required: true,
        label: 'Área',
        align: 'left',
        field: (row) => {
          return `${row.area_resposability.code} - ${row.area_resposability.description}`
        },
        sortable: true,
      },
      {
        name: 'budget_item',
        required: true,
        label: 'Rubro',
        align: 'left',
        field: (row) => {
          return `${row.budget_item.code} - ${row.budget_item.description}`
        },
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor',
        align: 'right',
        field: 'value',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  // Totales calculados
  const totals = computed(() => {
    const milestones = milestonesTableProps.value.rows

    const totalProgrammedForeign = milestones.reduce((sum, m) => {
      return sum + (m.foreign_amount || 0)
    }, 0)

    const totalProgrammedCOP = milestones.reduce((sum, m) => {
      return sum + parseFloat(m.milestone_value || '0')
    }, 0)

    // TODO: Implementar lógica de pendientes cuando se tenga información de solicitud de pago
    const totalPendingForeign = totalProgrammedForeign
    const totalPendingCOP = totalProgrammedCOP

    return {
      totalProgrammedForeign,
      totalProgrammedCOP,
      totalPendingForeign,
      totalPendingCOP,
    }
  })

  const milestonesFiltersFormat = ref<Record<string, string | number>>({})

  const listAction = async () => {
    if (!props.contractId) return

    milestonesTableProps.value.rows = []
    milestonesTableProps.value.loading = true
    budgetTableProps.value.rows = []

    await _getScheduledPaymentMilestonesView(props.contractId)

    milestonesTableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    milestonesFiltersFormat.value = {
      ...milestonesFiltersFormat.value,
      page: page,
    }
    await listAction()
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    milestonesFiltersFormat.value = {
      ...milestonesFiltersFormat.value,
      rows: perPage,
      page: 1,
    }

    await listAction()
  }

  // Función para mostrar el presupuesto de un hito específico
  const showMilestoneBudget = (milestone: IScheduledPaymentMilestone) => {
    if (milestone.applies_budget && milestone.budget && milestone.budget.length > 0) {
      budgetTableProps.value.rows = [...milestone.budget]
    } else {
      budgetTableProps.value.rows = []
    }
  }

  onMounted(async () => {
    if (props.contractId) {
      milestonesFiltersFormat.value = {
        rows: perPage,
      }
      await listAction()
    }
  })

  watch(
    () => scheduled_payment_milestones_view.value,
    () => {
      milestonesTableProps.value.rows = [...scheduled_payment_milestones_view.value]

      const { currentPage, lastPage } = general_contract_inquiry_pages.value
      milestonesTableProps.value.pages = {
        currentPage,
        lastPage,
      }

      // Mostrar presupuesto del primer hito si existe
      if (scheduled_payment_milestones_view.value.length > 0) {
        showMilestoneBudget(scheduled_payment_milestones_view.value[0])
      }
    },
    { deep: true }
  )

  watch(
    () => props.contractId,
    async (newId) => {
      if (newId) {
        milestonesFiltersFormat.value = {
          rows: perPage,
        }
        await listAction()
      }
    }
  )

  return {
    milestonesTableProps,
    budgetTableProps,
    totals,
    
    updatePage,
    updatePerPage,
    showMilestoneBudget,
  }
}

export default useScheduledPaymentMilestonesList
