import GenericSelectorComponent from '@/components/common/GenericSelector/GenericSelectorComponent.vue'
import { IShowAlertInformation } from '@/interfaces/global/ISweetAlerts'
import { Quasar } from 'quasar'
import Swal from 'sweetalert2'
import { ref, createApp } from 'vue'

export const useAlertModal = () => {
  // Show an information alert as modal and return true if confirmButton is clicked.
  const showAlertInformation = async (params: IShowAlertInformation) => {
    const isConfirmed = ref(false)
    await Swal.fire({
      icon: params.icon ?? undefined,
      title: params.title ?? false,
      text: params.description ?? '¿Desea realizar acción?',
      html: params.params_html ?? false,
      imageUrl: params.image_url ?? undefined,
      confirmButtonText: params.confirm_button_text ?? 'Confirmar',
      cancelButtonText: params.cancel_button_text ?? 'Cancelar',
      showCancelButton: params.show_cancel_button ?? true,
      confirmButtonColor: '#f45100',
      allowOutsideClick: params.allow_outside_click ?? false,
      allowEscapeKey: params.allow_escape_key ?? false,
      showCloseButton: params.show_close_button ?? true,
      customClass: {
        popup: 'custom__card--border',
        confirmButton: 'btn__history',
        cancelButton: 'btn__history-outline ',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        isConfirmed.value = true
      }
    })
    return isConfirmed.value
  }

  const showAlertInformationWithCustomInputSelect = async (
    params: IShowAlertInformation
  ) => {
    const result = {
      isConfirmed: false,
      value: null,
    }

    await Swal.fire({
      icon: params.icon ?? undefined,
      title: params.title ?? false,
      html: params.params_html ?? false,
      imageUrl: params.image_url ?? undefined,
      confirmButtonText: params.confirm_button_text ?? 'Confirmar',
      cancelButtonText: params.cancel_button_text ?? 'Cancelar',
      showCancelButton: params.show_cancel_button ?? true,
      confirmButtonColor: '#f45100',
      allowOutsideClick: params.allow_outside_click ?? false,
      allowEscapeKey: params.allow_escape_key ?? false,
      showCloseButton: params.show_close_button ?? true,
      customClass: {
        popup: 'custom__card--border',
        confirmButton: 'btn__history',
        cancelButton: 'btn__history-outline ',
      },
      didOpen: () => {
        const container = document.getElementById('custom-selector')
        const app = createApp(GenericSelectorComponent, {
          default_value: params.input_value,
          manual_option: params.input_options,
          map_options: true,
          'onUpdate:modelValue': (value: any) => {
            params.input_value = value
          },
        })
        app.use(Quasar, {})
        if (container) {
          app.mount(container)
        }
      },
      preConfirm: () => {
        return params.input_value
      },
    }).then((res) => {
      result.isConfirmed = res.isConfirmed
      result.value = res.value
    })

    return result
  }

  const showAlertInformationNoDescription = async (
    params: IShowAlertInformation
  ) => {
    const isConfirmed = ref(false)
    await Swal.fire({
      icon: params.icon ?? undefined,
      title: params.title ?? false,
      text: params.description,
      html: params.params_html ?? false,
      imageUrl: params.image_url ?? undefined,
      confirmButtonText: params.confirm_button_text ?? 'Confirmar',
      cancelButtonText: params.cancel_button_text ?? 'Cancelar',
      showCancelButton: params.show_cancel_button ?? true,
      confirmButtonColor: '#f45100',
      allowOutsideClick: params.allow_outside_click ?? false,
      allowEscapeKey: params.allow_escape_key ?? false,
      showCloseButton: params.show_close_button ?? true,
      customClass: {
        popup: 'custom__card--border',
        confirmButton: 'btn__history',
        cancelButton: 'btn__history-outline ',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        isConfirmed.value = true
      }
    })
    return isConfirmed.value
  }

  return {
    showAlertInformation,
    showAlertInformationWithCustomInputSelect,
    showAlertInformationNoDescription,
  }
}
