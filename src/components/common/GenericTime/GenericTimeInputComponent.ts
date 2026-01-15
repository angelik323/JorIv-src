import { ref, computed, watch } from 'vue'
import { uid } from 'quasar'
import { checkDigit } from '@/utils'
import { useRules } from '@/composables'

const useGenericTimeInputComponent = (props: any, emit: any) => {
  const inputProperties = ref<{
    value: null | string
  }>({
    value: null,
  })

  const { valid_format_time } = useRules()

  const labelClass = computed(() =>
    `${props.label_class} ${props.label_color}`.trim()
  )

  const timeInputRef = ref()

  // ID único para el time input
  const inputId = computed(() => props.id || `genericTimeInput-${uid()}`)

  watch(
    () => props.default_value,
    (val) => {
      inputProperties.value.value = val ?? null
    },
    { immediate: true }
  )

  return {
    inputProperties,
    checkDigit,
    valid_format_time,
    labelClass,
    timeInputRef,
    inputId,
    setValue: (value: string | number | null) => {
      const valueModify = value ?? ''
      emit('update:modelValue', valueModify)
    },
  }
}

export default useGenericTimeInputComponent
