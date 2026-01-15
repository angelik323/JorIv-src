import { onMounted, ref, computed, watch } from 'vue'
import { uid } from 'quasar'

const useGenericInputComponent = (
  props: {
    id?: string
    class_name?: string
    label?: string
    label_class?: string
    label_color?: string
    default_value: string | number | object | null | boolean | undefined
    type?:
      | 'number'
      | 'date'
      | 'search'
      | 'file'
      | 'textarea'
      | 'time'
      | 'text'
      | 'email'
      | 'url'
      | 'password'
      | 'tel'
      | 'datetime-local'
    placeholder?: string
    readonly?: boolean
    lazy_rules?: boolean
    disabled?: boolean
    required?: boolean
    max_length?: string
    hint?: string
    min_value?: number
    max_value?: number
    rules?: ((
      val: string | number | null | undefined
    ) => true | string | Promise<true | string>)[]
    additional_characters?: string
    aria_label?: string
    prepend_icon?: string
    append_icon?: string
    prepend_clickable?: boolean
    append_clickable?: boolean
    prepend_aria_label?: string
    append_aria_label?: string
    debounce?: number | string
  },
  emit: Function
) => {
  const inputProperties = ref<{
    loading: boolean
    returnObject: boolean
    disable: boolean
    options: object[] | string[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
    label: string | undefined
  }>({
    loading: false,
    returnObject: false,
    disable: false,
    options: [] as object[] | string[],
    value: null,
    label: props.label,
  })

  const labelClass = computed(() => {
    return `${props.label_class} ${props.label_color}`.trim()
  })

  // ID único para el input
  const inputId = computed(() => props.id || `input-${uid()}`)

  // Referencia al q-input
  const inputRef = ref()

  onMounted(() => {
    if (props.default_value) {
      inputProperties.value.value = props.default_value
    }
  })

  watch(
    () => props.default_value,
    (val) => {
      inputProperties.value.value = val
      if (!val && !props.required) inputRef.value?.resetValidation()
    }
  )

  watch(
    () => props.disabled,
    (val) => {
      inputProperties.value.disable = val ?? false
    }
  )

  // @TODO: validacion experimental, en fase de prueba
  watch(
    () => props.required,
    (val) => {
      if (!val) {
        inputRef.value?.resetValidation()
      }
    }
  )

  return {
    inputProperties,
    labelClass,
    inputId,
    inputRef,
    setValue: (value: string | number | string[] | number[]) => {
      emit('update:modelValue', value)
    },
  }
}

export default useGenericInputComponent
