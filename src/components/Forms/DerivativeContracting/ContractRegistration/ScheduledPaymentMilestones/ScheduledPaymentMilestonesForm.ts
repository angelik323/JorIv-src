// Vue - Pinia - Router - Quasar
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useCalendarRules, useUtils } from '@/composables'

// Interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IContractRegistrationGeneralDataForm,
  IContractRegistrationMilestones,
  IContractRegistrationMilestonesForm,
} from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Stores
import { useDerivativeContractingResourceStore } from '@/stores/resources-manager/derivative-contracting'

const useScheduledPaymentMilestonesForm = (
  props: {
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  },
  emit: Function
) => {
  const { payment_type } = storeToRefs(
    useDerivativeContractingResourceStore('v1')
  )

  const { isEmptyOrZero, defaultIconsLucide, getMaxId, formatCurrencyString, cleanCurrencyToNumber } =
    useUtils()

  const { only_after } = useCalendarRules()

  const formElementRef = ref()
  const formMilestonesRef = ref()

  const alertModalRef = ref()

  const models = ref<Partial<IContractRegistrationGeneralDataForm>>({
    amount: null,
    milestones: [],
    scheduled_foreign_amount: null,
    scheduled_local_amount: null,
    outstanding_foreign_amount: null,
    outstanding_local_amount: null,
  })

  const alertModalConfig = ref<IContractRegistrationMilestonesForm>({
    id: null,
    action: 'Crear',
    milestone: null,
    payment_type_id: null,
    scheduled_date: null,
    foreign_amount: null,
    local_amount: null,
    applies_budget: false,
  })

  const tableProperties = ref<IBaseTableProps<IContractRegistrationMilestones>>(
    {
      title: 'Hitos programados',
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
          field: (row) => row.milestone,
          sortable: true,
        },
        {
          name: 'payment_type_name',
          required: true,
          label: 'Tipo de pago',
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
          name: 'foreign_amount',
          required: true,
          label: 'Monto extranjero',
          align: 'left',
          field: 'foreign_amount',
          sortable: true,
          format: (val) =>
            formatCurrencyString(val, { showCurrencySymbol: false }) ??
            '',
        },
        {
          name: 'local_amount',
          required: true,
          label: 'Valor del hito COP',
          align: 'left',
          field: (row) => row.local_amount,
          sortable: true,
          format: (val) =>
            formatCurrencyString(val, { showCurrencySymbol: true }) ??
            '',
        },
        {
          name: 'applies_budget',
          required: true,
          label: 'Aplicar Ppto',
          align: 'left',
          field: 'applies_budget',
          sortable: true,
          format: (val: boolean) => (val ? 'Sí' : 'No'),
        },
        ...(props.action === 'view'
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
            ]),
      ],
      rows: [],
      pages: { currentPage: 0, lastPage: 0 },
    }
  )

  const setValueModel = () => {
    Object.assign(models.value, props.data)
  }

  const handleAddScheduledPaymentMilestone = async () => {
    if (!(await formMilestonesRef.value.validate())) return

    const { action, id, milestone, ...configData } = alertModalConfig.value

    const milestones = {
      id: id ?? getMaxId(models.value.milestones ?? []) + 1,
      milestone: ((models.value.milestones?.length ?? 0) + 1)
        ?.toString()
        ?.padStart(3, '0'),
      payment_type_id: configData.payment_type_id ?? '',
      payment_type_name: configData.payment_type_name ?? '',
      scheduled_date: configData.scheduled_date,
      foreign_amount: configData.foreign_amount,
      local_amount: (
        Number(configData.foreign_amount ?? 0) *
        Number(models.value.trm_value_raw ?? 1)
      ).toString(),
      applies_budget: configData.applies_budget ?? false,
      is_new_milestone: props.action === 'create',
    }

    if (action === 'Editar') {
      const index = models.value.milestones?.findIndex((it) => it.id === id)

      if (index !== undefined && index > -1) {
        models.value.milestones![index] = milestones
      }
    } else {
      models.value.milestones?.push(milestones)
    }

    clearAlertModal()
    await alertModalRef.value.closeModal()
  }

  const clearAlertModal = () => {
    alertModalConfig.value = {
      id: null,
      action: 'Crear',
      milestone: null,
      payment_type_id: null,
      scheduled_date: null,
      foreign_amount: null,
      local_amount: null,
      applies_budget: !models.value?.is_editable_ppto || false,
    }
  }

  const handleDeleteScheduledPaymentMilestone = (id: number) => {
    models.value.milestones = models.value.milestones?.filter(
      (item) => item.id !== id
    )

    models.value.budget_documents?.forEach((document) => {
      document.operation_log_details?.forEach((log) => {
        if (log.budget_records) {
          log.budget_records = log.budget_records.filter(
            (relation) => relation.id !== id
          )
        }
      })
    })

    models.value.future_validities?.forEach((futureValidity) => {
      if (futureValidity.milestones) {
        futureValidity.milestones = futureValidity.milestones.filter(
          (relation) => relation.id !== id
        )
      }
    })
  }

  const handleOpenModalScheduledPaymentMilestone = async () => {
    clearAlertModal()
    await alertModalRef.value.openModal()
  }

  const handleEditScheduledPaymentMilestone = async (id: number) => {
    const milestone = models.value.milestones?.find((item) => item.id === id)
    if (!milestone) return

    Object.assign(alertModalConfig.value, {
      id: milestone.id,
      action: 'Editar',
      milestone: milestone.milestone,
      payment_type_id: milestone.payment_type_id,
      payment_type_name: milestone.payment_type_name,
      scheduled_date: milestone.scheduled_date,
      foreign_amount: milestone.foreign_amount,
      local_amount: milestone.local_amount,
      applies_budget: milestone.applies_budget,
    })

    await alertModalRef.value.openModal()
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

  watch(
    () => models.value?.milestones,
    (val) => {
      val?.forEach((milestone) => {
        const is_used =
          models.value.budget_documents?.some((doc) =>
            doc.operation_log_details?.some((log) =>
              log.budget_records?.some((record) => record.id === milestone.id)
            )
          ) ||
          models.value.future_validities?.some((fv) =>
            fv.milestones?.some((m) => m.id === milestone.id)
          )

        milestone.is_used = is_used || false
      })

      tableProperties.value.rows = val as IContractRegistrationMilestones[]

      const scheduledForeignTotal = tableProperties.value.rows.reduce(
        (acc, milestone) => acc + (cleanCurrencyToNumber(milestone.foreign_amount ?? 0)),
        0
      )


      models.value.scheduled_foreign_amount = scheduledForeignTotal?.toString()
      models.value.scheduled_local_amount = (
        scheduledForeignTotal * (models.value.trm_value_raw ?? 0)
      ).toString()

      models.value.outstanding_foreign_amount = String(
        cleanCurrencyToNumber(models.value.amount ?? 0) -
          scheduledForeignTotal
      )
      
      models.value.outstanding_local_amount = (
        Number(models.value.outstanding_foreign_amount ?? 0) * (models.value.trm_value_raw ?? 0)
      ).toString()
    },
    { immediate: true, deep: true }
  )


  
  return {
    models,
    formElementRef,
    formMilestonesRef,
    tableProperties,
    defaultIconsLucide,
    alertModalRef,
    alertModalConfig,
    payment_type,

    handleOpenModalScheduledPaymentMilestone,
    handleAddScheduledPaymentMilestone,
    handleEditScheduledPaymentMilestone,
    handleDeleteScheduledPaymentMilestone,
    formatCurrencyString,
    only_after,
  }
}

export default useScheduledPaymentMilestonesForm
