// Vue - Pinia - Router - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IContractRegistrationAssociatedBudget,
  IContractRegistrationBudgetDocuments,
  IContractRegistrationBudgetRecords,
  IContractRegistrationGeneralDataForm,
  IContractRegistrationMilestones,
  IOperationLogDetail,
  IOperationLogsAuthorizedContract,
} from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useAssociatedBudgetForm = (
  props: {
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  },
  emit: Function
) => {
  const { operation_logs_authorized } = storeToRefs(
    useBudgetResourceStore('v1')
  )

  const {
    isEmptyOrZero,
    defaultIconsLucide,
    getMaxId,
    formatCurrencyString,
    formatDate,
    formatCodeName,
  } = useUtils()

  const formElementRef = ref()
  const formAssociatedBudgetRef = ref()
  const formMilestonesRef = ref()
  const alertModalRef = ref()

  const alertModalConfig = ref({
    id: null as number | null,
    budget_document_id: null as number | null,
    budget_document_type_id: null as number | null,

    scheduled_milestone_id: null as number | null,
  })

  const selectedRowsAssociatedBudget = ref<
    IContractRegistrationBudgetDocuments[]
  >([])

  const modalAddAssociatedRef = ref()
  const modalAddAssociatedConfig = ref<IContractRegistrationBudgetDocuments>({
    id: null,
    action: 'Agregar',
    validity: null,
    budget_document_type_id: null,
    budget_document_type_name: null,
    budget_document_id: null,
    document_name: null,
    committed_balance: null,
    committed_value: null,
    document_date: null,
    value_document: null,
    available_balance: null,

    operation_log_details: [],
  })

  const models = ref<Partial<IContractRegistrationGeneralDataForm>>({
    total_available_balance: '0',
    total_committed_balance: '0',
    total_outstanding_balance: '0',

    budget_documents: [],
  })

  const milestones = computed(
    () =>
      models.value.milestones
        ?.filter((it) => it.applies_budget)
        ?.map((it) => ({
          value: it.id,
          label: it.milestone,
        })) || []
  )

  const getActionColumn = () =>
    props.action === 'view'
      ? []
      : [
          {
            name: 'actions',
            required: true,
            label: 'Acciones',
            align: 'left',
            field: 'id',
            sortable: false,
          } as const,
        ]

  const tablePropertiesAssociatedBudget = ref<
    IBaseTableProps<IContractRegistrationAssociatedBudget>
  >({
    title: 'Asociar documento presupuestal',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: 'validity',
        sortable: true,
      },
      {
        name: 'budget_document_type_name',
        required: true,
        label: 'Tipo de documento presupuestal',
        align: 'left',
        field: 'budget_document_type_name',
        sortable: true,
      },
      {
        name: 'value_document',
        required: true,
        label: 'Valor del documento presupuestal',
        align: 'left',
        field: 'value_document',
        sortable: true,
        format: (val) => formatCurrencyString(val) ?? '',
      },
      {
        name: 'document_date',
        required: true,
        label: 'Fecha del documento',
        align: 'left',
        field: 'document_date',
        sortable: true,
      },
      {
        name: 'available_balance',
        required: true,
        label: 'Saldo disponible',
        align: 'left',
        field: 'available_balance',
        sortable: true,
        format: (val) => formatCurrencyString(val) ?? '',
      },
      {
        name: 'document_name',
        required: true,
        label: 'Número de documento',
        align: 'left',
        field: 'document_name',
        sortable: true,
      },
      ...getActionColumn(),
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tablePropertiesResourcesAssociatedBudget = ref<
    IBaseTableProps<IContractRegistrationBudgetRecords>
  >({
    title: 'Listado de registros de presupuesto asociado a la disponibilidad',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: 'validity',
        sortable: true,
      },
      {
        name: 'resource',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: 'resource',
        sortable: true,
      },
      {
        name: 'area',
        required: true,
        label: 'Área',
        align: 'left',
        field: 'area',
        sortable: true,
      },
      {
        name: 'rubric',
        required: true,
        label: 'Rubro',
        align: 'left',
        field: 'rubric',
        sortable: true,
      },
      {
        name: 'adjusted_value',
        required: true,
        label: 'Valor disponible',
        align: 'left',
        field: 'adjusted_value',
        sortable: true,
        format: (val) => formatCurrencyString(val) ?? '',
      },
      {
        name: 'committed_value',
        required: true,
        label: 'Valor comprometido',
        align: 'left',
        field: 'committed_value',
        sortable: true,
        format: (val) => formatCurrencyString(val) ?? '',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'left',
        field: 'id',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tablePropertiesBudgetRecord = ref<
    IBaseTableProps<IContractRegistrationBudgetRecords>
  >({
    title: 'Registro presupuestal',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'validity',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: 'validity',
        sortable: true,
      },
      {
        name: 'resource',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: 'resource',
        sortable: true,
      },
      {
        name: 'area',
        required: true,
        label: 'Área',
        align: 'left',
        field: 'area',
        sortable: true,
      },
      {
        name: 'rubric',
        required: true,
        label: 'Rubro',
        align: 'left',
        field: 'rubric',
        sortable: true,
      },
      {
        name: 'adjusted_value',
        required: true,
        label: 'Valor disponible',
        align: 'left',
        field: 'adjusted_value',
        sortable: true,
        format: (val) => formatCurrencyString(val) ?? '',
      },
      {
        name: 'committed_value',
        required: true,
        label: 'Valor comprometido',
        align: 'left',
        field: 'committed_value',
        sortable: true,
        format: (val) => formatCurrencyString(val) ?? '',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tablePropertiesScheduledMilestones = ref<
    IBaseTableProps<IContractRegistrationMilestones>
  >({
    title: 'Asociación hitos programados',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'milestone',
        required: true,
        label: 'Hito',
        align: 'left',
        field: 'milestone',
        sortable: true,
      },
      {
        name: 'payment_type_name',
        required: true,
        label: 'Tipo de hito',
        align: 'left',
        field: 'payment_type_name',
        sortable: true,
      },
      {
        name: 'scheduled_date',
        required: true,
        label: 'Fecha',
        align: 'left',
        field: 'scheduled_date',
        sortable: true,
      },
      {
        name: 'local_amount',
        required: true,
        label: 'Valor hito',
        align: 'left',
        field: (row) => row.foreign_amount || row.local_amount,
        sortable: true,
        format: (val) => formatCurrencyString(val) ?? '',
      },
      {
        name: 'assigned_value',
        required: true,
        label: 'Valor asignado en el presupuesto',
        align: 'left',
        field: 'assigned_value',
        sortable: true,
        format: (val) => formatCurrencyString(val) ?? '',
      },
      ...getActionColumn(),
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const setValueModel = () => {
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const handleAddAssociatedBudget = async () => {
    clearAlertModal()
    await modalAddAssociatedRef.value.openModal()
  }

  const handleConfirmedAssociatedBudget = async () => {
    if (!(await formAssociatedBudgetRef.value.validate())) return

    const { action, id, ...configData } = modalAddAssociatedConfig.value

    const AssociatedBudget = {
      id: id ?? getMaxId(models.value.budget_documents ?? []) + 1,
      validity: modalAddAssociatedConfig.value.validity ?? '',
      document_name: configData.document_name ?? '',
      budget_document_type_id: configData.budget_document_type_id ?? null,
      budget_document_type_name: configData.budget_document_type_name ?? '',
      value_document: configData.value_document ?? '',
      available_balance: configData.available_balance ?? '',
      document_date: configData.document_date ?? '',
      budget_document_id: configData.budget_document_id ?? null,
      committed_balance: configData.committed_balance,
      is_new_associated_budget: action === 'Agregar',

      operation_log_details: configData.operation_log_details ?? [],
    }

    if (action === 'Editar') {
      const index = models.value.budget_documents?.findIndex(
        (it) => it.id === id
      )

      if (index !== undefined && index > -1) {
        models.value.budget_documents![index] = AssociatedBudget
      }
    } else {
      models.value.budget_documents?.push(AssociatedBudget)
    }

    clearAlertModal()
    await modalAddAssociatedRef.value.closeModal()
  }

  const clearAlertModal = () => {
    modalAddAssociatedConfig.value = {
      id: null,
      action: 'Agregar',
      validity: null,
      budget_document_type_id: null,
      budget_document_type_name: null,
      document_name: null,
      budget_document_id: null,
      committed_balance: null,
      document_date: null,
      value_document: null,
      available_balance: null,

      operation_log_details: [],
    }
  }

  const clearAlertModalConfig = () => {
    alertModalConfig.value = {
      id: null,
      budget_document_id: null,
      budget_document_type_id: null,
      scheduled_milestone_id: null,
    }
  }

  const handleEditAssociatedBudget = async (id: number) => {
    const foundBudget = models.value.budget_documents?.find(
      (item) => item.id === id
    )
    if (!foundBudget) return

    Object.assign(modalAddAssociatedConfig.value, {
      id: foundBudget.id,
      action: 'Editar',
      validity: foundBudget.validity ?? null,
      document_name: foundBudget.document_name ?? null,
      budget_document_type_id: foundBudget.budget_document_type_id ?? null,
      budget_document_type_name: foundBudget.budget_document_type_name ?? null,
      budget_document_id: foundBudget.budget_document_id ?? null,
      available_balance: foundBudget.available_balance ?? null,
      value_document: foundBudget.value_document ?? null,
      document_date: foundBudget.document_date ?? null,
      committed_balance: foundBudget.committed_balance ?? null,
      operation_log_details: foundBudget.operation_log_details ?? [],
    })

    await modalAddAssociatedRef.value.openModal()
  }

  const handleDeleteAssociatedBudget = (id: number) => {
    models.value.budget_documents = (
      models.value.budget_documents ?? []
    ).filter((budget) => budget.id !== id)

    if (models.value.budget_documents) {
      selectedRowsAssociatedBudget.value = []
      tablePropertiesResourcesAssociatedBudget.value.rows = []
    }
  }

  const handleRelateMilestone = async () => {
    const selectedDocumentId = selectedRowsAssociatedBudget.value?.[0]?.id
    const selectedBudgetRecordId =
      tablePropertiesBudgetRecord.value.rows?.[0]?.id

    const document = models.value.budget_documents?.find(
      (doc) => doc.id === selectedDocumentId
    )
    if (!document) return

    const budgetRecord = document.operation_log_details?.find(
      (log) => log.id === selectedBudgetRecordId
    )
    if (!budgetRecord) return

    budgetRecord.budget_records =
      tablePropertiesScheduledMilestones.value.rows.map((milestone) => ({
        id: milestone.id ?? 0,
        milestone: milestone.milestone,
        assigned_value: String(milestone.assigned_value ?? '0'),
      }))

    const recordInMainTable =
      tablePropertiesResourcesAssociatedBudget.value.rows.find(
        (row) => row.id === alertModalConfig.value.id
      )
    if (recordInMainTable)
      recordInMainTable.committed_value =
        tablePropertiesBudgetRecord.value.rows[0].committed_value

    await alertModalRef.value.closeModal()
  }

  const handleUpdateAssignedValue = (assignedValue: number | string | null) => {
    const strValue = String(assignedValue)
    tablePropertiesBudgetRecord.value.rows[0].committed_value = strValue
  }

  const handleAddAssociatedMilestone = (
    row: IContractRegistrationBudgetRecords
  ) => {
    clearAlertModalConfig()
    alertModalConfig.value.id = row.id

    const document = models.value.budget_documents?.find(
      (doc) => doc.budget_document_id === row.budget_document_id
    )

    const budgetRecord = document?.operation_log_details?.find(
      (log) => log.id == row.id
    )

    tablePropertiesBudgetRecord.value.rows = [
      {
        ...budgetRecord,
        id: row.id,
        validity: row.validity || '',
        resource: row.resource || '',
        area: row.area || '',
        rubric: row.rubric || '',
        available_value: row.available_value || '',
        committed_value: row.committed_value || '',
        budget_document_id: row.budget_document_id || null,
      },
    ]

    alertModalRef.value.openModal()

    tablePropertiesScheduledMilestones.value.rows = []
    if (!budgetRecord?.budget_records) return

    tablePropertiesScheduledMilestones.value.rows =
      budgetRecord.budget_records?.map((relation) => {
        const originalMilestone = models.value.milestones?.find(
          (m) => m.milestone === relation.milestone
        )
        return {
          id: relation.id!,
          milestone: originalMilestone?.milestone ?? '',
          payment_type_id: originalMilestone?.payment_type_id ?? '',
          payment_type_name: originalMilestone?.payment_type_name ?? '',
          scheduled_date: originalMilestone?.scheduled_date ?? '',
          local_amount: originalMilestone?.local_amount ?? '',
          foreign_amount: originalMilestone?.foreign_amount ?? '',
          assigned_value: String(relation.assigned_value ?? '0'),
          applies_budget: originalMilestone?.applies_budget ?? false,
        }
      }) || []
  }

  const handleDeleteScheduledMilestone = (id: number) => {
    const milestone = tablePropertiesScheduledMilestones.value.rows.find(
      (m) => m.id === id
    )
    if (!milestone) return

    const budgetRecordModal = tablePropertiesBudgetRecord.value.rows?.[0]

    tablePropertiesScheduledMilestones.value.rows =
      tablePropertiesScheduledMilestones.value.rows.filter((m) => m.id !== id)

    budgetRecordModal.committed_value = '0'

    const mainTableRecord =
      tablePropertiesResourcesAssociatedBudget.value.rows.find(
        (row) => row.id === budgetRecordModal.id
      )
    if (mainTableRecord) {
      mainTableRecord.committed_value = '0'
    }

    const document = models.value.budget_documents?.find(
      (doc) => doc.id === selectedRowsAssociatedBudget.value?.[0].id
    )

    const budgetRecord = document?.operation_log_details?.find(
      (log) => log.id === budgetRecordModal?.id
    )

    if (budgetRecord?.budget_records) {
      budgetRecord.budget_records = budgetRecord.budget_records.filter(
        (m) => m.id !== id
      )
    }
  }

  const handleSelectAssociatedBudget = (
    selected: IContractRegistrationBudgetDocuments[]
  ) => {
    if (!selected?.[0]?.id) {
      tablePropertiesResourcesAssociatedBudget.value.rows = []
      return
    }

    const document = models.value.budget_documents?.find(
      (doc) => doc.id === selected[0].id
    )

    if (!document) {
      tablePropertiesResourcesAssociatedBudget.value.rows = []
      return
    }

    selectedRowsAssociatedBudget.value = [document]

    tablePropertiesResourcesAssociatedBudget.value.rows =
      document.operation_log_details
        ?.filter((it) => Math.sign(Number(it.adjusted_value)) !== -1)
        ?.map((log) => ({
          id: log.id,
          contract_budget_record_id: document.id,
          contract_payment_milestone: null,
          assigned_value: '0',
          validity: String(log.year),
          resource: formatCodeName(
            log.budget_resource?.code,
            log.budget_resource?.description
          ),
          rubric: formatCodeName(
            log.budget_item?.code,
            log.budget_item?.description
          ),
          area: formatCodeName(
            log.area_resposability?.code,
            log.area_resposability?.description
          ),
          available_value: String(log.value),
          adjusted_value: String(log.adjusted_value),
          committed_value: String(
            log.budget_records?.reduce(
              (sum, relation) => sum + Number(relation.assigned_value || 0),
              0
            ) || 0
          ),
          budget_document_id: document.budget_document_id || null,
        })) || []
  }

  const handleAddMilestones = () => {
    const findMilestone = models.value.milestones?.find(
      (it) => it.id === alertModalConfig.value.scheduled_milestone_id
    )

    const alreadyExists = tablePropertiesScheduledMilestones.value.rows?.some(
      (it) => it.id === alertModalConfig.value.scheduled_milestone_id
    )

    if (findMilestone && !alreadyExists)
      tablePropertiesScheduledMilestones.value.rows.push({ ...findMilestone })

    alertModalConfig.value.scheduled_milestone_id = null
  }

  const updateValDocumentType = (val: IOperationLogsAuthorizedContract) => {
    const config = modalAddAssociatedConfig.value
    modalAddAssociatedConfig.value.budget_document_id = val?.id
      ? Number(val.id)
      : null

    config.budget_document_id = val?.id ? Number(val.id) : null
    config.document_name = `${val?.id ?? ''} - ${val?.operation_label ?? ''}`
    config.budget_document_type_id = val?.budget_document_type_id ?? null
    config.budget_document_type_name = formatCodeName(
      val?.budget_document_type?.code ?? '',
      val?.budget_document_type?.description ?? ''
    )
    config.committed_balance = null
    config.value_document = val?.total_value?.toString() ?? null
    config.available_balance = val?.total_value?.toString() ?? null
    config.document_date = formatDate(val?.date, 'YYYY-MM-DD')
    config.operation_log_details = val?.operation_log_details || []
  }

  const calculateCommittedBalance = (
    operationLogDetails?: IOperationLogDetail[]
  ): number =>
    operationLogDetails?.reduce((logAcc, log) => {
      const budgetRecordsTotal =
        log.budget_records?.reduce(
          (recordAcc, record) =>
            recordAcc + (Number(record.assigned_value) || 0),
          0
        ) || 0
      return logAcc + budgetRecordsTotal
    }, 0) || 0

  watch(
    () => models.value?.milestones,
    () => {
      if (tablePropertiesBudgetRecord.value.rows.length === 0) return

      const budgetRecordId = tablePropertiesBudgetRecord.value?.rows?.[0]?.id
      const document = models.value.budget_documents?.find(
        (doc) => doc.id === selectedRowsAssociatedBudget.value?.[0]?.id
      )
      const budgetRecord = document?.operation_log_details?.find(
        (log) => log.id === budgetRecordId
      )

      if (budgetRecord?.budget_records) {
        tablePropertiesScheduledMilestones.value.rows =
          budgetRecord.budget_records?.map((relation) => {
            const originalMilestone = models.value.milestones?.find(
              (m) => m.milestone === relation.milestone
            )
            return {
              id: relation.id!,
              milestone: originalMilestone?.milestone ?? '',
              payment_type_id: originalMilestone?.payment_type_id ?? '',
              payment_type_name: originalMilestone?.payment_type_name ?? '',
              scheduled_date: originalMilestone?.scheduled_date ?? '',
              local_amount: originalMilestone?.local_amount ?? '',
              foreign_amount: originalMilestone?.foreign_amount ?? '',
              assigned_value: String(relation.assigned_value ?? '0'),
              applies_budget: originalMilestone?.applies_budget ?? false,
            }
          }) || []
      }
    },
    { deep: true }
  )

  watch(
    () => models.value?.budget_documents,
    (val) => {
      if (!val) return

      val.forEach((document) => {
        const documentCommittedBalance = calculateCommittedBalance(
          document.operation_log_details
        )

        const newCommittedBalance = String(documentCommittedBalance)
        const newAvailableBalance = (
          Number(document.value_document || 0) -
          Number(documentCommittedBalance) * Number(models.value.trm_value_raw ?? 1)
        )?.toString()

        if (document.committed_balance !== newCommittedBalance) {
          document.committed_balance = newCommittedBalance
        }
        if (document.available_balance !== newAvailableBalance) {
          document.available_balance = newAvailableBalance
        }
      })

      tablePropertiesAssociatedBudget.value.rows =
        val as IContractRegistrationAssociatedBudget[]


      const total_available_balance =
        tablePropertiesAssociatedBudget.value.rows?.reduce(
          (acc, item) => acc + (Number(item.available_balance) || 0),
          0
        )

      const total_committed_balance = val?.reduce((acc, item) => {
        return acc + calculateCommittedBalance(item.operation_log_details)
      }, 0) * Number(models.value.trm_value_raw ?? 1)

      models.value.total_available_balance = total_available_balance?.toString()
      models.value.total_committed_balance = total_committed_balance?.toString()
      
      models.value.total_outstanding_balance = (
        Number(models.value.contract_value || 0) - Number(total_committed_balance || 0)
      ).toString()

    },
    { immediate: true, deep: true }
  )

  return {
    models,
    formElementRef,
    tablePropertiesAssociatedBudget,
    tablePropertiesResourcesAssociatedBudget,
    tablePropertiesBudgetRecord,
    tablePropertiesScheduledMilestones,
    defaultIconsLucide,
    alertModalRef,
    formAssociatedBudgetRef,
    formMilestonesRef,
    alertModalConfig,
    modalAddAssociatedRef,
    modalAddAssociatedConfig,
    milestones,
    operation_logs_authorized,
    selectedRowsAssociatedBudget,

    handleRelateMilestone,
    handleConfirmedAssociatedBudget,
    handleAddAssociatedBudget,
    handleEditAssociatedBudget,
    handleDeleteAssociatedBudget,
    handleAddAssociatedMilestone,
    handleDeleteScheduledMilestone,
    formatCurrencyString,
    handleSelectAssociatedBudget,
    handleAddMilestones,
    handleUpdateAssignedValue,
    updateValDocumentType,
  }
}

export default useAssociatedBudgetForm
