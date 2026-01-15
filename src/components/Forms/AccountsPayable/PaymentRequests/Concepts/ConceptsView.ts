// core
import { onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils } from '@/composables'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IPaymentBlockConceptsBudgetsListForm,
  IPaymentRequestConceptsForm,
  IPaymentRequestConceptsListForm,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'

// constants
import { disbursementTypeOptions } from '@/constants/resources'

// stores
import { usePaymentRequestsStore } from '@/stores/accounts-payable/payment-requests'

const useConceptsView = (
  props: {
    action?: ActionType
    data?: IPaymentRequestConceptsForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero, formatCurrency } = useUtils()

  // stores
  const { total_value } = storeToRefs(usePaymentRequestsStore('v1'))

  // refs
  const disbursementType = ref()
  const tableRef = ref()
  const tableBudgetRef = ref()

  // configs
  const conceptsFormFormRef = ref()

  const models = ref<IPaymentRequestConceptsForm>({
    concepts: [],
  })

  const tableProps = ref<IBaseTableProps<IPaymentRequestConceptsListForm>>({
    title: '',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'payment_concept_id',
        required: false,
        label: 'Concepto de pago*',
        align: 'left',
        field: (item) =>
          `${item.payment_concept?.code ?? ''} - ${
            item.payment_concept?.name ?? ''
          }`,
        sortable: true,
      },
      {
        name: 'concept_value',
        required: false,
        label: 'Valor total*',
        align: 'left',
        field: (item) => formatCurrency(String(item.concept_value)),
        sortable: true,
      },
      {
        name: 'budget_effect',
        required: false,
        label: 'Efecto presupuesto*',
        align: 'left',
        field: (item) => formatCurrency(String(item.concept_value)),
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const tablePropsBudget = ref<
    IBaseTableProps<IPaymentBlockConceptsBudgetsListForm>
  >({
    title: '',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'resource_label',
        required: false,
        label: 'Recurso*',
        align: 'left',
        field: 'resource_label',
        sortable: true,
      },
      {
        name: 'area_label',
        required: false,
        label: 'Área*',
        align: 'left',
        field: 'area_label',
        sortable: true,
      },
      {
        name: 'budget_item_label',
        required: false,
        label: 'Rubro presupuestal*',
        align: 'left',
        field: 'budget_item_label',
        sortable: true,
      },
      {
        name: 'budget_value',
        required: false,
        label: 'Valor*',
        align: 'left',
        field: (item) => formatCurrency(String(item.budget_value)),
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
    () => models.value.concepts,
    (val) => {
      tableProps.value.rows = val

      const allBudgets = models.value.concepts
        .flatMap((c) => c.budgets ?? [])
        .map((b) => ({ ...b }))

      tablePropsBudget.value.rows = allBudgets
    },
    { deep: true, immediate: true }
  )

  onBeforeMount(() => {
    disbursementType.value = disbursementTypeOptions.filter(
      (item) => item.value != 'Todos'
    )
  })

  watch(
    () => total_value.value,
    (val) => {
      models.value.concepts = models.value.concepts.map((concept) => ({
        ...concept,
        budget_effect: val,
      }))
    },
    { deep: true, immediate: true }
  )

  return {
    conceptsFormFormRef,
    tableRef,
    tableBudgetRef,
    tableProps,
    tablePropsBudget,
  }
}

export default useConceptsView
