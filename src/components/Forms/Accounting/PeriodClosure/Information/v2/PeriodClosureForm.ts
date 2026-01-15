// Vue core
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

// Pinia
import { storeToRefs } from 'pinia'

// Interfaces / Types
import { IBusinessTrustPerClosurePeriodResource } from '@/interfaces/customs/resources/Accounting'

// Composables
import { useRules } from '@/composables/useRules'

// Stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { usePeriodClosureStore } from '@/stores/accounting/period-closure'

const usePeriodClosureForm = () => {
  const periodClosureStore = usePeriodClosureStore('v2')

  const {
    business_trusts_per_clousure_period,
    account_structures_accounting_accounts,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { is_required } = useRules()

  const accountingStructureRule = (val: string) =>
    is_required(val, 'La estructura es requerida')

  const fromBusinessRule = (val: string) =>
    is_required(val, 'El periodo es requerido')

  const toBusinessRule = (val: string) =>
    is_required(val, 'El negocio es requerido')

  const router = useRouter()
  const formRef = ref()

  const formModel = reactive({
    accounting_structure_id: null as number | null,
    period: '',
    from_business_trust: null as number | null,
    to_business_trust: null as number | null,
    to_business_code: undefined as string | undefined,
    from_business_code: undefined as string | undefined,
  })

  const hasRequiredFilters = computed(() =>
    Boolean(formModel.accounting_structure_id && formModel.period)
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
    formModel.from_business_trust = null
    formModel.to_business_trust = null
  }

  const onChangeFromBusiness = (id: number) => {
    formModel.from_business_trust = id
    const business = findBusinessById(id)
    formModel.from_business_code = business ? business.code : ''
  }

  const onChangeToBusiness = (id: number) => {
    formModel.to_business_trust = id
    const business = findBusinessById(id)
    formModel.to_business_code = business ? business.code : ''
  }

  const progress = ref(0)
  const isProcessing = ref(false)
  const closureStatus = ref('')
  const pendingProcesses = ref<[]>([])
  const closureData = ref<unknown | null>(null)

  const buildClosurePayload = () => ({
    period: formModel.period,
    accounting_structure_id: formModel.accounting_structure_id!,
    from_business_trust: formModel.from_business_code,
    to_business_trust: formModel.to_business_code,
  })

  const handleSubmit = async () => {
    isProcessing.value = true
    closureStatus.value = ''
    pendingProcesses.value = []

    const payload = buildClosurePayload()

    const result = (await periodClosureStore._createPeriodClosure(payload)) as {
      success: boolean
      message: string
      data?: {
        data?: {
          message: string
          status: string
          pending?: []
        }
      }
    }

    isProcessing.value = false

    const innerData = result.data?.data

    if (!result.success || !innerData) {
      closureStatus.value = 'Error'
      return {
        status: 'error' as const,
        message: result.message || 'Error desconocido al cerrar el periodo',
        pending: [],
      }
    }

    closureData.value = {
      ...payload,
      ...innerData,
    }

    const { status, pending = [], message } = innerData

    if (status === 'con_novedades' && pending.length) {
      closureStatus.value = 'Procesos pendientes'
      pendingProcesses.value = pending

      return {
        status: 'pending_processes' as const,
        message,
        pending,
      }
    }

    closureStatus.value = 'Proceso exitoso'
    pendingProcesses.value = []

    return {
      status: 'success' as const,
      message,
      pending: [],
    }
  }

  const validateForm = () => {
    return formRef.value?.validate?.()
  }

  const onChangeExecutionPeriod = (val: string) => {
    formModel.period = val
    formModel.from_business_trust = null
    formModel.to_business_trust = null
  }

  const onSubmit = async () => {
    const valid = await formRef.value?.validate?.()
    if (!valid) return

    const result = await handleSubmit()

    if (result?.status === 'success') {
      router.push({ name: 'PeriodClosureList' })
    }
  }

  return {
    formModel,
    formRef,

    account_structures_accounting_accounts,
    filteredBusinesses,
    closureStatus,
    pendingProcesses,
    progress,
    isProcessing,
    closureData,
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
