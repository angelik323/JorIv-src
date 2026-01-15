import { ref, computed, watch } from 'vue'
import { QInput, uid } from 'quasar'

// Interfaces
import {
  InputMoneyProps,
  InputMoneyEmits,
  IInputMoneyModelValue,
} from '@/interfaces/global/MoneyInput'

// Utilities (Composables)
import { useUtils } from '@/composables/useUtils'
import { useMoneyInput } from '@/composables/useMoneyInput'

const useInputMoneyComponent = (
  props: InputMoneyProps,
  emit: InputMoneyEmits
) => {
  // Referencia al q-input
  const inputRef = ref<QInput | null>(null)

  // ID único para el input
  const inputId = computed(() => props.id || `input-money-${uid()}`)

  const labelClass = computed(() =>
    `${props.label_class} ${props.label_color}`.trim()
  )

  const combinedRules = computed(() => {
    const rules: ((val: string) => true | string)[] = []

    if (props.rules && props.rules.length > 0) {
      rules.push(...props.rules)
    }

    return rules
  })

  const money = useMoneyInput({
    maxIntegerDigits: props.max_integer_digits ?? 15,
    maxDecimalDigits: props.max_decimal_digits ?? 6,
    thousandSeparator: '.',
    decimalSeparator: ',',
  })

  const internalDisplayValue = ref<string>('')

  const onInputChange = (val: string | number | null): void => {
    const stringValue = val?.toString() || ''

    // Procesa la entrada del input con el composable
    const result = money.handleInput(stringValue)
    internalDisplayValue.value = result.display

    const modelValue: IInputMoneyModelValue = {
      rawValue: result.raw,
      formattedValue: result.display,
    }

    emit('update:modelValue', modelValue)
    emit('input', result.raw)
  }

  // Sincroniza valor externo
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue === money.rawValue.value) return

      // Se inicializa el valor en el composable
      money.initialize(newValue)
      internalDisplayValue.value = money.displayValue.value
    },
    { immediate: true }
  )

  return {
    utils: useUtils(),
    inputRef,
    inputId,
    labelClass,
    combinedRules,
    internalDisplayValue,
    onInputChange,
  }
}

export default useInputMoneyComponent
