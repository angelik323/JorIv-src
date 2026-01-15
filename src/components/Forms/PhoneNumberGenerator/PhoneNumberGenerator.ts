import { reactive, toRefs, computed, watch } from 'vue'
import { IPhoneNumber } from '@/interfaces/customs/phoneNumberGenerator'
import { useResourceStore } from '@/stores'
import { storeToRefs } from 'pinia'

export const usePhoneNumberGenerator = (props: any) => {
  const { phone_types } = storeToRefs(useResourceStore('v1'))

  const formValues = reactive<IPhoneNumber>({
    type: { id: 0, name: '' },
    number: '' as string,
  })
  const isEditing = computed(() => !!props.phoneNumberToEdit)

  // props
  const { rules } = toRefs(props)
  const combinedRules = computed(() => [...(rules.value || [])])

  watch(
    () => props.phoneNumberToEdit,
    (newNumber) => {
      if (newNumber) {
        formValues.type = { ...newNumber.type }
        formValues.number = newNumber.number
      }
    },
    { immediate: true }
  )

  const clearAll = () => {
    formValues.number = undefined
    formValues.type = undefined
  }

  return {
    formValues,
    combinedRules,
    isEditing,
    phone_types,
    clearAll,
  }
}
