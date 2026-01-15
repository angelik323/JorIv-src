import { IEconActivity } from '@/interfaces/global/ThirdParties'
import { reactive, ref, toRefs, computed, watch } from 'vue'

export const useEconActivityGenerator = (props: any) => {
  const formValues = reactive<IEconActivity>({
    city: { id: 0, name: '' },
    ciiu: { id: 0, name: '', code: '' },
  })
  const isEditing = computed(() => !!props.itemToEdit)
  const isLoading = ref(false)

  // props
  const { rules } = toRefs(props)
  const combinedRules = computed(() => [...(rules.value || [])])

  watch(
    () => props.itemToEdit,
    (newValue: IEconActivity) => {
      if (newValue?.ciiu && newValue?.city) {
        formValues.ciiu = { ...newValue.ciiu }
        formValues.city = { ...newValue.city }
      }
    },
    { immediate: true }
  )

  const clearAll = () => {
    formValues.ciiu = undefined
    formValues.city = undefined
  }

  return {
    formValues,
    combinedRules,
    isEditing,
    isLoading,
    clearAll,
  }
}
