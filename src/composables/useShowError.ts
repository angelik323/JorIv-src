import { IErrors } from '@/interfaces/global/errorMessage'

export const useShowError = () => {
  const showCatchError = ({ message, response }: IErrors): string => {
    if (response) {
      if (response.data?.message) {
        return response.status === 422
          ? String(
            response.data.data[Object.keys(response.data?.data)[0]]?.[0] ??
                response.data?.message
          )
          : String(response.data?.message)
      }

      if (response.status === 404) {
        return 'No se encontraron registros'
      }

      if (response.status === 401) {
        return 'No autorizado'
      }

      if (response.status === 409) {
        return String(response.data?.message)
      }

      if (response.status === 500) {
        return 'Error interno del servidor'
      }

      return '¡Error sin definir!'
    }

    if (response === undefined && message === 'Network Error')
      return 'No se pudo conectar al servidor. Verifique su conexión a Internet.'

    if (message === "Cannot read properties of undefined (reading 'status')")
      return 'No se pudo conectar al servidor. Verifique su conexión a Internet.'

    return message ? message : 'Error desconocido.'
  }

  return {
    showCatchError,
  }
}
