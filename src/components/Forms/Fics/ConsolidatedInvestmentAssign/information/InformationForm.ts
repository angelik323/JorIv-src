// Vue - Pinia
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

// Stores
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useInformationForm = () => {
  const addCommissionModalRef = ref()
  const informationFormRef = ref()
  const initialBalanceRef = ref()
  const ratePercentageRef = ref()
  const finalBalanceRef = ref()

  const customColumns = ['actions']

  const { funds } = storeToRefs(useFicResourceStore('v1'))

  const formData = ref({
    collective_investment_fund_id: '',
  })

  return {
    formData,
    customColumns,
    finalBalanceRef,
    initialBalanceRef,
    ratePercentageRef,
    informationFormRef,
    addCommissionModalRef,
    funds,
  }
}

export default useInformationForm
