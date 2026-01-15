// Vue - Pinia - Router - Quasar
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import {
  IContractRegistrationFutureValiditiesForm,
  IContractRegistrationGeneralDataForm,
  IContractRegistrationMilestones,
  IContractRegistrationResourcesAssociatedBudget,
} from '@/interfaces/customs/derivative-contracting/ContractRegistration'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useFutureValiditiesForm = (
  props: {
    action: ActionType
    data?: IContractRegistrationGeneralDataForm | null
  },
  emits: Function
) => {
  const {
    areas_resposabilities_codes,
    budget_item_codes,
    budget_resources_types,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const { isEmptyOrZero, defaultIconsLucide, getMaxId, formatCurrencyString } =
    useUtils()

  const formElementRef = ref()
  const modalAddFutureValiditiesRef = ref()
  const futureValiditiesFormRef = ref()

  const selectedRows = ref<IContractRegistrationResourcesAssociatedBudget[]>([])
  const modalAddFutureValiditiesConfig =
    ref<IContractRegistrationFutureValiditiesForm>({
      id: null,
      action: 'Agregar',
      fiscal_year: null,
      budget_resource_id: null,
      budget_resource: null,
      budget_area_id: null,
      budget_area: null,
      budget_item_id: null,
      budget_item: null,
      projected_value: null,
      committed_future_value: null,
      milestones: [],
    })

  const models = ref<Partial<IContractRegistrationGeneralDataForm>>({
    scheduled_milestone_id: null,
    total_future_coverage: null,
    pending_budget_allocation: null,
    future_validities: [],
  })

  const milestones = computed(() => {
    return models.value.milestones?.map((it) => ({
      value: it.id,
      label: it.milestone,
    }))
  })

  const tablePropertiesAssociatedBudget = ref<
    IBaseTableProps<IContractRegistrationResourcesAssociatedBudget>
  >({
    title: 'Asociación de la proyección presupuestal en vigencias futuras',
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
        name: 'fiscal_year',
        required: true,
        label: 'Vigencia',
        align: 'left',
        field: 'fiscal_year',
        sortable: true,
      },
      {
        name: 'budget_resource',
        required: true,
        label: 'Recurso',
        align: 'left',
        field: 'budget_resource',
        sortable: true,
      },
      {
        name: 'budget_area',
        required: true,
        label: 'Área',
        align: 'left',
        field: 'budget_area',
        sortable: true,
      },
      {
        name: 'budget_item',
        required: true,
        label: 'Rubro',
        align: 'left',
        field: 'budget_item',
        sortable: true,
      },
      {
        name: 'projected_value',
        required: true,
        label: 'Valor proyectado',
        align: 'left',
        field: 'projected_value',
        sortable: true,
        format: (val: number) => formatCurrencyString(val) ?? '0',
      },
      {
        name: 'committed_future_value',
        required: true,
        label: 'Compromiso vigencia futura',
        align: 'left',
        field: 'committed_future_value',
        sortable: true,
        format: (val: number) => formatCurrencyString(val) ?? '',
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
        name: 'amount_value',
        required: true,
        label: 'Valor hito',
        align: 'left',
        field: 'amount_value',
        sortable: true,
        format: (val: number) => formatCurrencyString(val) ?? '',
      },
      {
        name: 'future_coverage_amount',
        required: true,
        label: 'Monto con asignado cobertura futura',
        align: 'left',
        field: 'future_coverage_amount',
        sortable: true,
        format: (val: number) => formatCurrencyString(val) ?? '0',
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
      emits('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const handleAddFutureValidity = async () => {
    clearAlertModal()

    await modalAddFutureValiditiesRef.value?.openModal()
  }

  const handleEditFutureValidity = async (id: number) => {
    const foundItem = models.value.future_validities?.find(
      (item) => item.id === id
    )

    if (foundItem) {
      modalAddFutureValiditiesConfig.value = {
        id: foundItem.id ?? null,
        action: 'Editar',
        fiscal_year: Number(foundItem.fiscal_year),
        budget_resource_id: Number(foundItem.budget_resource_id),
        budget_resource: String(foundItem.budget_resource),
        budget_area_id: Number(foundItem.budget_area_id),
        budget_area: String(foundItem.budget_area),
        budget_item_id: Number(foundItem.budget_item_id),
        budget_item: String(foundItem.budget_item),
        projected_value: String(foundItem.projected_value),
        committed_future_value: String(foundItem.committed_future_value),

        milestones: (foundItem.milestones || []).map((relation) => ({
          id: relation.id ?? null,
          future_coverage_amount: Number(relation.future_coverage_amount ?? 0),
        })),
      }
    }

    await modalAddFutureValiditiesRef.value.openModal()
  }

  const clearAlertModal = () => {
    modalAddFutureValiditiesConfig.value = {
      id: null,
      action: 'Agregar',
      fiscal_year: null,
      budget_resource_id: null,
      budget_resource: null,
      budget_area_id: null,
      budget_area: null,
      budget_item_id: null,
      budget_item: null,
      projected_value: Math.abs(
        Number(models.value?.amount) -
          Number(models.value?.total_committed_balance)
      )?.toString(),
      committed_future_value: '0',

      milestones: [],
    }
  }

  const handleConfirmedFutureValidity = async () => {
    if (!(await futureValiditiesFormRef.value.validate())) return

    const { action, id, ...configData } = modalAddFutureValiditiesConfig.value

    const futureValidity = {
      id: id ?? getMaxId(models.value.future_validities ?? []) + 1,
      fiscal_year: configData.fiscal_year ?? '',
      budget_resource: configData.budget_resource ?? '',
      budget_resource_id: configData.budget_resource_id ?? '',
      budget_area: configData.budget_area ?? '',
      budget_area_id: configData.budget_area_id ?? '',
      budget_item: configData.budget_item ?? '',
      budget_item_id: configData.budget_item_id ?? '',
      projected_value: Math.abs(
        Number(models.value?.amount) -
          Number(models.value?.total_committed_balance)
      ),
      committed_future_value: configData.committed_future_value ?? '',

      milestones: (configData.milestones ?? []).map((relation) => ({
        id: relation.id ?? null,
        future_coverage_amount: String(relation.future_coverage_amount ?? '0'),
      })),
      is_new_future_validity: action === 'Crear',
    }

    if (action === 'Editar') {
      const index = models.value.future_validities?.findIndex(
        (it) => it.id === id
      )

      if (index !== undefined && index > -1) {
        models.value.future_validities![index] = futureValidity
      }
    } else {
      models.value.future_validities?.push(futureValidity)
    }

    clearAlertModal()
    modalAddFutureValiditiesRef.value?.closeModal()
  }

  const handleDeleteAssociatedBudget = (id: number) => {
    const filteredBudgets = models.value.future_validities?.filter(
      (it) => it.id !== id
    )
    models.value.future_validities = filteredBudgets
  }

  const handleDeleteAssociatedMilestone = async (id: number) => {
    if (!models.value.future_validities) return

    models.value.future_validities.forEach((futureValidity) => {
      if (futureValidity.milestones) {
        futureValidity.milestones = futureValidity.milestones.filter(
          (m) => m.id !== id
        )
      }
    })
    tablePropertiesScheduledMilestones.value.rows =
      tablePropertiesScheduledMilestones.value.rows.filter((m) => m.id !== id)
  }

  const handleAddMilestones = () => {
    const milestoneId = models.value.scheduled_milestone_id
    const milestone = models.value.milestones?.find((m) => m.id === milestoneId)
    const selectedFutureValidityId = selectedRows.value[0].id

    const futureValidityIndex = models.value.future_validities?.findIndex(
      (fv) => fv.id === selectedFutureValidityId
    )

    if (futureValidityIndex === undefined || futureValidityIndex < 0) return

    const futureValidity = models.value.future_validities![futureValidityIndex]

    const alreadyExists = futureValidity?.milestones?.some(
      (m) => m.id === milestoneId
    )

    if (alreadyExists) {
      models.value.scheduled_milestone_id = null
      return
    }

    futureValidity?.milestones?.push({
      id: milestone?.id ?? null,
      future_coverage_amount: milestone?.assigned_value ?? '0',
      amount_value:
        milestone?.local_amount ?? (milestone?.foreign_amount || '0'),
    })

    if (milestone) {
      tablePropertiesScheduledMilestones.value.rows.push({
        id: milestone.id!,
        milestone: milestone.milestone ?? '',
        payment_type_id: String(milestone.payment_type_id ?? ''),
        payment_type_name: milestone.payment_type_name ?? '',
        scheduled_date: milestone.scheduled_date ?? '',
        local_amount: String(milestone.local_amount ?? '0'),
        applies_budget: milestone.applies_budget ?? false,
        future_coverage_amount: milestone.assigned_value ?? '0',
        amount_value:
          milestone.local_amount ?? (milestone.foreign_amount || '0'),
      })
    }

    models.value.scheduled_milestone_id = null
  }

  const handleSelectedRows = (
    selected: IContractRegistrationResourcesAssociatedBudget[]
  ) => {
    tablePropertiesScheduledMilestones.value.rows =
      selected?.[0]?.milestones
        ?.filter(
          (relation) => relation.id !== null && relation.id !== undefined
        )
        .map((relation) => {
          const originalMilestone = models.value.milestones?.find(
            (m) => m.id === relation.id
          )
          return {
            id: relation.id!,
            milestone: originalMilestone?.milestone ?? '',
            payment_type_id: String(originalMilestone?.payment_type_id ?? ''),
            payment_type_name: originalMilestone?.payment_type_name ?? '',
            scheduled_date: originalMilestone?.scheduled_date ?? '',
            local_amount: String(originalMilestone?.local_amount ?? '0'),
            applies_budget: originalMilestone?.applies_budget ?? false,
            future_coverage_amount: relation.future_coverage_amount ?? '0',
            amount_value:
              originalMilestone?.local_amount ??
              (originalMilestone?.foreign_amount || '0'),
          }
        }) || []
  }

  watch(
    () => models.value?.milestones,
    () => {
      if (selectedRows.value.length > 0) {
        const selectedValidity = selectedRows.value[0]
        tablePropertiesScheduledMilestones.value.rows =
          selectedValidity?.milestones
            ?.filter(
              (relation) => relation.id !== null && relation.id !== undefined
            )
            .map((relation) => {
              const originalMilestone = models.value.milestones?.find(
                (m) => m.id === relation.id
              )
              return {
                id: relation.id!,
                milestone: originalMilestone?.milestone ?? '',
                payment_type_id: String(
                  originalMilestone?.payment_type_id ?? ''
                ),
                amount_value: originalMilestone?.local_amount ?? '0',
                payment_type_name: originalMilestone?.payment_type_name ?? '',
                scheduled_date: originalMilestone?.scheduled_date ?? '',
                local_amount: String(originalMilestone?.local_amount ?? '0'),
                applies_budget: originalMilestone?.applies_budget ?? false,
                future_coverage_amount: relation.future_coverage_amount ?? '0',
              }
            }) || []
      }
    },
    { deep: true }
  )

  watch(
    () => models.value?.future_validities,
    (val) => {
      tablePropertiesAssociatedBudget.value.rows =
        val?.map((document) => {
          const committedFutureValue =
            document.milestones?.reduce((acc, relation) => {
              return acc + (Number(relation.amount_value) || 0)
            }, 0) || 0

          return {
            ...document,
            committed_future_value: String(committedFutureValue),
          }
        }) || []

      const total_future_coverage = val?.reduce((acc, item) => {
        const milestones =
          item.milestones?.reduce((milAcc, mil) => {
            return milAcc + Number(mil.future_coverage_amount || 0)
          }, 0) || 0

        return acc + milestones
      }, 0)

      models.value.total_future_coverage = total_future_coverage?.toString()

      models.value.pending_budget_allocation = Math.abs(
        Number(models.value.contract_value || 0) -
          Number(models.value.total_committed_balance || 0) -
          Number(models.value.total_future_coverage || 0)
      )?.toString()
    },
    { immediate: true, deep: true }
  )

  return {
    models,
    formElementRef,
    tablePropertiesAssociatedBudget,
    tablePropertiesScheduledMilestones,
    defaultIconsLucide,
    selectedRows,
    milestones,
    modalAddFutureValiditiesConfig,
    modalAddFutureValiditiesRef,
    futureValiditiesFormRef,
    areas_resposabilities_codes,
    budget_item_codes,
    budget_resources_types,

    handleAddFutureValidity,
    handleConfirmedFutureValidity,
    handleDeleteAssociatedBudget,
    handleEditFutureValidity,
    handleDeleteAssociatedMilestone,
    handleAddMilestones,
    formatCurrencyString,
    handleSelectedRows,
  }
}

export default useFutureValiditiesForm
