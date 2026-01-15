// Vue
import { computed, ref, watch } from 'vue'

// Interfaces
import {
  ISecondAuthorizationPaymentOrderForm,
  ISecondAuthorizationPaymentOrderItem,
} from '@/interfaces/customs/accounts-payable/SecondAuthorization'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { SecondAuthorizationOrderStatuses } from '@/interfaces/global'

// Composables
import { useGoToUrl, useUtils } from '@/composables'

const usePaymentOrderDataForm = (props: {
  data?: ISecondAuthorizationPaymentOrderForm | null
  payment_status?: number | null
  payment_request_id?: number | null
  voucher_id?: number | null
}) => {
  const { goToURL } = useGoToUrl()

  const { formatCurrency } = useUtils()

  const models = ref<ISecondAuthorizationPaymentOrderForm>({
    foreign_currency: null,
    payments: [],
  })

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Moneda extrajera',
  })

  const selectedInstruction = ref([])

  const tableProps = ref<IBaseTableProps<ISecondAuthorizationPaymentOrderItem>>(
    {
      title: 'Listado de pagos',
      loading: false,
      columns: [
        {
          name: 'id',
          required: false,
          label: '#',
          field: 'id',
          sortable: true,
          align: 'left',
        },
        {
          name: 'instruction_number',
          required: false,
          label: '# Instrucción',
          field: 'instruction_number',
          sortable: true,
          align: 'left',
        },
        {
          name: 'contract_number',
          required: false,
          label: '# Contrato',
          field: 'contract_number',
          sortable: true,
          align: 'left',
        },
        {
          name: 'contract_number',
          required: false,
          label: '# Bien',
          field: 'asset_number',
          sortable: true,
          align: 'left',
        },
        {
          name: 'movement_code',
          required: false,
          label: 'Código movimiento de cuentas por pagar',
          field: 'movement_code',
          sortable: true,
          align: 'left',
        },
        {
          name: 'voucher_type',
          required: false,
          label: 'Tipo de comprobante',
          field: 'voucher_type',
          sortable: true,
          align: 'left',
        },
        {
          name: 'voucher_number',
          required: false,
          label: '# de comprobante',
          field: 'voucher_number',
          sortable: true,
          align: 'left',
        },
        {
          name: 'budget_document_number',
          required: false,
          label: 'Numero documento presupuestal',
          field: 'budget_document_number',
          sortable: true,
          align: 'left',
        },
        {
          name: 'tax_obligation_number',
          required: false,
          label: '# Obligación tributaria',
          field: 'tax_obligation_number',
          sortable: true,
          align: 'left',
        },
        {
          name: 'total_value',
          required: false,
          label: 'Valor total',
          field: (row) => formatCurrency(row.value),
          sortable: true,
          align: 'left',
        },
      ],
      rows: [],
      pages: { currentPage: 0, lastPage: 0 },
    }
  )

  const handleClickOption = (
    option:
      | 'accounting_voucher'
      | 'treasury_voucher'
      | 'asset'
      | 'foreign_currency'
  ) => {
    switch (option) {
      case 'accounting_voucher':
        if (!props.voucher_id) return
        goToURL('AccountingReceiptView', props.voucher_id)
        break
      case 'treasury_voucher':
        goToURL('CheckTreasuryReceiptList')
        break
      case 'asset':
        if (!props.payment_request_id) return
        goToURL('PaymentRequestsView', props.payment_request_id)
        break
      case 'foreign_currency':
        alertModalRef.value?.openModal()
        break
      default:
        break
    }
  }

  const treasuryVoucherBtnDisabled = computed(
    () =>
      props.payment_status === SecondAuthorizationOrderStatuses.PAID ||
      props.payment_status === SecondAuthorizationOrderStatuses.PARTIAL_PAID
  )

  watch(
    () => models.value.payments,
    (val) => {
      tableProps.value.rows = val
    }
  )

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  return {
    models,
    alertModalRef,
    alertModalConfig,
    selectedInstruction,
    tableProps,
    treasuryVoucherBtnDisabled,
    handleClickOption,
  }
}

export default usePaymentOrderDataForm
