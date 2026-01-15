export interface IGenericOption {
  id: number
  name: string
  [key: string]: string | number | boolean
}

export interface IGenericCheckboxSelector<T = IGenericOption> {
  id?: string
  class_name?: string
  label?: string
  label_class?: string
  label_color?: string
  modelValue: T[] | null
  options: T[]
  placeholder?: string
  readonly?: boolean
  disabled?: boolean
  required?: boolean
  display_label?: string
  display_value?: string
  auto_complete?: boolean
  color?: string
  show_selected_chips?: boolean
  loading?: boolean
  aria_label?: string
}
