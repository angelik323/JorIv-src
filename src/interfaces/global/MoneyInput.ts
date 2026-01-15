import { ComputedRef } from 'vue'

export interface IMoneyInputProps {
  maxIntegerDigits: number
  maxDecimalDigits: number
  thousandSeparator: string
  decimalSeparator: string
}

export interface IMoneyInputReturn {
  displayValue: ComputedRef<string>
  rawValue: ComputedRef<string | null>
  formatToDisplay: (value: string | null) => string
  parseToRaw: (displayValue: string) => string | null
  handleInput: (input: string) => { display: string; raw: string | null }
  initialize: (value: string | null) => void
}

// InputMoneyComponent.vue
export interface InputMoneyProps {
  modelValue: string | null
  id?: string
  label?: string
  class_name?: string
  placeholder?: string
  label_class?: string
  label_color?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  rules?: ((val: string) => true | string)[]
  max_integer_digits?: number
  max_decimal_digits?: number
  hide_bottom_space?: boolean
  hide_symbol?: boolean
}

export type InputMoneyEmits = {
  (e: 'update:modelValue', value: IInputMoneyModelValue): void
  (e: 'input', value: string | null): void
}

export interface IInputMoneyModelValue {
  rawValue: string | null
  formattedValue: string | null
}
