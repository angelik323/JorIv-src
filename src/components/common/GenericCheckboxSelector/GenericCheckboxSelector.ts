import { ref, computed, watch } from 'vue'
import { uid } from 'quasar'
import { IGenericCheckboxSelector, IGenericOption } from '@/interfaces/customs'

const useGenericCheckboxSelector = <T extends IGenericOption>(
  props: IGenericCheckboxSelector<T>,
  emit: {
    (event: 'update:modelValue', value: T[]): void
    (event: 'update:focus', value: T[]): void
    (event: 'update:blur', value: T[]): void
    (event: 'update:keyup', value: KeyboardEvent): void
    (event: 'search', value: string): void
    (event: 'change', value: T[]): void
  }
) => {
  const internalValue = computed<T[]>({
    get: () => props.modelValue || [],
    set: (val: T[]) => {
      emit('update:modelValue', val)
      emit('change', val)
    },
  })

  const labelClass = computed(() => {
    return `${props.label_class} ${props.label_color}`.trim()
  })

  // ID único para el generic checkbox
  const inputId = computed(() => props.id || `genericCheckboxSelector-${uid()}`)
  const checkboxSelectorRef = ref()

  let debounceTimeout: ReturnType<typeof setTimeout>

  const displayValueKey = props.display_value as string
  const search = ref('') // para controlar el valor de búsqueda local

  const isSelected = (opt: T): boolean =>
    internalValue.value.some(
      (item) => item[displayValueKey] === opt[displayValueKey]
    )

  const toggleOption = (opt: T) => {
    if (isSelected(opt)) {
      internalValue.value = internalValue.value.filter(
        (item) => item[displayValueKey] !== opt[displayValueKey]
      )
    } else {
      internalValue.value = [...internalValue.value, opt]
    }

    search.value = ''

    checkboxSelectorRef.value?.updateInputValue('')
  }

  const removeOption = (opt: T) => {
    internalValue.value = internalValue.value.filter(
      (item) => item[displayValueKey] !== opt[displayValueKey]
    )

    search.value = ''
  }

  const onKeyup = (e: KeyboardEvent) => {
    const target = e.target as HTMLInputElement
    const value = target?.value || ''
    search.value = value

    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      emit('search', value)
    }, 300)
  }

  const filteredOptions = computed<T[]>(() => {
    const displayLabelKey = props.display_label as string
    return props.options.filter((opt) => {
      const label = String(opt[displayLabelKey] ?? '').toLowerCase()
      return label.includes(search.value.toLowerCase())
    })
  })

  const displayPlaceholder = computed(() =>
    internalValue.value.length === 0 ? props.placeholder : ''
  )

  const onKeyPress = (event: KeyboardEvent) => {
    const allowedPattern = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/
    if (!allowedPattern.test(event.key)) {
      event.preventDefault()
    }
  }

  const clearAll = () => {
    internalValue.value = []
    emit('update:modelValue', [])
    emit('change', [])
  }

  watch(
    () => props.options,
    () => {
      search.value = ''
    }
  )

  return {
    displayPlaceholder,
    filteredOptions,
    internalValue,
    labelClass,
    inputId,
    checkboxSelectorRef,
    toggleOption,
    removeOption,
    isSelected,
    onKeyup,
    search,
    clearAll,
    onKeyPress,
  }
}

export default useGenericCheckboxSelector
