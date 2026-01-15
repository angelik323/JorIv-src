import {
  IMilestonePayment,
  ISchedulePaymentsFormAdditions,
  IValidityFormAdditions,
  MilestoneAssigned,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { computed, onMounted, ref, watch } from 'vue'
import { useUtils } from '@/composables'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import {
  useBudgetResourceStore,
  useDerivativeContractingResourceStore,
  useRegisterAdditionsStore,
} from '@/stores'
import { ActionType } from '@/interfaces/global'

const useBudgetForm = (
  props: {
    data: IValidityFormAdditions | null
    action: ActionType
    payments: ISchedulePaymentsFormAdditions | null
  },
  emit: Function
) => {
  const { payment_type } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const {
    budget_item_codes,
    areas_resposabilities_codes,
    budget_resources_types,
  } = storeToRefs(useBudgetResourceStore('v1'))
  const { contractData } = storeToRefs(useRegisterAdditionsStore('v1'))

  const { defaultIconsLucide, isEmptyOrZero, formatCurrencyString } = useUtils()

  const formElementRef = ref()
  const milestoneAssigned = ref<MilestoneAssigned[]>([])
  const displayedMilestones = ref<MilestoneAssigned[]>([])

  const initialModelsValues: IValidityFormAdditions = {
    selectedRow: null,
    future_validities: [
      {
        id: '01',
        resource_id: null,
        area_id: null,
        budget_item_id: null,
        project_value: contractData?.value?.contract_value ?? null,
        validity: null,
        milestone_assigned: [],
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
    title: 'Listado de asignaciones',
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
        name: 'resource_id',
        field: 'resource_id',
        required: true,
        label: 'Recursos',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'area_id',
        field: 'area_id',
        required: true,
        label: 'Area',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'budget_item_id',
        field: 'budget_item_id',
        required: true,
        label: 'Rubro',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'project_value',
        // Valor del contrato - Monto con cobertura presupuestal del contrato - Monto con cobertura futura
        field: 'project_value',
        required: true,
        label: 'Valor proyecto',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
        style: styleColumn(),
      },
      {
        name: 'compromise',
        field: 'compromise',
        required: true,
        label: 'Compromiso vigencia futura',
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
    rows: computed(() => models.value.future_validities ?? []),
  })

  const tablePropsProgramLinks = ref({
    title: 'Asociación hitos programados',
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
            ?.label ?? '',
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
        label: 'Valor de hito',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
      },
      {
        name: 'value_assigned',
        field: 'value_assigned',
        required: true,
        label: 'Monto con cobertura futura',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: computed(() => milestoneAssigned.value),
  })

  const _setValueModel = () => {
    if (!props.data) return

    models.value = { ...props.data }
  }

  const addNewRow = () => {
    const ids = models.value.future_validities
      ?.map((r) => parseInt(String(r.id), 10))
      .filter((n) => !Number.isNaN(n))

    const maxId = ids?.length ? Math.max(...ids) : 0
    const nextId = (maxId + 1).toString().padStart(2, '0')

    models.value.future_validities?.push({
      id: nextId,
      area_id: null,
      validity: null,
      budget_item_id: null,
      project_value: contractData.value?.contract_value ?? null,
      resource_id: null,
      milestone_assigned: [],
    })
  }

  const openDeleteModal = (idRow: string) => {
    rowToDelete.value = idRow
    deleteModalRef.value.openModal()
  }

  const confirmDeleteAction = async () => {
    if (!rowToDelete.value) return

    models.value.future_validities = models.value?.future_validities?.filter(
      (r) => r.id !== rowToDelete.value
    )

    deleteModalRef.value.closeModal()
    rowToDelete.value = null
  }

  const toggleMilestoneForSelectedRow = (
    milestone: IMilestonePayment,
    selected: boolean
  ) => {
    if (!models.value.selectedRow) return

    const row = models.value.selectedRow
    if (!row.milestone_assigned) row.milestone_assigned = []

    const tempId = milestone.temporal_id
    const valueA = milestone.value_assigned ?? 0

    if (selected) {
      const existsIndex = row.milestone_assigned.findIndex(
        (e) => e.temporal_id === tempId
      )
      if (existsIndex === -1) {
        row.milestone_assigned.push({
          temporal_id: tempId,
          value_assigned: valueA,
        })
      } else {
        row.milestone_assigned[existsIndex].value_assigned = valueA
      }

      const dispIndex = displayedMilestones.value.findIndex(
        (e) => e.temporal_id === tempId
      )
      if (dispIndex === -1) {
        displayedMilestones.value.push({
          temporal_id: tempId,
          value_assigned: valueA,
        })
      } else {
        displayedMilestones.value[dispIndex].value_assigned = valueA
      }
    } else {
      row.milestone_assigned = row.milestone_assigned.filter(
        (e) => e.temporal_id !== tempId
      )
      displayedMilestones.value = displayedMilestones.value.filter(
        (e) => e.temporal_id !== tempId
      )
    }
  }

  const pruneUnselectedFromSelectedRow = () => {
    const row = models.value.selectedRow
    if (!row || !row.milestone_assigned) return
    const selectedIds = new Set(
      displayedMilestones.value.map((e) => String(e.temporal_id))
    )
    row.milestone_assigned = row.milestone_assigned.filter((e) =>
      selectedIds.has(String(e.temporal_id))
    )
  }

  watch(
    () => displayedMilestones.value,
    () => {
      pruneUnselectedFromSelectedRow()
    },
    { deep: true }
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
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => models.value.selectedRow,
    (newRow) => {
      if (!newRow) {
        displayedMilestones.value = []
        return
      }

      if (['view', 'edit'].includes(props.action)) {
        const ind = models.value.future_validities?.findIndex(
          (e) => e.id === newRow.id
        )

        if (!props.data?.future_validities?.length) return

        const originals = props.payments?.milestone_payments ?? []
        const rawNewOnes =
          props.data.future_validities[ind ?? 0].milestone_assigned ?? []

        const newOnes = rawNewOnes.filter((n) =>
          originals.some((o) => o.temporal_id === n.temporal_id)
        )

        milestoneAssigned.value = [
          ...newOnes,
          ...originals.filter(
            (e) => !newOnes.some((o) => o.temporal_id === e.temporal_id)
          ),
        ]
      }

      // Load the milestones of the selected row
      displayedMilestones.value = newRow.milestone_assigned
        ? [...newRow.milestone_assigned]
        : []
    },
    { immediate: true }
  )

  onMounted(() => {
    if (['create', 'edit'].includes(props.action)) {
      milestoneAssigned.value = props.payments?.milestone_payments ?? []
    }
  })

  return {
    formElementRef,
    models,
    defaultIconsLucide,
    tableProps,
    tablePropsProgramLinks,
    deleteModalRef,
    budget_item_codes,
    areas_resposabilities_codes,
    budget_resources_types,
    contractData,
    displayedMilestones,
    toggleMilestoneForSelectedRow,
    confirmDeleteAction,
    openDeleteModal,
    addNewRow,
    formatCurrencyString,
  }
}

export default useBudgetForm
