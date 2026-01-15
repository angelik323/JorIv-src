// Vue
import { ref, watch } from 'vue'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IGenericInvestmentPlansLegalizeResponse,
  IGenericInvestmentPlansLegalizeFiduciaryInvestmentPlan,
  IGenericInvestmentPlansLegalizeCollectiveInvestmentFund,
} from '@/interfaces/customs/fics/GenericInvestmentPlans'

// Composables
import { useUtils } from '@/composables'

const useInformationLegalization = (props: {
  action: ActionType
  data?: IGenericInvestmentPlansLegalizeResponse | null
}) => {
  const { formatCurrencyString } = useUtils()

  const formData = ref<IGenericInvestmentPlansLegalizeResponse>({
    id: 0,
    registration_date: '',
    treasurie_pay_form: 0,
    collective_investment_fund:
      {} as IGenericInvestmentPlansLegalizeCollectiveInvestmentFund,
    fiduciary_investment_plan:
      {} as IGenericInvestmentPlansLegalizeFiduciaryInvestmentPlan,
  })

  watch(
    () => props.data,
    (newVal) => {
      if (newVal) {
        formData.value = { ...formData.value, ...newVal }
      }
    },
    { deep: true, immediate: true }
  )

  return {
    formData,
    formatCurrencyString,
  }
}

export default useInformationLegalization
