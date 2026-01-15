// core
import { ref, watch, computed } from 'vue'

// interfaces
import { ActionType } from '@/interfaces/global'
import { IBaseTableProps } from '@/interfaces/global'
import {
  IFirstAuthorizationBasicData,
  IPaymentDetail,
  IPaymentInstruction,
  ILiquidation,
} from '@/interfaces/customs/accounts-payable/FirstAuthorizationTaxSettlement'

// composables
import { useUtils } from '@/composables'

// stores
import { useFirstAuthorizationTaxSettlementStore } from '@/stores/accounts-payable/first-authorization-tax-settlement'

const useBasicDataView = (
  props: {
    action?: ActionType
    data?: IFirstAuthorizationBasicData | null
    paymentDetails?: IPaymentDetail[]
    paymentInstructions?: IPaymentInstruction[]
    paymentLiquidations?: ILiquidation[]
  },
  emit: {
    (e: 'reload'): void
  }
) => {
  const { _authorizeOrRejectFirstAuthorization } =
    useFirstAuthorizationTaxSettlementStore('v1')

  const { defaultIconsLucide, formatCurrency } = useUtils()

  const basicDataFormRef = ref()

  const models = ref<IFirstAuthorizationBasicData>({
    office_code: null,
    office_description: null,
    from_business: null,
    from_business_name: null,
    to_business: null,
    to_business_name: null,
    from_request: null,
    to_request: null,
    amount_from: null,
    amount_to: null,
    request_status: null,
    request_status_id: null,
    authorization_status: null,
    authorization_status_id: null,
    payment_request_id: null,
    operation_office_id: null,
    business_trust_id: null,
  })

  const paymentDetailTable = ref<IBaseTableProps<IPaymentDetail>>({
    title: 'Detalle pago',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: false,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: 'business',
        sortable: false,
      },
      {
        name: 'instruction_date',
        required: true,
        label: 'Fecha instrucción',
        align: 'left',
        field: 'instruction_date',
        sortable: false,
      },
      {
        name: 'reception_date',
        required: true,
        label: 'Fecha radicación',
        align: 'left',
        field: 'reception_date',
        sortable: false,
      },
      {
        name: 'payment_request_number',
        required: true,
        label: 'Número solicitud de pago',
        align: 'left',
        field: 'payment_request_number',
        sortable: false,
      },
      {
        name: 'upload_number',
        required: true,
        label: 'Número cargue',
        align: 'left',
        field: (row: IPaymentDetail) => row.upload_number ?? '',
        sortable: false,
      },
      {
        name: 'asset_number',
        required: true,
        label: 'Número bien',
        align: 'left',
        field: 'asset_number',
        sortable: false,
      },
      {
        name: 'internal_consecutive',
        required: true,
        label: 'Consecutivo interno',
        align: 'left',
        field: (row: IPaymentDetail) => row.internal_consecutive ?? '',
        sortable: false,
      },
      {
        name: 'client_consecutive',
        required: true,
        label: 'Consecutivo cliente',
        align: 'left',
        field: (row: IPaymentDetail) => row.client_consecutive ?? '',
        sortable: false,
      },
      {
        name: 'supplier_issuer',
        required: true,
        label: 'Proveedor / Emisor',
        align: 'left',
        field: 'supplier_issuer',
        sortable: false,
      },
      {
        name: 'payment_instruction',
        required: true,
        label: 'Instrucción de pago',
        align: 'center',
        field: (row: IPaymentDetail) =>
          row.has_payment_instruction ? 'S' : 'N',
        sortable: false,
      },
      {
        name: 'origin',
        required: true,
        label: 'Origen',
        align: 'left',
        field: 'origin',
        sortable: false,
      },
      {
        name: 'payment_type',
        required: true,
        label: 'Tipo de pago',
        align: 'left',
        field: 'payment_type',
        sortable: false,
      },
      {
        name: 'base_value',
        required: true,
        label: 'Valor base',
        align: 'right',
        field: (row: IPaymentDetail) => formatCurrency(row.base_value),
        sortable: false,
      },
      {
        name: 'discount_value',
        required: true,
        label: 'Valor descuentos',
        align: 'right',
        field: (row: IPaymentDetail) => formatCurrency(row.discount_value),
        sortable: false,
      },
      {
        name: 'net_value',
        required: true,
        label: 'Valor neto',
        align: 'right',
        field: (row: IPaymentDetail) => formatCurrency(row.net_value),
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const instructionsTableProps = ref<IBaseTableProps<IPaymentInstruction>>({
    title: 'Instrucción de pago',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'instruction_number',
        required: true,
        label: 'Número de instrucción',
        align: 'left',
        field: 'instruction_number',
        sortable: false,
      },
      {
        name: 'payment_form',
        required: true,
        label: 'Forma de pago',
        align: 'left',
        field: 'payment_form',
        sortable: false,
      },
      {
        name: 'resource_source',
        required: true,
        label: 'Fuente de recursos',
        align: 'left',
        field: 'resource_source',
        sortable: false,
      },
      {
        name: 'fund',
        required: true,
        label: 'Fondo',
        align: 'left',
        field: (row: IPaymentInstruction) => row.fund ?? '',
        sortable: false,
      },
      {
        name: 'investment_plan',
        required: true,
        label: 'Plan de inversión',
        align: 'left',
        field: (row: IPaymentInstruction) => row.investment_plan ?? '',
        sortable: false,
      },
      {
        name: 'bank',
        required: true,
        label: 'Banco',
        align: 'left',
        field: (row: IPaymentInstruction) => row.bank ?? '',
        sortable: false,
      },
      {
        name: 'bank_account',
        required: true,
        label: 'Cuenta bancaria',
        align: 'left',
        field: (row: IPaymentInstruction) => row.bank_account ?? '',
        sortable: false,
      },
      {
        name: 'net_value',
        required: true,
        label: 'Valor neto',
        align: 'right',
        field: (row: IPaymentInstruction) => formatCurrency(row.net_value),
        sortable: false,
      },
      {
        name: 'instruction_status',
        required: true,
        label: 'Estado instrucción',
        align: 'center',
        field: 'instruction_status',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const selectedInstruction = ref<IPaymentInstruction[]>([])

  const liquidationTableProps = ref<IBaseTableProps<ILiquidation>>({
    title: 'Liquidación',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: false,
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: 'type',
        sortable: false,
      },
      {
        name: 'tax_copy',
        required: true,
        label: 'Cargo fiscal',
        align: 'left',
        field: 'tax_copy',
        sortable: false,
      },
      {
        name: 'concept',
        required: true,
        label: 'Concepto',
        align: 'left',
        field: 'concept',
        sortable: false,
      },
      {
        name: 'base',
        required: true,
        label: 'Base',
        align: 'right',
        field: (row: ILiquidation) => formatCurrency(row.base),
        sortable: false,
      },
      {
        name: 'percentage',
        required: true,
        label: 'Porcentaje',
        align: 'center',
        field: 'percentage',
        sortable: false,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor',
        align: 'right',
        field: (row: ILiquidation) => formatCurrency(row.value),
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const showLiquidation = computed(() => 
    (props.paymentInstructions?.length ?? 0) > 0
  )

  const alertModalRef = ref()
  const modalAction = ref<'authorize' | 'reject'>('authorize')

  const alertModalConfig = ref({
    description: '¿Desea autorizar la liquidación?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
  })

  const handleOpenModal = (action: 'authorize' | 'reject') => {
    modalAction.value = action
    alertModalConfig.value.description =
      action === 'authorize'
        ? '¿Desea autorizar la liquidación?'
        : '¿Desea rechazar la liquidación?'
    alertModalRef.value?.openModal()
  }

  const handleConfirmAction = async () => {
    if (!props.data) return

    // Si no hay instrucciones disponibles, no hacer nada
    if (!props.paymentInstructions || props.paymentInstructions.length === 0) {
      return
    }

    // Usar la instrucción seleccionada, o la primera si no hay ninguna seleccionada
    const instructionToUse = 
      selectedInstruction.value.length > 0 
        ? selectedInstruction.value[0]
        : props.paymentInstructions[0]

    const payload = {
      business_trust_id: props.data.business_trust_id,
      payment_request_id: props.data.payment_request_id,
      payment_instruction_id: instructionToUse.id,
      authorization: modalAction.value === 'authorize',
      operation_office_id: props.data.operation_office_id,
    }

    const success = await _authorizeOrRejectFirstAuthorization(payload)

    await alertModalRef.value?.closeModal()

    if (success) {
      emit('reload')
    }
  }

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  watch(
    () => props.paymentDetails,
    (val) => {
      if (val) paymentDetailTable.value.rows = val
    },
    { immediate: true }
  )

  watch(
    () => props.paymentInstructions,
    (val) => {
      if (val) instructionsTableProps.value.rows = val
    },
    { immediate: true }
  )

  watch(
    () => props.paymentLiquidations,
    (val) => {
      if (val) liquidationTableProps.value.rows = val
    },
    { immediate: true }
  )

  return {
    basicDataFormRef,
    models,
    paymentDetailTable,
    instructionsTableProps,
    selectedInstruction,
    liquidationTableProps,
    showLiquidation,
    alertModalRef,
    alertModalConfig,
    handleOpenModal,
    handleConfirmAction,
    defaultIconsLucide,
  }
}

export default useBasicDataView