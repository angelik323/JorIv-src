import { useUtils } from '@/composables'

export const useDates = () => {
  const { formatDate } = useUtils()

  /**
   * Obtiene la fecha actual en el formato especificado
   * @param mask - Formato de salida (por defecto: 'YYYY-MM-DD')
   * @returns Fecha actual formateada como string
   */
  const getCurrentDate = (mask: string = 'YYYY-MM-DD'): string => {
    return formatDate(new Date().toISOString(), mask)
  }

  return {
    getCurrentDate,
  }
}
