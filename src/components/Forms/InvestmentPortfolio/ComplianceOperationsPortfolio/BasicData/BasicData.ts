import { useMainLoader, useUtils } from '@/composables'
import {
  IComplianceOperationsPortfolio,
  IComplianceOperationsPortfolioForm,
} from '@/interfaces/customs'
import { ExtendedActionTypeCancel } from '@/interfaces/global'
import {
  useComplianceOperationsPortfolioStore,
  useInvestmentPortfolioResourceStore,
} from '@/stores'
import moment from 'moment'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { ref, computed, onMounted } from 'vue'

const createDefaultModels = (): IComplianceOperationsPortfolioForm => ({
  date: moment().format('YYYY-MM-DD'),
  operation_nature: '',
  instruction_slip_ids: [],
})

const useBasicDataComplianceOperationsPortfolioForm = (
  action: ExtendedActionTypeCancel
) => {
  const basicDataFormRef = ref()
  const models = ref<IComplianceOperationsPortfolioForm>(createDefaultModels())
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  const {
    _getComplianceOperationsPortfolioList,
    _cancelComplianceOperationsPortfolio,
  } = useComplianceOperationsPortfolioStore('v1')

  const { operation_compliance_statuses } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const STATUS_ID_COMPLIANCE = ref(0)
  const STATUS_ID_PENDING_COMPLIANCE = ref(0)

  const cancelModalRef = ref()
  const cancelModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea anular el cumplimiento operaciones portafolio?',
    id: null as number | null,
  })

  const paymentMethodLabel = computed(() => {
    const operationType =
      models.value.operation_nature === 'Ingreso' ? 'pago' : 'recaudo'
    return `Forma de ${operationType}`
  })

  const tableComplianceOperationsPortfolio = ref({
    title: 'Listado de operaciones por cumplir',
    loading: false,
    columns: [
      {
        name: 'investment_portfolio_id',
        required: true,
        label: 'Portafolio',
        align: 'left',
        field: 'investment_portfolio_id',
        sortable: true,
      },
      {
        name: 'investment_portfolio',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: 'investment_portfolio',
        sortable: true,
      },
      {
        name: 'instrucion_slip_id',
        required: true,
        label: 'Número de papeleta',
        align: 'left',
        field: 'instrucion_slip_id',
        sortable: true,
      },
      {
        name: 'operation_value',
        required: true,
        label: 'Valor operación',
        align: 'left',
        field: 'operation_value',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IComplianceOperationsPortfolio[],
    wrapCells: true,
  })

  const tableDetailsComplianceOperationsPortfolio = ref({
    title: 'Detalle listado de operaciones por cumplir',
    loading: false,
    columns: [
      {
        name: 'payment-or-collection-method',
        required: true,
        label: 'Forma de pago',
        align: 'left',
        field: 'payment_or_collection_method',
        sortable: true,
      },
      {
        name: 'compliance_bank',
        required: true,
        label: 'Banco cumplimiento',
        align: 'left',
        field: 'compliance_bank',
        sortable: true,
      },
      {
        name: 'compliance_bank_account',
        required: true,
        label: 'Cuenta cumplimiento',
        align: 'left',
        field: 'compliance_bank_account',
        sortable: true,
      },
      {
        name: 'operation_value',
        required: true,
        label: 'Valor Cumplimiento',
        align: 'left',
        field: 'operation_value',
        sortable: true,
      },
      {
        name: 'benefit',
        required: true,
        label: 'Beneficiario',
        align: 'left',
        field: 'benefit',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IComplianceOperationsPortfolio[],
    wrapCells: true,
  })

  const handleSelectedRows = (
    selectedRows: IComplianceOperationsPortfolio[]
  ) => {
    models.value.instruction_slip_ids = selectedRows.map(
      (row) => row.instrucion_slip_id
    )
    tableDetailsComplianceOperationsPortfolio.value.rows = selectedRows
  }

  const handleChangeNatureOperation = async (value: string) => {
    models.value.operation_nature = value
    models.value.instruction_slip_ids = []
    tableComplianceOperationsPortfolio.value.rows = []
    tableDetailsComplianceOperationsPortfolio.value.rows = []
    tableComplianceOperationsPortfolio.value.loading = true
    const response = await _getComplianceOperationsPortfolioList(
      `&filter[operation_nature]=${value}&filter[status]=${
        action === 'create'
          ? STATUS_ID_PENDING_COMPLIANCE.value
          : STATUS_ID_COMPLIANCE.value
      }`
    )
    tableComplianceOperationsPortfolio.value.rows = response.map((item) => ({
      ...item,
      id: item.instrucion_slip_id,
    }))
    tableComplianceOperationsPortfolio.value.loading = false
  }

  const handleCancelModal = (row: IComplianceOperationsPortfolio) => {
    cancelModalConfig.value.id = row.instrucion_slip_id
    cancelModalRef.value.openModal()
  }

  const handleCancelOperation = async () => {
    if (cancelModalConfig.value.id) {
      cancelModalRef.value.closeModal()
      openMainLoader(true)
      const success = await _cancelComplianceOperationsPortfolio(
        cancelModalConfig.value.id
      )
      if (success) {
        tableComplianceOperationsPortfolio.value.rows =
          tableComplianceOperationsPortfolio.value.rows.filter(
            (r) => r.instrucion_slip_id !== cancelModalConfig.value.id
          )
        tableDetailsComplianceOperationsPortfolio.value.rows =
          tableDetailsComplianceOperationsPortfolio.value.rows.filter(
            (r) => r.instrucion_slip_id !== cancelModalConfig.value.id
          )
        models.value.instruction_slip_ids =
          models.value.instruction_slip_ids.filter(
            (id) => id !== cancelModalConfig.value.id
          )
      }
      openMainLoader(false)
    }
  }

  onMounted(() => {
    if (action === 'cancel') {
      tableDetailsComplianceOperationsPortfolio.value.columns?.push({
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      })
    }

    STATUS_ID_COMPLIANCE.value = operation_compliance_statuses.value.find(
      (status) => status.label === 'Completado'
    )?.value as number
    STATUS_ID_PENDING_COMPLIANCE.value =
      operation_compliance_statuses.value.find(
        (status) => status.label === 'Pendiente'
      )?.value as number
  })

  return {
    models,
    basicDataFormRef,
    paymentMethodLabel,
    tableComplianceOperationsPortfolio,
    tableDetailsComplianceOperationsPortfolio,
    defaultIconsLucide,
    cancelModalRef,
    cancelModalConfig,
    handleSelectedRows,
    handleChangeNatureOperation,
    handleCancelModal,
    handleCancelOperation,
  }
}

export default useBasicDataComplianceOperationsPortfolioForm
