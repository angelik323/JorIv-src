// core
import { onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// composables
import { useUtils, useRules, useAlert } from '@/composables'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IPaymentBlockConceptsBudgetsListForm,
  IPaymentRequestConceptsForm,
  IPaymentRequestConceptsListForm,
} from '@/interfaces/customs/accounts-payable/PaymentRequests'

// constants
import { disbursementTypeOptions } from '@/constants/resources'
import { TIMEOUT_ALERT } from '@/constants/alerts'

// stores
import { usePaymentRequestsStore } from '@/stores/accounts-payable/payment-requests'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useConceptsForm = (
  props: {
    action?: ActionType
    data?: IPaymentRequestConceptsForm | null
  },
  emit: Function
) => {
  // hooks
  const { isEmptyOrZero, defaultIconsLucide } = useUtils()
  const {
    is_required,
    only_number_with_max_integers_and_decimals_ignore_symbols,
  } = useRules()
  const { showAlert } = useAlert()

  // stores
  const { total_value, has_budget } = storeToRefs(usePaymentRequestsStore('v1'))
  const { payment_concept_codes_payment_block } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )
  const {
    budget_transfer_details_responsibility_area,
    budget_transfer_details_budget_item,
    budget_transfer_details_resource,
  } = storeToRefs(useBudgetResourceStore('v1'))

  // refs
  const disbursementType = ref()
  const tableRef = ref()
  const tableBudgetRef = ref()
  const selectedConceptId = ref<number | null>(null)

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
        field: 'payment_concept_id',
        sortable: true,
      },
      {
        name: 'concept_value',
        required: false,
        label: 'Valor total*',
        align: 'left',
        field: 'concept_value',
        sortable: true,
      },
      {
        name: 'budget_effect',
        required: false,
        label: 'Efecto presupuesto*',
        align: 'left',
        field: 'budget_effect',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id',
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
        name: 'resource_id',
        required: false,
        label: 'Recurso*',
        align: 'left',
        field: 'resource_id',
        sortable: true,
      },
      {
        name: 'area_id',
        required: false,
        label: 'Área*',
        align: 'left',
        field: 'area_id',
        sortable: true,
      },
      {
        name: 'budget_item_id',
        required: false,
        label: 'Rubro presupuestal*',
        align: 'left',
        field: 'budget_item_id',
        sortable: true,
      },
      {
        name: 'budget_value',
        required: false,
        label: 'Valor*',
        align: 'left',
        field: 'budget_value',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id',
        sortable: true,
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  // actions
  const addConcept = () => {
    if (models.value.concepts.length > 0) {
      const first = models.value.concepts[0]
      if (
        !first.payment_concept_id ||
        !first.concept_value ||
        !first.budget_effect
      ) {
        showAlert(
          'Es necesario completar todos los campos.',
          'warning',
          undefined,
          TIMEOUT_ALERT
        )
        return
      }
    }

    const sum_concept_value = models.value.concepts.reduce((sum, item) => {
      return sum + Number(item.concept_value ?? 0)
    }, 0)

    const new_concept_value = Number(total_value.value ?? 0) - sum_concept_value

    if (new_concept_value > 0) {
      const nextId =
        models.value.concepts.length === 0
          ? 1
          : Math.max(...models.value.concepts.map((c) => c.id || 0)) + 1

      models.value.concepts.unshift({
        id: nextId,
        payment_concept_id: null,
        concept_value: new_concept_value,
        budget_effect: total_value.value,
        budgets: [],
      })
    } else {
      showAlert(
        'El monto supera el valor permitido.',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
    }
  }

  const addBudget = () => {
    const conceptId = selectedConceptId.value
    if (!conceptId) return

    const concept = models.value.concepts.find((c) => c.id === conceptId)
    if (!concept) return

    const first = concept.budgets[0]
    if (
      first &&
      (!first.resource_id ||
        !first.area_id ||
        !first.budget_item_id ||
        !first.budget_value)
    ) {
      return
    }

    const nextId =
      concept.budgets.length === 0
        ? 1
        : Math.max(...concept.budgets.map((b) => b.id || 0)) + 1

    concept.budgets.unshift({
      id: nextId,
      resource_id: null,
      area_id: null,
      budget_item_id: null,
      budget_value: '',
    })

    tablePropsBudget.value.rows = [...concept.budgets]
  }

  const removeConcept = (id: number) => {
    models.value.concepts = models.value.concepts.filter(
      (concept) => concept.id !== id
    )
  }

  const removeBudget = (id: number) => {
    const conceptId = selectedConceptId.value
    if (!conceptId) return

    const concept = models.value.concepts.find((c) => c.id === conceptId)
    if (!concept) return

    concept.budgets = concept.budgets.filter((b) => b.id !== id)

    tablePropsBudget.value.rows = [...concept.budgets]
  }

  const handleSelectConcept = async (
    selected: IPaymentRequestConceptsListForm[]
  ) => {
    if (selected.length === 0) {
      selectedConceptId.value = null
      tablePropsBudget.value.rows = []
      return
    }

    selectedConceptId.value = selected[0]?.id ?? null

    tablePropsBudget.value.rows =
      models.value.concepts.find((c) => c.id === selected[0].id)?.budgets ?? []
  }

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
    models,
    tableProps,
    tablePropsBudget,
    selectedConceptId,
    has_budget,

    // utils
    defaultIconsLucide,

    // selects
    payment_concept_codes_payment_block,
    budget_transfer_details_responsibility_area,
    budget_transfer_details_budget_item,
    budget_transfer_details_resource,

    // methods
    addConcept,
    removeConcept,
    handleSelectConcept,
    addBudget,
    removeBudget,

    // rules
    is_required,
    only_number_with_max_integers_and_decimals_ignore_symbols,
  }
}

export default useConceptsForm
