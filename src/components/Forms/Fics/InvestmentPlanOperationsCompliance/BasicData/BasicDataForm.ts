// Vue
import { ref, watch } from 'vue'

// Interfaces
import { IInvestmentPlanOperationResponse } from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Composables
import { useUtils } from '@/composables'

const useBasicDataForm = (props: {
  data?: IInvestmentPlanOperationResponse
}) => {
  const { formatCurrencyString } = useUtils()

  const basicDataForm = ref()

  const basicData = ref<{
    type: null | 'retiro' | 'aporte' | 'cancelacion'
    subtype: 'transaccional' | 'bienes' | 'parcial' | 'cancelacion'
    collective_investment_fund_id: null | number
    operation_request: null | number
    request_date: null | string
    fund_code?: null | string
    fund_name?: null | string
    closing_date?: null | string
    investment_plan?: null | string
    business_trust_code?: null | string
    business_trust_name?: null | string
    plan_business_trust_code?: null | string
    plan_balance?: null | string
    holder_identification?: null | string
    holder_name?: null | string
    operation_value?: null | number
    maximum_value?: null | number
    office?: null | string
    office_code?: null | string
    fiduciary_investment_plan_id: null | number
    operation_office_id: null | number
    value: number | null
    state_id: number | null
    operation_date?: string | null
  }>({
    type: null,
    subtype: 'transaccional',
    collective_investment_fund_id: null,
    operation_request: null,
    request_date: null,
    operation_office_id: null,
    fiduciary_investment_plan_id: null,
    value: null,
    state_id: 25,
  })

  const validateInvestmentPlanOperation = () => {
    return basicDataForm.value?.validate()
  }

  const setFormData = () => {
    if (props.data) {
      const formData = props.data
      basicData.value = {
        type: formData?.type ?? null,
        subtype: formData?.subtype ?? 'transaccional',
        request_date: formData?.request_date ?? null,
        operation_request: formData?.operation_request ?? null,
        fund_code: formData?.fund_code ?? null,
        fund_name: formData?.fund_name ?? null,
        closing_date: formData?.closing_date ?? null,
        operation_date: formData?.operation_date ?? null,
        business_trust_code: formData?.business_trust_code ?? null,
        business_trust_name: formData?.business_trust_name ?? null,
        investment_plan: formData?.investment_plan ?? null,
        plan_business_trust_code: formData?.plan_business_trust_code ?? null,
        plan_balance: formData?.plan_balance ?? null,
        holder_identification: formData?.holder_identification ?? null,
        office_code: formData?.office_code ?? null,
        office: formData?.office ?? null,
        holder_name: formData?.holder_name ?? null,
        operation_value: formData?.operation_value ?? null,
        maximum_value: formData?.maximum_value ?? null,
        collective_investment_fund_id: null,
        operation_office_id: null,
        fiduciary_investment_plan_id: null,
        value: null,
        state_id: 25,
      }
    }
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        setFormData()
      }
    },
    {
      immediate: true,
    }
  )

  return {
    basicData,
    basicDataForm,
    validateInvestmentPlanOperation,
    formatCurrencyString,
  }
}

export default useBasicDataForm
