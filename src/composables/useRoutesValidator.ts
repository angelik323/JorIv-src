import { useLogin } from '@/stores'
import { storeToRefs } from 'pinia'
import { useAlert } from '@/composables/useAlert'
import { useGoToUrl } from '@/composables/useGoToUrl'

export const useRouteValidator = () => {
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()

  const validateRouter = (
    key_menu: string,
    identifier_submenu: string,
    action:
      | 'list'
      | 'view'
      | 'edit'
      | 'delete'
      | 'undo'
      | 'export'
      | 'import'
      | 'show'
      | 'action_generate'
      | 'process'
      | 'action_outdated'
      | 'action_export_individual'
      | 'action_export_errors'
      | 'action_authorize'
      | 'export_individual'
      | 'action_import'
      | 'action_reject'
      | 'action_change_status'
      | 'action_annul'
      | 'action_update'
      | 'action_legalize'
      | 'validate'
      | 'action_give_permissions'
      | 'action_remove_permissions'
      | 'action_transfer_permissions'
      | 'action_program'
      | 'action_homologate'
      | 'create' = 'list'
  ): boolean => {
    const { menus } = storeToRefs(useLogin())

    const submenu = menus.value
      .find((menu) => menu.key === key_menu)
      ?.children.find((child) => child.identifier === identifier_submenu)

    if (!submenu) return false

    if (!action) return submenu.identifier.length > 0

    return submenu.actions?.includes(action)
  }

  /**
   * Valida una condición y redirige si falla
   * @param validationFn - Función que retorna true si la validación pasa (puede ser asíncrona)
   * @param message - Mensaje de error a mostrar (opcional)
   * @param fallbackRoute - Ruta a la que redirigir (opcional)
   * @returns Promise<boolean> - true si la validación pasa, false si falla
   */
  const validateRouterAccess = async (
    validationFn: () => boolean | Promise<boolean>,
    message?: string,
    fallbackRoute?: string
  ): Promise<boolean> => {
    if (typeof validationFn !== 'function') {
      return false
    }

    const defaultMessage =
      message ||
      '¡No cuenta con los permisos necesarios para acceder a este módulo!'
    const finalRoute = fallbackRoute || 'HomeView'

    try {
      const isValid = await validationFn()

      if (isValid) {
        return true
      }

      showAlert(defaultMessage, 'error')
      goToURL(finalRoute)
      return false
    } catch (error) {
      showAlert(defaultMessage, 'error')
      goToURL(finalRoute)
      return false
    }
  }

  return {
    validateRouter,
    validateRouterAccess,
  }
}
