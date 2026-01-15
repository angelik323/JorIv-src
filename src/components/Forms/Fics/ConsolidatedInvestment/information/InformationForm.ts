// Vue - Pinia
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

// Interfaces
import { IVariableCommission } from '@/interfaces/customs/fics/FiduciaryCommission'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

const useInformationForm = () => {
  const addCommissionModalRef = ref()
  const informationFormRef = ref()
  const initialBalanceRef = ref()
  const ratePercentageRef = ref()
  const finalBalanceRef = ref()

  const customColumns = ['actions']

  const { business_trusts } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const modalCommissionData = ref<IVariableCommission>({
    id: 0,
    initial_balance: 0,
    final_balance: 0,
    rate_percentage: '',
  })

  const formData = ref({
    id: 0,
    code: '',
    description: '',
    business_trust_id: 0,
  })

  const handleOpenModal = () => {
    modalCommissionData.value = {
      id: 0,
      initial_balance: 0,
      final_balance: 0,
      rate_percentage: '',
    }

    addCommissionModalRef.value?.openModal?.()
  }

  const handleCloseModal = () => {
    addCommissionModalRef.value?.closeModal?.()
  }

  return {
    formData,
    customColumns,
    handleOpenModal,
    handleCloseModal,
    finalBalanceRef,
    initialBalanceRef,
    ratePercentageRef,
    informationFormRef,
    modalCommissionData,
    addCommissionModalRef,
    business_trusts,
  }
}

export default useInformationForm
