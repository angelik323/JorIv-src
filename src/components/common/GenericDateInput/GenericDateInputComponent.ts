import { ref, computed, watch } from 'vue'
import { uid } from 'quasar'
import { checkDigit } from '@/utils'
import { useRules } from '@/composables'

const useGenericDateInputComponent = (props: any, emit: any) => {
  const inputProperties = ref<{
    value: null | number | string
  }>({
    value: null,
  })

  const qDateInput = ref()
  const currentView = ref<'Years' | 'Calendar' | 'Months' | undefined>(
    props?.mask === 'YYYY'
      ? 'Years'
      : props?.mask === 'YYYY-MM'
      ? 'Years'
      : 'Calendar'
  )
  const { valid_format_date } = useRules()

  const labelClass = computed(() =>
    `${props.label_class} ${props.label_color}`.trim()
  )

  const dateInputRef = ref()

  // ID único para el date input
  const inputId = computed(() => props.id || `genericDateInput-${uid()}`)

  const computedRules = computed(() => {
    const hasFormatValidation = props.rules.some((r: string) => {
      const ruleString = r.toString()
      return ruleString.includes('moment') || ruleString.includes('isValid')
    })

    if (props.required && !hasFormatValidation) {
      return [...props.rules, (v: string) => valid_format_date(v, props.mask)]
    }

    return props.rules
  })
  watch(
    () => props.default_value,
    (val) => {
      if (props?.mask === 'YYYY-MM' && val === '') currentView.value = 'Years'
      inputProperties.value.value = val
    },
    { immediate: true }
  )

  return {
    qDateInput,
    inputProperties,
    currentView,
    checkDigit,
    labelClass,
    dateInputRef,
    inputId,
    computedRules,
    setValue: (value: string | number | null) => {
      const valueModify = value ?? ''

      if (props?.mask === 'YYYY') {
        qDateInput.value.hide()
      } else if (props?.mask === 'YYYY-MM') {
        if (currentView.value === 'Months') {
          qDateInput.value.hide()
        }
        currentView.value = currentView.value === 'Years' ? 'Months' : 'Years'
      } else {
        currentView.value = 'Calendar'
        qDateInput.value.hide()
      }
      emit('update:modelValue', valueModify)
    },
  }
}

export default useGenericDateInputComponent
