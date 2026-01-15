//Core
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
//Interfaces
import { IBudgetLevelsList } from '@/interfaces/customs/budget/BudgetLevels'
//Stores
import { useBudgetResourceStore } from '@/stores/resources-manager/budget'
import { useBudgetLevels } from '@/stores/budget/budget-levels'

const useInformationForm = () => {
  const { budget_level } = storeToRefs(useBudgetLevels('v1'))
  const { budget_classes } = storeToRefs(useBudgetResourceStore('v1'))

  const levelRef = ref()
  const descriptionRef = ref()
  const classRef = ref()

  const informationForm = ref()

  const validateForm = (): Promise<boolean> => {
    return informationForm.value?.validate() ?? Promise.resolve(false)
  }

  const getFormData = (): IBudgetLevelsList => budget_level.value

  const setFormData = (data: Partial<IBudgetLevelsList>): void => {
    if (!data) return
    Object.assign(budget_level.value, data)
  }

  const resetForm = (): void => {
    informationForm.value?.reset?.()
    levelRef.value?.resetValidation?.()
    descriptionRef.value?.resetValidation?.()
    classRef.value?.resetValidation?.()
  }

  return {
    informationForm,
    levelRef,
    descriptionRef,
    classRef,
    budget_level,
    budget_classes,
    // Methods
    validateForm,
    getFormData,
    setFormData,
    resetForm,
  }
}

export default useInformationForm
