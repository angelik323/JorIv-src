// Vue - Pinia
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IInvestmentPlanOperationsBasicDataForm } from '@/interfaces/customs/fics/InvestmentPlanOperations'

// Constants
import {
  investment_plan_operation_subtype_options,
  investment_plan_operation_type_options,
} from '@/constants'

// Stores
import { useInvestmentPlanOperationStore } from '@/stores/fics/investment-plan-operations'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBasicDataForm = (emits: {
  (e: 'updateModels', models: IInvestmentPlanOperationsBasicDataForm): void
}) => {
  const {
    funts_to_investment_plans,
    fiduciary_investment_plans,
    offices_code_label: offices,
  } = storeToRefs(useFicResourceStore('v1'))

  const basicDataForm = ref()

  const basicData = ref<IInvestmentPlanOperationsBasicDataForm>({
    type: null,
    subtype: 'transaccional',
    collective_investment_fund_id: null,
    operation_office_id: null,
    fiduciary_investment_plan_id: null,
    value: null,
    state_id: 25,
  })

  const selectedFund = computed(() =>
    funts_to_investment_plans.value.find(
      (item) => item.value === basicData.value.collective_investment_fund_id
    )
  )

  const selectedOffice = computed(() =>
    offices.value.find(
      (item) => item.value === basicData.value.operation_office_id
    )
  )

  const { _getResources } = useResourceManagerStore('v1')

  const { _getOperationValues } = useInvestmentPlanOperationStore('v1')

  const { operation_values } = storeToRefs(
    useInvestmentPlanOperationStore('v1')
  )

  const selectedInvestmentPlan = ref()

  const selectInvestmentPlan = (investmentPlanId: number) => {
    basicData.value.fiduciary_investment_plan_id = investmentPlanId
    selectedInvestmentPlan.value = fiduciary_investment_plans.value.find(
      (item) => item.id === investmentPlanId
    )

    if (!selectedInvestmentPlan.value) return
    _getResources(
      { treasury: ['third_parties'] },
      `filter[id]=${selectedInvestmentPlan.value?.fip_holder_identifications.holder_id}`,
      'v2'
    )
    _getResources(
      { trust_business: ['business_trusts'] },
      `filter[id]=${selectedInvestmentPlan.value.fip_parameters.business_trust_id}`
    )
  }

  watch(
    () => [selectedFund.value, selectedInvestmentPlan.value],
    () => {
      if (selectedInvestmentPlan.value && selectedFund.value) {
        const payload = {
          collective_investment_fund_id: selectedFund.value.id,
          fiduciary_investment_plan_id: selectedInvestmentPlan.value.id,
        }
        _getOperationValues(payload)
      }
    },
    { deep: true }
  )

  const { third_parties } = storeToRefs(useTreasuryResourceStore('v1'))
  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const thirdParty = computed(() =>
    third_parties.value.find(
      (item) =>
        item.id ===
        selectedInvestmentPlan.value?.fip_holder_identifications?.holder_id
    )
  )

  const businessTrust = computed(() =>
    business_trusts.value.find(
      (item) =>
        item.id ===
        selectedInvestmentPlan.value?.fip_parameters?.business_trust_id
    )
  )

  const subtypeOptions = computed(() => {
    const typeKey = basicData.value.type === 'retiro' ? 'retiro' : 'aporte'
    return investment_plan_operation_subtype_options[typeKey]
  })

  const setCancellationValue = () => {
    if (basicData.value.subtype === 'cancelacion') {
      basicData.value.value =
        operation_values.value.available_value_without_taxes_cancellation
    }
  }

  const getFormData = () => {
    return { ...basicData.value }
  }

  watch(
    basicData.value,
    (newVal) => {
      if (
        newVal.type === 'retiro' &&
        !['parcial', 'cancelacion'].includes(newVal.subtype)
      ) {
        basicData.value.subtype = 'parcial'
      } else if (
        newVal.type === 'aporte' &&
        !['transaccional', 'bienes'].includes(newVal.subtype)
      ) {
        basicData.value.subtype = 'transaccional'
      }

      setCancellationValue()
    },
    { immediate: true }
  )

  watch(
    () => operation_values.value,
    () => {
      setCancellationValue()
    },
    { deep: true }
  )

  watch(
    () => basicData.value.collective_investment_fund_id,
    async (val) => {
      const ficStore = useFicResourceStore('v1')
      const { fiduciary_investment_plans } = storeToRefs(ficStore)

      if (val) {
        fiduciary_investment_plans.value = []

        await _getResources(
          { fics: ['fiduciary_investment_plans'] },
          `filter[collective_investment_fund_id]=${val}`
        )
      } else {
        fiduciary_investment_plans.value = []
        basicData.value.fiduciary_investment_plan_id = null
        selectedInvestmentPlan.value = null
      }
    }
  )

  watch(
    basicData,
    (values) => {
      emits('updateModels', { ...values })
    },
    { deep: true }
  )

  return {
    offices,
    basicData,
    thirdParty,
    selectedFund,
    businessTrust,
    basicDataForm,
    selectedOffice,
    subtypeOptions,
    operation_values,
    selectedInvestmentPlan,
    funts_to_investment_plans,
    fiduciary_investment_plans,
    investment_plan_operation_type_options,

    // Methods
    getFormData,
    selectInvestmentPlan,
  }
}

export default useBasicDataForm
