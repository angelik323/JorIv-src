import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePeriodClosureStore, useAccountingResourceStore } from '@/stores'
import { useRules } from '@/composables/useRules'
import { IBusinessTrustPerClosurePeriodResource } from '@/interfaces/customs'
import { storeToRefs } from 'pinia'

const usePeriodClosureForm = () => {
  const periodClosureStore = usePeriodClosureStore('v1')

  const {
    account_structures_with_purpose,
    business_trusts_per_clousure_period,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { is_required } = useRules()

  const accountingStructureRule = (val: unknown) =>
    is_required(val as string, 'La estructura es requerida')

  const fromBusinessRule = (val: unknown) =>
    is_required(val as string, 'El negocio es requerido')

  const toBusinessRule = (val: unknown) =>
    is_required(val as string, 'El negocio es requerido')

  const router = useRouter()
  const formRef = ref()

  const formModel = reactive({
    execution_period: '',
    accounting_structure_id: null as number | null,
    from_business_id: null as number | null,
    current_period_from: '',
    to_business_id: null as number | null,
    current_period_to: '',
  })

  const hasRequiredFilters = computed(() =>
    Boolean(formModel.accounting_structure_id && formModel.execution_period)
  )

  const filteredBusinesses = computed(() =>
    hasRequiredFilters.value ? business_trusts_per_clousure_period.value : []
  )

  const findBusinessById = (id: number) => {
    if (!Array.isArray(business_trusts_per_clousure_period.value))
      return undefined
    return business_trusts_per_clousure_period.value.find(
      (b: IBusinessTrustPerClosurePeriodResource) => b.id === id
    )
  }

  const onChangeStructure = (id: number) => {
    formModel.accounting_structure_id = id
    formModel.from_business_id = null
    formModel.to_business_id = null
    formModel.current_period_from = ''
    formModel.current_period_to = ''
  }

  const onChangeFromBusiness = (id: number) => {
    formModel.from_business_id = id
    const business = findBusinessById(id)
    formModel.current_period_from = business?.current_period ?? ''
  }

  const onChangeToBusiness = (id: number) => {
    formModel.to_business_id = id
    const business = findBusinessById(id)
    formModel.current_period_to = business?.current_period ?? ''
  }

  const progress = ref(0)
  const isProcessing = ref(false)
  const closureStatus = ref('')

  const buildClosurePayload = () => ({
    executed_at: formModel.execution_period,
    execution_period: formModel.execution_period,
    accounting_structure_id: formModel.accounting_structure_id!,
    from_date: formModel.current_period_from,
    to_date: formModel.current_period_to,
    from_business_trust_id: formModel.from_business_id!,
    to_business_trust_id: formModel.to_business_id!,
    from_business_id: formModel.from_business_id!,
    to_business_id: formModel.to_business_id!,
  })

  const handleSubmit = async () => {
    isProcessing.value = true
    closureStatus.value = ''

    const result = (await periodClosureStore._createPeriodClosure(
      buildClosurePayload()
    )) as {
      success: boolean
      message: string
      url?: string
    }

    isProcessing.value = false

    if (result.success) {
      closureStatus.value = 'Proceso exitoso'
      return {
        status: 'success',
        message: result.message,
      }
    } else if (result.url) {
      closureStatus.value = 'Procesos pendientes'
      return {
        status: 'pending_processes',
        url: result.url,
        message: result.message,
      }
    } else {
      closureStatus.value = 'Error'
      return {
        status: 'error',
        message: result.message || 'Error desconocido al cerrar el periodo',
      }
    }
  }

  const validateForm = () => {
    return formRef.value?.validate?.()
  }

  const onChangeExecutionPeriod = (val: string) => {
    formModel.execution_period = val
    formModel.from_business_id = null
    formModel.to_business_id = null
    formModel.current_period_from = ''
    formModel.current_period_to = ''
  }

  const onSubmit = async () => {
    const valid = await formRef.value?.validate?.()
    if (valid) {
      const result = await handleSubmit()

      if (result?.status === 'success') {
        router.push({ name: 'PeriodClosureList' })
      }
    }
  }

  return {
    formModel,
    formRef,
    account_structures_with_purpose,
    filteredBusinesses,
    closureStatus,
    progress,
    isProcessing,
    accountingStructureRule,
    fromBusinessRule,
    toBusinessRule,
    onSubmit,
    onChangeExecutionPeriod,
    validateForm,
    onChangeStructure,
    onChangeFromBusiness,
    onChangeToBusiness,
    handleSubmit,
  }
}

export default usePeriodClosureForm
