// vue - pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType } from '@/interfaces/global'
import {
  IFinancialObligationFormV2,
  IPaymentPlanCalculateQuota,
} from '@/interfaces/customs/financial-obligations/v2/FinancialObligation'

// stores
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useFinantialObligationResourceStore } from '@/stores/resources-manager/finantial-obligations'
import { useFinancialObligationStore } from '@/stores/financial-obligations/financial-obligation'

// composables
import { useUtils } from '@/composables/useUtils'

const useBasicDataForm = (
  props: {
    action: ActionType
    data?: IFinancialObligationFormV2 | null
  },
  emit: Function
) => {
  // composables
  const { isEmptyOrZero } = useUtils()

  // stores
  const {
    credit_types,
    periodicities,
    factors,
    calculation_methods,
    base_calculations,
    quota_types,
    amortization_types,
  } = storeToRefs(useFinantialObligationResourceStore('v2'))
  const { banks_initial_balance, third_party_nit } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))
  const { _calculatePaymentPlan } = useFinancialObligationStore('v2')

  // state
  const isLoading = ref(true)
  const paymentPlanItems = ref<IPaymentPlanCalculateQuota[]>([])

  // refs
  const basic_data_form_ref = ref()
  const paymentPlanPreviewModalRef = ref()

  // models
  const models = ref<IFinancialObligationFormV2>({
    business_trust_id: null,
    business_trust_code: null,
    business_trust_name: null,
    obligation_number: null,
    titular_id: null,
    titular_name: null,
    titular_nit: null,
    bank_id: null,
    bank_name: null,
    credit_type_id: null,
    amount: null,
    interest_rate: null,
    factor_id: null,
    periodicity_id: null,
    quotas: null,
    payment_day: null,
    alert_days: null,
    calculation_method_id: null,
    calculation_base_id: null,
    quota_type_id: null,
    amortization_type_id: null,
    start_date: null,
    end_date: null,
    initial_balance: null,
    capital_quota: null,
  })

  // computed - view state
  const isView = computed(() => props.action === 'view')

  // computed - form validation
  const isFormValid = computed(() => {
    return Boolean(
      models.value.business_trust_id &&
        models.value.obligation_number &&
        models.value.titular_id &&
        models.value.bank_id &&
        models.value.credit_type_id &&
        models.value.amount &&
        models.value.amount > 0 &&
        models.value.interest_rate &&
        models.value.periodicity_id &&
        models.value.quotas &&
        models.value.payment_day &&
        models.value.alert_days &&
        models.value.start_date
    )
  })

  // computed - derived values
  const numberOfQuotas = computed(() => models.value.quotas ?? null)

  const titularIdentification = computed(() => {
    const { titular_nit } = models.value
    if (titular_nit) {
      return `NIT - ${titular_nit}`
    }
    return ''
  })

  // computed - payment plan calculation readiness
  const canCalculatePaymentPlan = computed(() => {
    return Boolean(
      models.value.amount &&
        models.value.amount > 0 &&
        models.value.interest_rate !== null &&
        models.value.quotas &&
        models.value.factor_id &&
        models.value.periodicity_id &&
        models.value.calculation_method_id &&
        models.value.calculation_base_id &&
        models.value.quota_type_id &&
        models.value.amortization_type_id &&
        models.value.start_date
    )
  })

  // handlers - select changes
  const handleBusinessTrustChange = (selected: {
    value: number
    code?: string
    name?: string
    label?: string
  }) => {
    if (!selected) return

    models.value.business_trust_id = selected.value
    models.value.business_trust_code = selected.code ?? ''
    models.value.business_trust_name = selected.name ?? selected.label ?? ''
  }

  const handleTitularChange = async (selected: {
    value: number
    business_name: string
    third_party?: { document_type?: { name: string }; document?: string }
  }) => {
    if (!selected) return

    models.value.titular_id = selected.value
    models.value.titular_name = selected.business_name
    models.value.titular_nit = selected.third_party?.document ?? ''

    // TODO: Habilitar cuando backend implemente el endpoint de validación SARLAFT
    // const sarlaftResult = await _validateSarlaft(selected.value)
    // if (!sarlaftResult.is_valid) {
    //   showAlert(
    //     sarlaftResult.message ?? 'El titular no pasó la validación SARLAFT',
    //     'warning',
    //     undefined,
    //     5000
    //   )
    // }
  }

  const handleBankChange = (selected: { value: number; label?: string }) => {
    if (!selected) return

    models.value.bank_id = selected.value
    models.value.bank_name = selected.label ?? ''
  }

  // handlers - payment plan
  const generatePaymentPlan = async () => {
    if (!isFormValid.value) return

    const calculationMethodOption = calculation_methods.value.find(
      (item) => item.value === models.value.calculation_method_id
    )
    const calculationBaseOption = base_calculations.value.find(
      (item) => item.value === models.value.calculation_base_id
    )
    const quotaTypeOption = quota_types.value.find(
      (item) => item.value === models.value.quota_type_id
    )
    const amortizationTypeOption = amortization_types.value.find(
      (item) => item.value === models.value.amortization_type_id
    )

    const response = await _calculatePaymentPlan({
      amount: models.value.amount ?? 0,
      interest_rate: models.value.interest_rate ?? 0,
      quotas: models.value.quotas ?? 0,
      factor_id: models.value.factor_id ?? 0,
      periodicity_id: models.value.periodicity_id ?? 0,
      calculation_method: calculationMethodOption?.label ?? '',
      calculation_base: Number(calculationBaseOption?.label) || 360,
      quota_type: quotaTypeOption?.label ?? '',
      amortization_type: amortizationTypeOption?.label ?? '',
      start_date: models.value.start_date ?? '',
    })

    if (response.success) {
      paymentPlanItems.value = response.quotas
      const lastQuota = response.quotas[response.quotas.length - 1]
      models.value.end_date = lastQuota?.payment_date ?? null
      models.value.capital_quota = response.basic_data?.amount ?? null
    }
  }

  const openPreviewModal = async () => {
    await generatePaymentPlan()
    paymentPlanPreviewModalRef.value?.openModal()
  }

  // private methods
  const _setValueModel = () => {
    if (props.data) {
      models.value = { ...props.data }
    }
  }

  // lifecycle
  onMounted(async () => {
    isLoading.value = true
    await _setValueModel()
    isLoading.value = false
  })

  // watchers
  watch(
    () => models.value.amount,
    (newVal) => {
      models.value.initial_balance = newVal
    }
  )

  watch(
    () => models.value,
    () => {
      emit('update:models', isEmptyOrZero(models.value) ? null : models.value)
    },
    { deep: true }
  )

  // watcher - auto calculate payment plan
  watch(
    () => [
      models.value.amount,
      models.value.interest_rate,
      models.value.quotas,
      models.value.factor_id,
      models.value.periodicity_id,
      models.value.calculation_method_id,
      models.value.calculation_base_id,
      models.value.quota_type_id,
      models.value.amortization_type_id,
      models.value.start_date,
    ],
    async () => {
      if (canCalculatePaymentPlan.value) {
        await generatePaymentPlan()
      }
    }
  )

  return {
    // state
    models,
    isLoading,
    paymentPlanItems,

    // refs
    basic_data_form_ref,
    paymentPlanPreviewModalRef,

    // computed
    isView,
    isFormValid,
    numberOfQuotas,
    titularIdentification,

    // options
    business_trusts,
    third_party_nit,
    banks_initial_balance,
    credit_types,
    periodicities,
    factors,
    calculation_methods,
    base_calculations,
    quota_types,
    amortization_types,

    // handlers
    handleBusinessTrustChange,
    handleTitularChange,
    handleBankChange,
    openPreviewModal,
  }
}

export default useBasicDataForm
