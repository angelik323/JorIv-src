import { IEmail } from '@/interfaces/customs/EmailGenerator'
import { reactive, toRefs, computed, watch } from 'vue'

export const useEmailGenerator = (props: any) => {
  const formValues = reactive<IEmail>({
    email: '' as string,
  })
  const isEditing = computed(() => !!props.itemToEdit)

  // props
  const { rules } = toRefs(props)
  const combinedRules = computed(() => [...(rules.value || [])])

  watch(
    () => props.itemToEdit,
    (newValue: IEmail) => {
      if (newValue) {
        formValues.email = newValue.email
      }
    },
    { immediate: true }
  )

  const clearAll = () => {
    formValues.email = undefined
  }

  return {
    formValues,
    combinedRules,
    isEditing,
    clearAll,
  }
}
