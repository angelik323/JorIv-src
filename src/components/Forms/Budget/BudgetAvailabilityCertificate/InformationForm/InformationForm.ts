// Vue - Pinia
import { ref, watch } from 'vue'
import { QForm } from 'quasar'
import { storeToRefs } from 'pinia'

// Interfaces
import { ActionType } from '@/interfaces/global'
import { IBudgetAvailabilityCertificateForm } from '@/interfaces/customs/budget/BudgetAvailabilityCertificate'

// Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'

const useInformationForm = (props: {
  action: ActionType
  data?: Partial<IBudgetAvailabilityCertificateForm>
}) => {
  const {
    business_trusts_with_documents: businessTrusts,
    budget_document_number: budgetDocumentNumber,
    budget_level_for_documents: budgetLevels,
  } = storeToRefs(useBudgetResourceStore('v1'))

  const informationFormRef = ref<InstanceType<typeof QForm> | null>(null)

  const formData = ref<IBudgetAvailabilityCertificateForm>({
    filter: {
      business_trust_id: 0,
      validity: 0,
      budget_level_id: 0,
      document_from: 0,
      document_to: 0,
    },
    description_society: '',
  })

  const setFormData = (data: Partial<IBudgetAvailabilityCertificateForm>) => {
    formData.value = { ...formData.value, ...data }
  }

  watch(
    () => props.data,
    (data) => {
      if (!data) return
      setFormData(data)
    },
    { deep: true, immediate: true }
  )

  return {
    formData,
    budgetLevels,
    businessTrusts,
    informationFormRef,
    budgetDocumentNumber,
  }
}

export default useInformationForm
