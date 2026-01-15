// Vue - pinia
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import {
  IPaymentPlanBasicDataForm,
  IPaymentPlanResponse,
} from '@/interfaces/customs/trust-business/PaymentPlan'

// Utils
import { defaultIconsLucide } from '@/utils'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { usePaymentPlanStore } from '@/stores/trust-business/payment-plan'
import { useResourceManagerStore } from '@/stores/resources-manager'

const usePaymentPlanView = () => {
  const { _getByIdPaymentPlan, _clearData } = usePaymentPlanStore('v1')
  const { headerPropsDefault, data_payment_plan_response } = storeToRefs(
    usePaymentPlanStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { toNumberOrNull } = useUtils()
  const router = useRouter()

  const keys = {
    finantial_obligations: ['financial_obligations'],
  }

  const paymentPlanId = Number(router.currentRoute.value.params.id)

  // Data de formularios
  const basic_data_form = ref<IPaymentPlanBasicDataForm | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const headerProperties = {
    title: 'Ver plan de pagos',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'PaymentPlanView',
      },
      {
        label: paymentPlanId.toString(),
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const setFormView = (data: IPaymentPlanResponse) => {
    basic_data_form.value = {
      id: data.id,
      project: data.project?.name ?? null,
      project_stage: data.project_stage?.stage_number ?? null,
      business_trust: data.business_trust?.name ?? null,
      property: data.property?.nomenclature ?? null,
      buyers:
        Array.isArray(data.buyers) && data.buyers.length > 0
          ? data.buyers.map((b) => b.buyer.name).join(', ')
          : null,
      trust_mandate: data.fiduciary_mandate?.mandate_code || null,
      unit_value: toNumberOrNull(data.unit_value),
      value_finish: toNumberOrNull(data.value_finish),
      initial_fee_value: toNumberOrNull(data.initial_fee_value),
      subsidy_fee_value: toNumberOrNull(data.subsidy_fee_value),
      value_other_concepts: toNumberOrNull(data.value_other_concepts),
      fixed_value_initial_fee: toNumberOrNull(data.fixed_value_initial_fee),
      separation_value: toNumberOrNull(data.separation_value),
      financial_obligations: Number(data.financial_obligations) || null,
      financial_obligations_name:
        data.financial_obligation.obligation_number || null,
      credit_value: toNumberOrNull(data.financial_obligation.amount),
      term: Number(data.financial_obligation.quotas) || null,
      periodicity: data.financial_obligation.periodicity_type || null,
      effective_annual_rate: data.financial_obligation.interest_rate || null,
      payments_plan:
        data.payment_plan?.map((p) => ({
          id: p.id || null,
          installment_number: p.installment_number || null,
          initial_balance: toNumberOrNull(p.initial_balance),
          total_value: toNumberOrNull(p.total_value),
          late_interest: toNumberOrNull(p.late_interest),
          final_balance: toNumberOrNull(p.final_balance),
          capital_fee: toNumberOrNull(p.capital_fee),
          payment_date: p.payment_date || null,
          status: p.status.id || null,
        })) ?? null,
    }
  }

  const handlerGoTo = (goURL: string, id?: number) => {
    router.push({ name: goURL, params: { id } })
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await Promise.all([_getResources(keys), _getByIdPaymentPlan(paymentPlanId)])
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    () => data_payment_plan_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    data_payment_plan_response,
    basic_data_form,
    basicDataFormRef,
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    handlerGoTo,
  }
}

export default usePaymentPlanView
