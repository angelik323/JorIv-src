import { SweetAlertInput } from 'sweetalert2'

export interface IShowAlertInformation {
  icon?: any
  title?: string
  description?: string
  params_html?: any
  confirmButtonColor?: string;
  image_url?: string
  confirm_button_text?: string
  cancel_button_text?: string
  show_cancel_button?: boolean
  allow_outside_click?: boolean
  allow_escape_key?: boolean
  show_close_button?: boolean
  input_value?: string | number
  input_label?: string
  input_type?: SweetAlertInput
  input_options?: { value: number | string; label: string }[]
}
