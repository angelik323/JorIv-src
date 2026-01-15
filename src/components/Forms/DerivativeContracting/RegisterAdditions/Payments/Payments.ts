// Vue
import { computed, ref, watch } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import {
  IBasicDataFormAdditions,
  ISchedulePaymentsFormAdditions,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'

// Composables
import { useUtils } from '@/composables'

// Stores
import {
  useDerivativeContractingResourceStore,
  useRegisterAdditionsStore,
} from '@/stores'
import { storeToRefs } from 'pinia'

const usePaymentForm = (
  props: {
    data: ISchedulePaymentsFormAdditions | null
    basic_data: IBasicDataFormAdditions | null
  },
  emit: Function
) => {
  const { payment_type } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const { contractData } = storeToRefs(useRegisterAdditionsStore('v1'))
  const { defaultIconsLucide, isEmptyOrZero, formatCurrencyString } = useUtils()
  const formElementRef = ref()

  const initialModelsValues: ISchedulePaymentsFormAdditions = {
    milestone_payments: [
      {
        select: false,
        temporal_id: '01',
        payment_type_id: null,
        date_milestone: null,
        foreign_amount: null,
        value_milestone: null,
        budget_apply: false,
        value_assigned: null,
      },
    ],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const rowToDelete = ref<string | null>(null)
  const deleteModalRef = ref()

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const tableProps = ref({
    title: 'Hitos programados',
    loading: false,
    columns: [
      {
        name: 'temporal_id',
        field: 'temporal_id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'payment_type_id',
        field: 'payment_type_id',
        required: true,
        label: 'Tipo de pago',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'date_milestone',
        field: 'date_milestone',
        required: true,
        label: 'Fecha',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'foreign_amount',
        field: 'foreign_amount',
        required: true,
        label: 'Monto extranjero',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'value_milestone',
        field: 'value_milestone',
        required: true,
        label: 'Valor del hito COP',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'budget_apply',
        field: 'budget_apply',
        required: true,
        label: 'Aplica presupuesto',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        field: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: computed(() => models.value.milestone_payments ?? []),
  })

  const totalForeignAmount = computed(() =>
    models.value.milestone_payments?.reduce((acc, r) => {
      const n = Number(r.foreign_amount ?? 0)
      return acc + (Number.isFinite(n) ? n : 0)
    }, 0)
  )

  const totalValueAmount = computed(() =>
    models.value.milestone_payments?.reduce((acc, r) => {
      const n = Number(r.value_milestone ?? 0)
      return acc + (Number.isFinite(n) ? n : 0)
    }, 0)
  )

  const bottomRows = computed(() => [
    {
      label: 'Total monto programado',
      amount: totalForeignAmount.value,
      value: totalValueAmount.value,
    },
    {
      label: 'Valor pendiente por programar',
      amount: props.basic_data?.additional_amount
        ? props.basic_data?.additional_amount -
          Number(totalForeignAmount.value ?? 0)
        : 0,
      value: props.basic_data?.additional_value
        ? props.basic_data?.additional_value -
          Number(totalValueAmount.value ?? 0)
        : 0,
    },
  ])

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const addNewRow = () => {
    const ids = models.value.milestone_payments
      ?.map((r) => parseInt(String(r.temporal_id), 10))
      .filter((n) => !Number.isNaN(n))

    const maxId = ids?.length ? Math.max(...ids) : 0
    const nextId = (maxId + 1).toString().padStart(2, '0')

    models.value.milestone_payments?.push({
      select: false,
      temporal_id: nextId,
      payment_type_id: null,
      date_milestone: null,
      foreign_amount: null,
      value_milestone: null,
      budget_apply: false,
      value_assigned: null,
    })
  }

  const openDeleteModal = (idRow: string) => {
    rowToDelete.value = idRow
    deleteModalRef.value.openModal()
  }

  const confirmDeleteAction = async () => {
    if (!rowToDelete.value) return

    models.value.milestone_payments = models.value?.milestone_payments?.filter(
      (r) => r.temporal_id !== rowToDelete.value
    )

    deleteModalRef.value.closeModal()
    rowToDelete.value = null
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  return {
    formElementRef,
    models,
    defaultIconsLucide,
    tableProps,
    deleteModalRef,
    bottomRows,
    payment_type,
    contractData,
    confirmDeleteAction,
    openDeleteModal,
    addNewRow,
    formatCurrencyString,
  }
}

export default usePaymentForm
