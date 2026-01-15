import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import {
  ActionType,
  WriteActionType,
  PaymentPlanStatusID,
} from '@/interfaces/global'
import {
  IPaymentPlanBasicDataForm,
  IPaymentInstallment,
  IPaymentInstallmentToCreate,
  IPaymentInstallmentToEdit,
} from '@/interfaces/customs'
import { QTable } from 'quasar'
import { useMainLoader, useUtils, useAlert } from '@/composables'
import { TIMEOUTS } from '@/constants/alerts'
import {
  usePaymentPlanStore,
  useResourceManagerStore,
  useTrustBusinessResourceStore,
  useFinantialObligationResourceStore,
} from '@/stores'

const useBasicDataPaymentPlanForm = (
  props: {
    action: ActionType
    data: IPaymentPlanBasicDataForm | null
  },
  emit: Function
) => {
  const {
    _createPaymentInstallment,
    _updatePaymentInstallment,
    _deletePaymentInstallment,
    _exportPaymentPlan,
  } = usePaymentPlanStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    business_trusts,
    business_trust_real_estate_project,
    project_stage,
    business_trust_properties,
    payment_plan_statuses,
    business_trust_property_sale,
    fiduciary_mandates,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { financial_obligations } = storeToRefs(
    useFinantialObligationResourceStore('v1')
  )

  const { openMainLoader } = useMainLoader()
  const { formatCurrencyString, getMaxId, isEmptyOrZero } = useUtils()
  const { showAlert } = useAlert()

  const formElementRef = ref()
  const paymentPlanFormRef = ref()
  const paymentPlansSectionRef = ref()
  const addPlanButtonRef = ref()
  const paymentPlanModalRef = ref()
  const deleteModalRef = ref()

  const initialModelsValues: IPaymentPlanBasicDataForm = {
    project: null,
    project_stage: null,
    business_trust: null,
    property: null,
    buyers: null,
    trust_mandate: null,
    unit_value: null,
    value_finish: null,
    initial_fee_value: null,
    subsidy_fee_value: null,
    value_other_concepts: null,
    fixed_value_initial_fee: null,
    separation_value: null,
    financial_obligations: null,
    credit_value: null,
    term: null,
    periodicity: null,
    effective_annual_rate: null,
    payments_plan: [],
  }

  const initialPaymentModelsValues: IPaymentInstallment = {
    installment_number: null,
    initial_balance: null,
    total_value: null,
    late_interest: null,
    final_balance: null,
    capital_fee: null,
    payment_date: null,
    status: PaymentPlanStatusID.PENDING, // Por defecto
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })
  const paymentModels = ref<typeof initialPaymentModelsValues>({
    ...initialPaymentModelsValues,
  })

  const isPaymentPlansTableEnabled = ref(false)
  const isPaymentPlanModalOpen = ref(false)

  const tablePaymentPlanProperties = ref({
    title: 'Plan de pagos',
    loading: false,
    columns: [
      {
        name: 'installment_number',
        required: true,
        label: 'No. Cuota',
        align: 'left',
        field: (row: IPaymentInstallment) => `${row.installment_number ?? '-'}`,
        sortable: true,
      },
      {
        name: 'initial_balance',
        required: true,
        label: 'Saldo inicial cuota',
        align: 'left',
        field: (row: IPaymentInstallment) =>
          `${formatCurrencyString(row.initial_balance) ?? '-'}`,
        sortable: true,
      },

      {
        name: 'total_value',
        required: true,
        label: 'Valor total de la cuota',
        align: 'left',
        field: (row: IPaymentInstallment) =>
          `${formatCurrencyString(row.total_value) ?? '-'}`,
        sortable: true,
      },
      {
        name: 'late_interest',
        required: true,
        label: 'Interés por mora',
        align: 'left',
        field: (row: IPaymentInstallment) =>
          `${formatCurrencyString(row.late_interest) ?? '-'}`,
        sortable: true,
      },
      {
        name: 'capital_fee',
        required: true,
        label: 'Cuota capital',
        align: 'left',
        field: (row: IPaymentInstallment) =>
          `${formatCurrencyString(row.capital_fee) ?? '-'}`,
        sortable: true,
      },
      {
        name: 'final_balance',
        required: true,
        label: 'Saldo final',
        align: 'left',
        field: (row: IPaymentInstallment) =>
          `${formatCurrencyString(row.final_balance) ?? '-'}`,
        sortable: true,
      },
      {
        name: 'payment_date',
        required: true,
        label: 'Fecha de pago',
        align: 'left',
        field: (row: IPaymentInstallment) => `${row.payment_date ?? '-'}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: (row: IPaymentInstallment) => `${row.installment_number ?? '-'}`,
        sortable: true,
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              required: true,
              label: 'Acciones',
              align: 'center',
              field: 'actions',
            },
          ]
        : []),
    ] as QTable['columns'],
    rows: computed(() => models.value.payments_plan ?? []),
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    wrapCells: true,
  })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }
  }

  // Recursos dependientes
  const availableProjects = computed(() => {
    if (!models.value.business_trust) return []
    return (business_trust_real_estate_project.value ?? []).filter(
      (project) =>
        project.business_trust?.id === Number(models.value.business_trust)
    )
  })

  const availableStages = computed(() => {
    if (!models.value.project) return []
    return (project_stage.value ?? []).filter(
      (stage) =>
        stage.business_trust_real_estate_project_id ===
        Number(models.value.project)
    )
  })

  const availableProperties = computed(() => {
    if (!models.value.project_stage) return []
    return (business_trust_properties.value ?? []).filter(
      (prop) =>
        prop.business_trust_real_estate_project_stage_id ===
        Number(models.value.project_stage)
    )
  })

  const paymentPlanModalConfig = ref({
    externalBtnDisabled: false,
    title: '',
    btnText: '',
    action: null as WriteActionType | null,
  })

  const validatePaymentPlanForm = async () => {
    if (!(await formElementRef.value?.validate())) return
    isPaymentPlansTableEnabled.value = true
    paymentPlanModalConfig.value.externalBtnDisabled = true

    nextTick(() => {
      paymentPlansSectionRef.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }

  const openGenerator = (row?: IPaymentInstallment) => {
    if (row) paymentModels.value = { ...row }
    isPaymentPlanModalOpen.value = true
  }

  const handlePaymentPlanTableOptions = async (
    action: WriteActionType,
    row?: IPaymentInstallment
  ) => {
    const isCreate = action === 'create'

    paymentPlanModalConfig.value.title = `${
      isCreate ? 'Agregar' : 'Actualizar'
    } plan de pagos`
    paymentPlanModalConfig.value.btnText = isCreate ? 'Agregar' : 'Actualizar'
    paymentPlanModalConfig.value.action = action

    // Resetea el modelo
    paymentModels.value = { ...initialPaymentModelsValues }

    if (isCreate) {
      if (!Array.isArray(models.value.payments_plan)) return
      const lastInstallment =
        models.value.payments_plan[models.value.payments_plan.length - 1]

      paymentModels.value = {
        ...initialPaymentModelsValues,
        installment_number: lastInstallment?.installment_number
          ? lastInstallment.installment_number + 1
          : 1,
        initial_balance: lastInstallment
          ? lastInstallment.final_balance
          : Number(models.value.credit_value) || 0, // Valor inicial del crédito de obligación seleccionada
      }

      openGenerator()
    } else if (row) {
      openGenerator(row)
    }
  }

  const createInstallmentLocal = (paymentInstallment: IPaymentInstallment) => {
    if (!Array.isArray(models.value.payments_plan)) return

    const newItem = {
      ...paymentInstallment,
      id: getMaxId(models.value.payments_plan) + 1,
    }
    models.value.payments_plan = [...models.value.payments_plan, newItem]
  }

  const updateInstallmentLocal = (paymentInstallment: IPaymentInstallment) => {
    if (!Array.isArray(models.value.payments_plan)) return

    const index = models.value.payments_plan.findIndex(
      ({ id }) => id === paymentInstallment.id
    )
    if (index === -1) return

    models.value.payments_plan[index] = {
      ...models.value.payments_plan[index],
      ...paymentInstallment,
    }
  }

  const onSavePaymentPlan = async () => {
    if (!(await paymentPlanFormRef.value?.validate())) return

    const paymentInstallment = paymentModels.value

    if (paymentInstallment.id) {
      if (props.action === 'create') {
        updateInstallmentLocal(paymentInstallment)
        showAlert(
          'Registro actualizado exitosamente',
          'success',
          undefined,
          TIMEOUTS.SEC_5
        )
      }

      if (props.action === 'edit') {
        const payload: IPaymentInstallmentToEdit = {
          installment_number: paymentInstallment.installment_number,
          initial_balance: paymentInstallment.initial_balance,
          total_value: paymentInstallment.total_value,
          late_interest: paymentInstallment.late_interest,
          final_balance: paymentInstallment.final_balance,
          capital_fee: paymentInstallment.capital_fee,
          payment_date: paymentInstallment.payment_date,
          status_id: Number(paymentInstallment.status),
        }

        openMainLoader(true)
        const success = await _updatePaymentInstallment(
          paymentInstallment.id,
          payload
        )
        if (success) updateInstallmentLocal(paymentInstallment)
        openMainLoader(false)
      }
    } else {
      if (props.action === 'create') {
        createInstallmentLocal(paymentInstallment)
        showAlert(
          'Registro creado exitosamente',
          'success',
          undefined,
          TIMEOUTS.SEC_5
        )
      }

      if (props.action === 'edit') {
        if (!models.value.id) return

        const payload: IPaymentInstallmentToCreate = {
          payments_plan: [
            {
              installment_number: paymentInstallment.installment_number,
              initial_balance: paymentInstallment.initial_balance,
              total_value: paymentInstallment.total_value,
              late_interest: paymentInstallment.late_interest,
              final_balance: paymentInstallment.final_balance,
              capital_fee: paymentInstallment.capital_fee,
              payment_date: paymentInstallment.payment_date,
            },
          ],
        }

        openMainLoader(true)
        const success = await _createPaymentInstallment(
          models.value.id,
          payload
        )
        if (success) createInstallmentLocal(paymentInstallment)
        openMainLoader(false)
      }
    }

    isPaymentPlanModalOpen.value = false
  }

  const downloadExcel = async () => {
    if (!models.value.id) return

    openMainLoader(true)
    await _exportPaymentPlan(
      models.value.id,
      `Listado_de_plan_de_pagos_${
        models.value.financial_obligations_name ||
        models.value.financial_obligations
      }`
    )
    openMainLoader(false)
  }

  const alertModalConfig = ref({
    description: '¿Desea eliminar la cuota del plan de pagos?',
    entityId: null as number | null,
  })

  const openModalDelete = async (row: IPaymentInstallment) => {
    alertModalConfig.value.entityId = row.id || null
    deleteModalRef.value.openModal()
  }

  const handleDeletePaymentInstallment = async () => {
    const entityId = alertModalConfig.value.entityId

    if (
      !Array.isArray(models.value.payments_plan) ||
      !models.value.payments_plan.length ||
      !entityId
    ) {
      return
    }

    deleteModalRef.value.closeModal()

    const removeInstallmentLocal = () => {
      models.value.payments_plan = (models.value.payments_plan ?? []).filter(
        (item) => item.id !== entityId
      )
    }

    if (props.action === 'edit') {
      openMainLoader(true)
      const success = await _deletePaymentInstallment(entityId)
      if (success) removeInstallmentLocal()
      openMainLoader(false)
    } else {
      removeInstallmentLocal()
      showAlert(
        'Registro eliminado exitosamente',
        'success',
        undefined,
        TIMEOUTS.SEC_5
      )
    }
  }

  // Sincroniza el modelo con la prop 'data'
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
    () => models.value.business_trust,
    () => {
      models.value.project = null
      models.value.project_stage = null
      models.value.property = null
    }
  )

  watch(
    () => models.value.project,
    () => {
      models.value.project_stage = null
      models.value.property = null
    }
  )

  watch(
    () => models.value.project_stage,
    () => {
      models.value.property = null
    }
  )

  watch(
    () => models.value.financial_obligations,
    () => {
      isPaymentPlansTableEnabled.value = false
      paymentPlanModalConfig.value.externalBtnDisabled = false

      // Si cambia la obligacion se limpian las cuotas del plan de pago
      models.value.payments_plan = []
    }
  )

  // Campos derivados de la propiedad seleccionada
  watch(
    () => models.value.property,
    async (newProperty) => {
      models.value.buyers = null
      models.value.trust_mandate = null

      if (!newProperty) return

      try {
        openMainLoader(true)

        await _getResources(
          { trust_business: ['business_trust_property_sale'] },
          `filter[real_estate_project_nomenclature_id]=${newProperty}`
        )

        if (
          !Array.isArray(business_trust_property_sale.value) ||
          business_trust_property_sale.value.length === 0
        ) {
          models.value.buyers = 'Sin venta asociada'
          models.value.trust_mandate = 'Sin venta asociada'
          return
        }

        // Compradores
        const buyers = business_trust_property_sale.value.flatMap(
          (sale) => sale.buyers ?? []
        )

        if (!Array.isArray(buyers) || buyers.length === 0) {
          models.value.buyers = null
          return
        }

        models.value.buyers = buyers
          .map(({ third_party }) => {
            if (third_party?.legal_person)
              return third_party.legal_person.business_name

            if (third_party?.natural_person)
              return third_party?.natural_person?.full_name

            if (third_party?.document) return third_party?.document

            return 'Nombre no encontrado'
          })
          .join(', ')

        // Encargo fiduciario
        const mandateId =
          business_trust_property_sale.value[0]?.fiduciary_mandate_id ?? null

        if (!mandateId) {
          models.value.trust_mandate = 'Sin encargo fiduciario asociado'
          return
        }

        await _getResources(
          { trust_business: ['fiduciary_mandates'] },
          `filter[id]=${mandateId}`
        )

        if (
          !Array.isArray(fiduciary_mandates.value) ||
          fiduciary_mandates.value.length === 0
        ) {
          models.value.trust_mandate = 'Sin encargo fiduciario asociado'
          return
        }

        models.value.trust_mandate =
          fiduciary_mandates.value[0]?.mandate_code ?? 'Nombre no encontrado'
      } finally {
        openMainLoader(false)
      }
    },
    { immediate: false }
  )

  // Campos derivados de la obligación financiera seleccionada
  watch(
    () => models.value.financial_obligations,
    (newObligation) => {
      if (props.action !== 'create') return

      const obligation = financial_obligations.value.find(
        ({ id }) => id === newObligation
      )

      models.value.effective_annual_rate = obligation?.interest_rate ?? null
      models.value.periodicity = obligation?.periodicity_type ?? null
      models.value.term = obligation?.quotas ?? null
      models.value.credit_value = obligation ? Number(obligation.amount) : null
    },
    { immediate: false }
  )

  // Campos derivados de la cuota
  watch(
    () => ({
      capital_fee: paymentModels.value.capital_fee,
      late_interest: paymentModels.value.late_interest,
      initial_balance: paymentModels.value.initial_balance,
    }),
    ({ capital_fee, late_interest, initial_balance }) => {
      const capital = Number(capital_fee) || 0
      const mora = Number(late_interest) || 0
      const saldoInicial = Number(initial_balance) || 0

      // Valor total de la cuota & Saldo final
      paymentModels.value.total_value = mora + capital
      paymentModels.value.final_balance = saldoInicial - capital
    },
    { deep: true }
  )

  watch(
    () => [
      models.value.value_other_concepts,
      models.value.subsidy_fee_value,
      models.value.separation_value,
      models.value.value_finish,
    ],
    () => {
      if (!['edit'].includes(props.action)) return
      models.value.value_other_concepts =
        Number(models.value.value_other_concepts) || 0
      models.value.subsidy_fee_value =
        Number(models.value.subsidy_fee_value) || 0
      models.value.separation_value = Number(models.value.separation_value) || 0
      models.value.value_finish = Number(models.value.value_finish) || 0
    },
    { deep: true }
  )

  watch(
    () => models.value.project_stage,
    async (val) => {
      if (!val) return
      await _getResources(
        { trust_business: ['business_trust_properties'] },
        `filter[business_trust_real_estate_project_stage_id]=${val}&filter[payment_plan]=false&filter[status_id]=95&filter[property_sale]=true`
      )
    },
    { deep: true }
  )

  onBeforeUnmount(() => {
    const keys = {
      trust_business: ['business_trust_property_sale', 'fiduciary_mandates'],
    }
    _resetKeys(keys)
  })

  return {
    business_trusts,
    payment_plan_statuses,
    financial_obligations,
    availableProjects,
    availableStages,
    availableProperties,
    formElementRef,
    paymentPlanFormRef,
    paymentPlansSectionRef,
    addPlanButtonRef,
    models,
    paymentModels,
    isPaymentPlansTableEnabled,
    isPaymentPlanModalOpen,
    tablePaymentPlanProperties,
    paymentPlanModalRef,
    paymentPlanModalConfig,
    deleteModalRef,
    alertModalConfig,
    formatCurrencyString,
    downloadExcel,
    validatePaymentPlanForm,
    handlePaymentPlanTableOptions,
    onSavePaymentPlan,
    openModalDelete,
    handleDeletePaymentInstallment,
  }
}

export default useBasicDataPaymentPlanForm
