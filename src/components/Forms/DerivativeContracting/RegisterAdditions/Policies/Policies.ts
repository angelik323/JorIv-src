import {
  IPoliciesFormAdditions,
  Policies,
} from '@/interfaces/customs/derivative-contracting/RegisterAdditions'
import { computed, reactive, ref, watch } from 'vue'
import { useUtils } from '@/composables'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'
import {
  useDerivativeContractingResourceStore,
  useThirdPartyResourceStore,
} from '@/stores'

const usePoliciesForm = (
  props: {
    data: IPoliciesFormAdditions | null
  },
  emit: Function
) => {
  const { policies, policy_status, risk_list } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const {
    defaultIconsLucide,
    isEmptyOrZero,
    formatDate,
    formatCurrencyString,
  } = useUtils()

  const formElementRef = ref()
  const addAdditionModalRef = ref()
  const formAdditionModal = ref()
  const updateModal = ref(false)
  const selectedRow = ref<number | null>(null)
  const attachDocumentRef = ref<{ removeFilesRemote: () => void } | null>(null)

  const selectedRowIndex = computed(() =>
    models.value.policies?.findIndex((e) => e.id == selectedRow.value)
  )
  const attachmentsSelected = computed(
    () => models.value.policies?.[selectedRowIndex.value ?? 0].attachments ?? []
  )

  const initialModelsValues: IPoliciesFormAdditions = {
    policies: [],
  }

  const modelsModal = reactive<Policies>({
    id: null,
    type_policy_id: null,
    insurance_company_id: null,
    policy_number: null,
    insured_value: null,
    beneficiary_id: null,
    validity_start: null as string | null,
    validity_end: null,
    status_id: null,
    coverage: [],
    attachments: [],
  })

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const rowToDelete = ref<number | null>(null)

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
        name: 'type_policy_id',
        field: (row) =>
          policies.value.find((e) => e.value == row.type_policy_id)?.label,
        required: false,
        label: 'Tipo de póliza',
        align: 'left',
        sortable: true,
      },
      {
        name: 'insurance_company_id',
        field: (row) =>
          third_parties.value.find((e) => e.value == row.insurance_company_id)
            ?.label,
        required: true,
        label: 'Aseguradora',
        align: 'left',
        sortable: true,
      },
      {
        name: 'policy_number',
        field: 'policy_number',
        required: true,
        label: 'Número de póliza',
        align: 'left',
        sortable: true,
      },
      {
        name: 'beneficiary_id',
        field: (row) =>
          third_parties.value.find((e) => e.value == row.beneficiary_id)?.label,
        required: true,
        label: 'Beneficiario',
        align: 'left',
        sortable: true,
      },
      {
        name: 'insured_value',
        field: 'insured_value',
        required: true,
        label: 'Valor asegurado',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrencyString(val),
      },
      {
        name: 'validity_start',
        field: 'validity_start',
        required: true,
        label: 'Fecha inicio vigencia',
        align: 'left',
        sortable: true,
      },
      {
        name: 'validity_end',
        field: 'validity_end',
        required: true,
        label: 'Fecha fin vigencia',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status_id',
        field: (row) =>
          policy_status.value.find((e) => e.value == row.status_id)?.label,
        required: true,
        label: 'Estado',
        align: 'left',
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
    rows: computed(() => models.value.policies ?? []),
  })

  const tablePropsAddAdditions = ref({
    title: 'Coberturas',
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
        name: 'risk_id',
        field: 'risk_id',
        required: true,
        label: 'Riesgo',
        align: 'left',
        sortable: true,
        style: styleColumn(),
      },
      {
        name: 'coverage_min_value',
        field: 'coverage_min_value',
        required: true,
        label: '% Mínimo',
        align: 'left',
        sortable: true,
        style: styleColumn(),
        format: (val) => `%${val ?? 0}`,
      },
      {
        name: 'coverage_percent',
        field: 'coverage_percent',
        required: true,
        label: '% Cubrimiento',
        align: 'left',
        sortable: true,
        style: styleColumn(),
        format: (val) => `%${val ?? 0}`,
      },
      {
        name: 'coverage_max_value',
        field: 'coverage_max_value',
        required: true,
        label: 'Valor máximo cubierto',
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
    rows: computed(() => modelsModal.coverage ?? []),
  })

  const tablePropsDocuments = ref({
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
        name: 'date',
        field: 'date',
        required: true,
        label: 'Fecha de carga',
        align: 'left',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'name',
        field: 'name',
        required: true,
        label: 'Nombre',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status',
        required: true,
        label: 'Estado de cargue',
        align: 'left',
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
    rows: computed(
      () =>
        models.value.policies?.[selectedRowIndex.value ?? 0]?.attachments ?? []
    ),
  })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  const addNewRow = () => {
    const ids = modelsModal.coverage
      ?.map((r) => parseInt(String(r.id), 10))
      .filter((n) => !Number.isNaN(n))

    const maxId = ids?.length ? Math.max(...ids) : 0
    const nextId = (maxId + 1).toString().padStart(2, '0')

    modelsModal.coverage?.push({
      id: nextId,
      coverage_max_value: null,
      coverage_min_value: null,
      coverage_percent: null,
      risk_id: null,
    })
  }

  const openDeleteModal = (idRow: number) => {
    rowToDelete.value = idRow
    deleteModalRef.value.openModal()
  }

  const deleteRowModal = (id: string) => {
    modelsModal.coverage =
      modelsModal.coverage?.filter((r) => r.id !== id) ?? []

    deleteModalRef.value.closeModal()
  }

  const confirmDeleteAction = async () => {
    if (!rowToDelete.value) return

    models.value.policies = models.value?.policies?.filter(
      (r) => r.id !== rowToDelete.value
    )

    deleteModalRef.value.closeModal()
    rowToDelete.value = null
  }

  const openAddPoliciesModal = () => {
    addAdditionModalRef.value.openModal()
    updateModal.value = false
    cleanValuesModal()
  }

  const openEditPoliciesModal = (row: Policies) => {
    addAdditionModalRef.value.openModal()
    updateModal.value = true
    fillDataModal(row)
  }

  const cleanValuesModal = () => {
    modelsModal.id = null
    modelsModal.type_policy_id = null
    modelsModal.beneficiary_id = null
    modelsModal.insured_value = null
    modelsModal.policy_number = null
    modelsModal.validity_end = null
    modelsModal.validity_start = formatDate(
      new Date().toISOString(),
      'YYYY-MM-DD'
    )
    modelsModal.status_id = null
    modelsModal.insurance_company_id = null
    modelsModal.coverage = [
      {
        id: '01',
        risk_id: null,
        coverage_min_value: null,
        coverage_percent: null,
        coverage_max_value: null,
      },
    ]
  }

  const fillDataModal = (row: Policies) => {
    const clone = JSON.parse(JSON.stringify(row))

    Object.assign(modelsModal, clone)
  }

  const applyCoverageFromRiskTo = (index: number) => {
    const row = modelsModal.coverage?.[index]
    if (!row) return
    const risk = risk_list.value.find(
      (e) => Number(e.value) === Number(row.risk_id)
    )
    row.coverage_min_value = risk?.minimum_percentage ?? null
    row.coverage_percent = risk?.maximum_percentage ?? null
  }

  const saveAddition = () => {
    if (!formAdditionModal.value?.validate()) return
    models.value.policies = models.value.policies ?? []

    const payload: Policies = JSON.parse(JSON.stringify(modelsModal))

    if (!updateModal.value) {
      const ids = models.value.policies
        .map((p) => Number(p.id))
        .filter((n) => Number.isFinite(n))
      const nextId = ids.length ? Math.max(...ids) + 1 : 1
      payload.id = payload.id ?? nextId
      models.value.policies.push(payload)
    } else {
      const idx = models.value.policies.findIndex((p) => p.id === payload.id)
      if (idx > -1) {
        models.value.policies[idx] = payload
      }
    }

    addAdditionModalRef.value.closeModal()
  }

  const onFileAdded = async (files: File[]) => {
    if (!files?.length) return

    files.forEach((e) => {
      models.value.policies?.[selectedRowIndex.value ?? 0].attachments.push({
        ...e,
        id: attachmentsSelected.value.length + 1,
        name: e.name,
        date: formatDate(new Date().toISOString(), 'YYYY-MM-DD'),
        status: 'Exitoso',
        type: e.type,
        size: e.size,
      })
    })

    attachDocumentRef.value?.removeFilesRemote()
  }

  const deleteDocument = (id: number) => {
    const index = selectedRowIndex.value ?? 0

    if (models.value.policies && index >= 0) {
      models.value.policies[index].attachments =
        attachmentsSelected.value.filter((e) => e.id !== id)
    }
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

  watch(
    () => modelsModal.coverage?.map((c) => c.risk_id),
    (newIds, oldIds) => {
      if (!newIds) return
      newIds.forEach((rid, idx) => {
        if (rid !== oldIds?.[idx]) {
          applyCoverageFromRiskTo(idx)
        }
      })
    }
  )

  return {
    formElementRef,
    models,
    defaultIconsLucide,
    tableProps,
    deleteModalRef,
    addAdditionModalRef,
    modelsModal,
    tablePropsAddAdditions,
    policies,
    policy_status,
    third_parties,
    risk_list,
    formAdditionModal,
    selectedRow,
    updateModal,
    tablePropsDocuments,
    attachDocumentRef,
    deleteDocument,
    onFileAdded,
    saveAddition,
    deleteRowModal,
    openAddPoliciesModal,
    openEditPoliciesModal,
    confirmDeleteAction,
    openDeleteModal,
    addNewRow,
  }
}

export default usePoliciesForm
