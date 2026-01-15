// Vue
import { computed, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import {
  IBudgetFormAdditions,
  IMilestonePayment,
  ISchedulePaymentsFormAdditions,
  OperationDetails,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

// Stores
import { storeToRefs } from 'pinia'
import {
  useBudgetResourceStore,
  useDerivativeContractingResourceStore,
  useRegisterAdditionsStore,
} from '@/stores'

const useBudgetForm = (
  props: {
    data: IBudgetFormAdditions | null
    payments: ISchedulePaymentsFormAdditions | null
    action: ActionType
  },
  emit: Function
) => {
  const { payment_type } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const { budget_document_types, operation_logs_authorized } = storeToRefs(
    useBudgetResourceStore('v1')
  )
  const { contractData } = storeToRefs(useRegisterAdditionsStore('v1'))

  const {
    defaultIconsLucide,
    formatDate,
    formatCurrencyString,
    isEmptyOrZero,
  } = useUtils()
  const formElementRef = ref()
  const budgetProposal = ref<OperationDetails[]>([])

  const initialModelsValues: IBudgetFormAdditions = {
    selected: null,
    budgetary_association: [
      {
        id: '01',
        validity: null,
        type_document_budget_id: null,
        document_number_id: null,
        value: null,
        document_date: null,
        available_payment: null,
        operation_log_details: [],
        milestone_assigned: [],
      },
    ],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const rowToDelete = ref<string | null>(null)
  const rowToLinkBudget = ref<OperationDetails | null>()

  const deleteModalRef = ref()
  const linkRegisterModalRef = ref()
  const milestoneAssigned = ref<IMilestonePayment[]>([])

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const tableProps = ref({
    title: 'Listado de disponibilidades',
    loading: false,
    columns: [
      {
        name: 'select',
        field: 'select',
        required: false,
        label: '',
        align: 'center',
        sortable: true,
      },
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'validity',
        field: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'type_document_budget_id',
        field: 'type_document_budget_id',
        required: true,
        label: 'Tipo de documento presupuestal',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'document_number_id',
        field: 'document_number_id',
        required: true,
        label: 'Número documento',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'value',
        field: (row) =>
          operation_logs_authorized.value.find(
            (e) => e.value == row.document_number_id
          )?.total_value ?? 0,
        required: true,
        label: 'Valor del documento presupuestal',
        align: 'left',
        sortable: true,
        style: styleColumn(),
        format: (val) => formatCurrencyString(val),
      },
      {
        name: 'document_date',
        field: (row) =>
          operation_logs_authorized.value.find(
            (e) => e.value == row.document_number_id
          )?.date ?? null,
        format: (val) => (val ? formatDate(val, 'YYYY-MM-DD') : ''),
        required: true,
        label: 'Fecha documento',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'available_payment',
        field: 'available_payment',
        required: true,
        label: 'Saldo disponible',
        align: 'left',
        sortable: true,
        style: styleColumn(),
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
    rows: computed(() => models.value.budgetary_association ?? []),
  })

  const tablePropsAvailableBudget = ref({
    title: 'Listado de registros presupuestales asociadas a la disponibilidad',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'validity',
        field: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        sortable: true,
      },
      {
        name: 'date',
        field: 'date',
        format: (val) => (val ? formatDate(val, 'YYYY-MM-DD') : ''),
        required: true,
        label: 'Fecha',
        align: 'left',
        sortable: true,
      },
      {
        name: 'budget_resource_id',
        field: 'budget_resource_id',
        required: true,
        label: 'Recurso',
        align: 'left',
        sortable: true,
      },
      {
        name: 'areas_responsibility_id',
        field: 'areas_responsibility_id',
        required: true,
        label: 'Área',
        align: 'left',
        sortable: true,
      },
      {
        name: 'budget_item_id',
        field: 'budget_item_id',
        required: true,
        label: 'Rubro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'available_value',
        field: 'available_value',
        required: true,
        label: 'Valor disponible',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
      },
      {
        name: 'compromise_value',
        field: (row: OperationDetails) =>
          row.milestone_assigned.reduce((acc, it) => {
            const n = Number(it?.value_milestone ?? 0)
            return acc + (Number.isFinite(n) ? n : 0)
          }, 0),
        required: true,
        label: 'Valor comprometido',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
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
    rows: computed(() => budgetProposal.value),
  })

  const tablePropsRegisterModal = ref({
    title: 'Registro presupuestal',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'validity',
        field: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        sortable: true,
      },
      {
        name: 'date',
        field: 'date',
        required: true,
        label: 'Fecha',
        align: 'left',
        sortable: true,
        format: (val) => (val ? formatDate(val, 'YYYY-MM-DD') : ''),
      },
      {
        name: 'budget_resource_id',
        field: 'budget_resource_id',
        required: true,
        label: 'Recurso',
        align: 'left',
        sortable: true,
      },
      {
        name: 'areas_responsibility_id',
        field: 'areas_responsibility_id',
        required: true,
        label: 'Área',
        align: 'left',
        sortable: true,
      },
      {
        name: 'budget_item_id',
        field: 'budget_item_id',
        required: true,
        label: 'Rubro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'available_value',
        field: 'available_value',
        required: true,
        label: 'Valor disponible',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
      },
      {
        name: 'compromise_value',
        field: 'compromise_value',
        required: true,
        label: 'Valor comprometido',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
      },
    ] as QTable['columns'],
    rows: computed(() => [rowToLinkBudget.value]),
  })

  const tablePropsLinkModal = ref({
    title: 'Hitos programados a asociar',
    loading: false,
    columns: [
      {
        name: 'select',
        field: 'select',
        required: false,
        label: '',
        align: 'center',
        sortable: true,
      },
      {
        name: 'temporal_id',
        field: 'temporal_id',
        required: false,
        label: 'Hito',
        align: 'center',
        sortable: true,
      },
      {
        name: 'payment_type_id',
        field: (row) =>
          payment_type.value.find((e) => e.value === row.payment_type_id)
            ?.label ?? row.payment_type_id,
        required: true,
        label: 'Tipo de pago',
        align: 'left',
        sortable: true,
      },
      {
        name: 'date_milestone',
        field: 'date_milestone',
        required: true,
        label: 'Fecha',
        align: 'left',
        sortable: true,
      },
      {
        name: 'value_milestone',
        field: 'value_milestone',
        required: true,
        label: 'Valor hito',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
      },
      {
        name: 'value_assigned',
        field: 'value_assigned',
        required: true,
        label: 'Valor asignado en el presupuesto',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: computed(() => milestoneAssigned.value),
  })

  const totalAvailableValue = computed(() =>
    models.value.budgetary_association?.reduce((acc, r) => {
      const n = Number(r.available_payment ?? 0)
      return acc + (Number.isFinite(n) ? n : 0)
    }, 0)
  )

  const totalCompromisedValue = computed(() =>
    budgetProposal.value?.reduce((acc, r) => {
      const n = Number(r.available_value ?? 0) // TODO: change compromised value
      return acc + (Number.isFinite(n) ? n : 0)
    }, 0)
  )

  const bottomRows = computed(() => [
    {
      label: 'Total saldo disponible presupuestal',
      value: totalAvailableValue.value,
    },
    {
      label: 'Total saldo comprometido',
      value: totalCompromisedValue.value,
    },
    {
      label: 'Total saldo pendiente por comprometer',
      value:
        (contractData.value?.contract_value ?? 0) - totalCompromisedValue.value,
    },
  ])

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }

    if (budgetProposal.value.length === 0) {
      const assocIndex = models.value.budgetary_association?.findIndex(
        (e) => e.id === props.data?.selected?.id
      )

      if (
        props.data.budgetary_association &&
        assocIndex != null &&
        assocIndex > -1
      ) {
        budgetProposal.value =
          props.data.budgetary_association[assocIndex]?.operation_log_details ??
          []
      }
    }
  }

  const addNewRow = () => {
    const ids = models.value.budgetary_association
      ?.map((r) => parseInt(String(r.id), 10))
      .filter((n) => !Number.isNaN(n))

    const maxId = ids?.length ? Math.max(...ids) : 0
    const nextId = (maxId + 1).toString().padStart(2, '0')

    models.value.budgetary_association?.push({
      id: nextId,
      validity: null,
      type_document_budget_id: null,
      document_number_id: null,
      value: null,
      document_date: null,
      available_payment: null,
      operation_log_details: [],
      milestone_assigned: [],
    })
  }

  const openDeleteModal = (idRow: string) => {
    rowToDelete.value = idRow
    deleteModalRef.value.openModal()
  }

  const confirmDeleteAction = async () => {
    if (!rowToDelete.value) return

    models.value.budgetary_association =
      models.value?.budgetary_association?.filter(
        (r) => r.id !== rowToDelete.value
      )

    budgetProposal.value = []

    deleteModalRef.value.closeModal()
    rowToDelete.value = null
  }

  const openModalLinkRegister = (row: OperationDetails) => {
    const selectedObj = row?.milestone_assigned ?? []

    const preAssigned: IMilestonePayment[] = ['edit'].includes(props.action)
      ? (props.data?.budgetary_association ?? []).flatMap((b) => {
          // buscar operation_log_detail correspondiente al row actual
          const opDetail = (b.operation_log_details ?? []).find(
            (d) => String(d.id) === String(row.id)
          )

          const source =
            Array.isArray(opDetail?.milestone_assigned) &&
            opDetail!.milestone_assigned!.length > 0
              ? opDetail!.milestone_assigned!
              : b.milestone_assigned ?? []

          return (source ?? []).map((e) => {
            if (row.id === e.associated_budget_records_id) {
              return {
                ...e,
                select: true,
                temporal_id:
                  selectedObj.find((v) => v.temporal_id === e.temporal_id)
                    ?.temporal_id ??
                  e.temporal_id ??
                  null,
                value_assigned:
                  selectedObj.find((v) => v.temporal_id === e.temporal_id)
                    ?.value_assigned ??
                  e.value_assigned ??
                  0,
              }
            }

            return {
              ...e,
              select: false,
              value_assigned: null,
            }
          })
        })
      : []

    // lista base desde props.payments, determinando select/value según selección actual o preAssigned
    const paymentsList = (props.payments?.milestone_payments ?? []).map(
      (e) => ({
        ...e,
        select:
          preAssigned.some((p) => p.temporal_id === e.temporal_id) ||
          selectedObj.some((v) => v.temporal_id === e.temporal_id),
        value_assigned:
          preAssigned.find((p) => p.temporal_id === e.temporal_id)
            ?.value_assigned ??
          selectedObj.find((v) => v.temporal_id === e.temporal_id)
            ?.value_assigned ??
          0,
      })
    )

    const map = new Map<string | number, IMilestonePayment>()
    paymentsList.forEach((p) => map.set(String(p.temporal_id), p))
    preAssigned.forEach((p) => {
      const key = String(p.temporal_id)
      if (map.has(key)) {
        const base = map.get(key)!
        map.set(key, { ...base, ...p })
      }
    })

    milestoneAssigned.value = Array.from(map.values())

    rowToLinkBudget.value = row
    linkRegisterModalRef.value.openModal()
  }

  const saveMilestoneBudget = () => {
    if (['view'].includes(props.action)) {
      linkRegisterModalRef.value.closeModal()
      rowToLinkBudget.value = null
      return
    }

    const selectedMilestones = milestoneAssigned.value.filter((m) => m.select)

    if (!selectedMilestones.length) {
      if (!rowToLinkBudget.value) return
      const assocIndex = budgetProposal.value?.findIndex(
        (a) => String(a.id) === String(rowToLinkBudget.value?.id)
      )
      if (assocIndex != null && assocIndex > -1) {
        budgetProposal.value[assocIndex].milestone_assigned = []
      }
      // cerrar modal, limpiar selección y sincronizar modelo
      milestoneAssigned.value.forEach((m) => (m.select = false))
      linkRegisterModalRef.value?.closeModal()
      rowToLinkBudget.value = null
      updateListBudgetProposal()
      return
    }

    const selectedObjs = Array.from(
      new Set(selectedMilestones.map((m) => String(m.temporal_id)))
    ).map((tid) => {
      const row = selectedMilestones.find((s) => String(s.temporal_id) === tid)!
      return {
        temporal_id: row.temporal_id,
        value_assigned: row.value_assigned ?? null,
        associated_budget_records_id: rowToLinkBudget.value?.id ?? 0,
        value_milestone: row.value_milestone,
      }
    })

    const assocIndex = budgetProposal.value?.findIndex(
      (a) => a.id === rowToLinkBudget.value?.id
    )

    if (assocIndex != null && assocIndex > -1) {
      const existing = budgetProposal.value[assocIndex].milestone_assigned
      selectedObjs.forEach((obj) => {
        const idx = existing.findIndex((e) => e.temporal_id === obj.temporal_id)
        if (idx > -1) {
          existing[idx].value_assigned = obj.value_assigned
          existing[idx].value_milestone = obj.value_milestone
          existing[idx].associated_budget_records_id =
            obj.associated_budget_records_id
        } else {
          existing.push(obj)
        }
      })

      const selectedIds = new Set(
        selectedObjs.map((s) => String(s.temporal_id))
      )
      budgetProposal.value[assocIndex].milestone_assigned = existing.filter(
        (e) => selectedIds.has(String(e.temporal_id))
      )

      milestoneAssigned.value.forEach((m) => {
        m.select = false
      })

      // cerrar modal y limpiar
      linkRegisterModalRef.value.closeModal()
      rowToLinkBudget.value = null
    }

    updateListBudgetProposal()
  }

  const updateListBudgetProposal = () => {
    if (!models.value.selected) return

    const assocIndex = models.value.budgetary_association?.findIndex(
      (e) => e.id === models.value.selected?.id
    )

    if (assocIndex == null || assocIndex === -1) return

    // clonar para evitar referencias reactivas compartidas
    const cloned = JSON.parse(JSON.stringify(budgetProposal.value ?? []))

    // asignar la copia al modelo
    models.value.budgetary_association![assocIndex].operation_log_details =
      cloned

    // asegurar que cada detalle tenga milestone_assigned (evita undefined)
    models.value.budgetary_association![
      assocIndex
    ].operation_log_details.forEach((d: OperationDetails) => {
      d.milestone_assigned = d.milestone_assigned ?? []
    })
  }

  const getDataRegistersProposal = () => {
    const val = models.value.selected

    const data = operation_logs_authorized.value.find(
      (e) => e.value === val?.document_number_id
    )

    if (data) {
      budgetProposal.value = data.operation_log_details.map((e) => ({
        ...e,
        validity: val?.validity ?? '',
        date: data.date ?? '',
        available_value: val?.available_payment ?? '',
        milestone_assigned: e.milestone_assigned ?? [],
      }))
    }
  }

  const operation_logs_authorized_filtered = (id: number) =>
    operation_logs_authorized.value.filter(
      (e) => e.budget_document_type?.id === id
    )

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.selected,
    (val) => {
      if (val) getDataRegistersProposal()
    }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  onMounted(() => {
    if (models.value.selected) getDataRegistersProposal()
  })

  return {
    formElementRef,
    models,
    defaultIconsLucide,
    tableProps,
    tablePropsAvailableBudget,
    deleteModalRef,
    bottomRows,
    linkRegisterModalRef,
    tablePropsRegisterModal,
    tablePropsLinkModal,
    budget_document_types,
    operation_logs_authorized_filtered,
    contractData,
    saveMilestoneBudget,
    formatCurrencyString,
    confirmDeleteAction,
    openDeleteModal,
    openModalLinkRegister,
    addNewRow,
  }
}

export default useBudgetForm
