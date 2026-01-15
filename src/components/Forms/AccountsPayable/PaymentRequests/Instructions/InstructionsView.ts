// core
import { ref, watch } from 'vue'

// composables
import { useUtils } from '@/composables'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IPaymentRequestInstructionsDetailsForm,
  IPaymentRequestInstructionsForm,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'

const useInstructionsView = (
  props: {
    action?: ActionType
    data?: IPaymentRequestInstructionsForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero, formatCurrency } = useUtils()

  // configs
  const instructionsFormRef = ref()

  const models = ref<IPaymentRequestInstructionsForm>({
    payment_type: '',
    payment_source: '',
    payment_method_id: null,
    fund_or_bank_id: null,
    plan_or_account_id: null,
    instruction_date: '',
    base_value: null,
    tax_discount: null,
    net_value: null,
    observation: '',
    authorized_doc_type_id: null,
    authorized_doc_number: '',
    authorized_full_name: '',
    details: [],
  })

  const tableProps = ref<
    IBaseTableProps<IPaymentRequestInstructionsDetailsForm>
  >({
    title: '',
    loading: false,
    columns: [
      {
        name: 'instruction_number',
        required: false,
        label: 'Número de instrucción',
        align: 'left',
        field: 'instruction_number',
        sortable: true,
      },
      {
        name: 'payment_method_label',
        required: true,
        label: 'Forma de pago',
        align: 'left',
        field: 'payment_method_label',
        sortable: true,
      },
      {
        name: 'beneficiary_doc',
        required: true,
        label: 'ID beneficiario',
        align: 'left',
        field: 'beneficiary_doc',
        sortable: true,
      },
      {
        name: 'beneficiary_name',
        required: false,
        label: 'Nombre del beneficiario',
        align: 'left',
        field: 'beneficiary_name',
        sortable: true,
      },
      {
        name: 'beneficiary_bank_account_label',
        required: true,
        label: 'Cuenta bancaria llave',
        align: 'left',
        field: 'beneficiary_bank_account_label',
        sortable: true,
      },
      {
        name: 'pay_value',
        required: true,
        label: 'Valor a girar',
        align: 'left',
        field: (item) => formatCurrency(String(item.pay_value)),
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  // lifecycle hooks
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  watch(
    () => models.value.details,
    (val) => {
      tableProps.value.rows = val
    },
    { deep: true, immediate: true }
  )

  return {
    instructionsFormRef,
    tableProps,
    formatCurrency,
  }
}

export default useInstructionsView
