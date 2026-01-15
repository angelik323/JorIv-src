export type FileInputValue = File | File[] | null

export interface GenericFileInputProps {
  id?: string
  class_name?: string
  label?: string
  label_class?: string
  label_color?: string
  default_value: FileInputValue
  readonly?: boolean
  disabled?: boolean
  required?: boolean
  hint?: string
  rules?: ((val: FileInputValue) => true | string)[]
  aria_label?: string
  multiple?: boolean
  accept?: string
  clearable?: boolean
  placeholder?: string
}
