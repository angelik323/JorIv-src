// core
import { ref, watch } from 'vue'

// composables
import { useUtils } from '@/composables'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IPaymentRequestAssociatedDataAdvancesForm,
  IPaymentRequestAssociatedDataForm,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'

const useAssociatedDataView = (
  props: {
    action?: ActionType
    data?: IPaymentRequestAssociatedDataForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero, formatCurrency } = useUtils()

  const tableProps = ref<
    IBaseTableProps<IPaymentRequestAssociatedDataAdvancesForm>
  >({
    title: '',
    loading: false,
    columns: [
      {
        name: 'amortization_type_label',
        required: false,
        label: 'Forma de amortización',
        align: 'left',
        field: 'amortization_type_label',
        sortable: true,
      },
      {
        name: 'business_label',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: 'business_label',
        sortable: true,
      },
      {
        name: 'payment_request_id',
        required: false,
        label: 'Solicitud de pago',
        align: 'left',
        field: 'payment_request_id',
        sortable: true,
      },
      {
        name: 'advance_number',
        required: false,
        label: 'Número de anticipo',
        align: 'left',
        field: 'advance_number',
        sortable: true,
      },
      {
        name: 'advance_value',
        required: false,
        label: 'Valor de Anticipo',
        align: 'left',
        field: (item) => formatCurrency(String(item.advance_value)),
        sortable: true,
      },
      {
        name: 'amortization_percentage',
        required: false,
        label: 'Porcentaje',
        align: 'left',
        field: (item) => `${item.amortization_percentage ?? 0}%`,
        sortable: true,
      },
      {
        name: 'accumulated_amortization',
        required: false,
        label: 'Acumulado amortización',
        align: 'left',
        field: (item) => formatCurrency(String(item.accumulated_amortization)),
        sortable: true,
      },

      {
        name: 'balance_to_amortize',
        required: false,
        label: 'Saldo por amortización',
        align: 'left',
        field: (item) => formatCurrency(String(item.balance_to_amortize)),
        sortable: true,
      },
      {
        name: 'amortize_value',
        required: false,
        label: 'Valor a amortizar',
        align: 'left',
        field: (item) => formatCurrency(String(item.amortize_value)),
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  // configs
  const associatedDataFormRef = ref()

  const models = ref<IPaymentRequestAssociatedDataForm>({
    assets: [],
    financial_obligations: [],
    advances: [],
    table: [],
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
      tableProps.value.rows = models.value.advances
    },
    { immediate: true }
  )

  return {
    associatedDataFormRef,
    tableProps,
    formatCurrency,
  }
}

export default useAssociatedDataView
