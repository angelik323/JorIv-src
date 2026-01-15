import { ICardStatus } from '@/interfaces/global'

export const ACCOUNTS_PAYABLE_MAP: Record<number, ICardStatus> = {
  0: {
    icon: 'XCircle', // Sin estado
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2',
    title: 'Sin estado',
    textColor: '#9d9ea2',
  },
  1: {
    icon: 'Clock', // Sin estado
    bg: '#FFEBEE',
    color: '#333742',
    iconColor: '#C62828',
    title: 'Sin estado',
    textColor: '#C62828',
  },
  2: {
    icon: 'Ban', // Inactivo
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2',
    title: 'Inactivo',
    textColor: '#9d9ea2',
  },

  4: {
    icon: 'FileEdit', // Borrador
    bg: '#F2F2F2',
    color: '#333742',
    iconColor: '#7A7A7A',
    title: 'Borrador',
    textColor: '#7A7A7A',
  },
  5: {
    icon: 'CheckCircle', // Registrado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Registrado',
    textColor: '#E25D0F',
  },
  6: {
    icon: 'XCircle', // Rechazado
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07',
    title: 'Rechazado',
    textColor: '#d21d07',
  },
  7: {
    icon: 'CheckCircle', // Habilitado
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Habilitado',
    textColor: '#E25D0F',
  },
  8: {
    icon: 'ClipboardCheck', // Causado
    bg: '#EDF4FF',
    color: '#333742',
    iconColor: '#4A79D4',
    title: 'Causado',
    textColor: '#4A79D4',
  },
  9: {
    icon: 'CheckCircle', // Pagado
    bg: '#E6F8F3',
    color: '#333742',
    iconColor: '#0CA678',
    title: 'Pagado',
    textColor: '#0CA678',
  },
  10: {
    icon: 'PieChart', // Pagado parcial
    bg: '#E3F5FF',
    color: '#333742',
    iconColor: '#0078B4',
    title: 'Pagado parcial',
    textColor: '#0078B4',
  },
  11: {
    icon: 'Stamp', // Legalizado
    bg: '#E5F1F5',
    color: '#333742',
    iconColor: '#2A6F85',
    title: 'Legalizado',
    textColor: '#2A6F85',
  },
  12: {
    icon: 'CheckCircle', // Autorizado
    bg: '#E6F8F3',
    color: '#333742',
    iconColor: '#0CA678',
    title: 'Autorizado',
    textColor: '#0CA678',
  },
  13: {
    icon: 'Ban', // Inhabilitado
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2',
    title: 'Inhabilitado',
    textColor: '#9d9ea2',
  },
  14: {
    icon: 'XCircle', // Rechazado
    bg: '#FFEBEE',
    color: '#333742',
    iconColor: '#C62828',
    title: 'Rechazado',
    textColor: '#C62828',
  },

  15: {
    icon: 'CheckCircle', // Autorizado
    bg: '#E6F8F3',
    color: '#333742',
    iconColor: '#0CA678',
    title: 'Aprobado',
    textColor: '#0CA678',
  },

  30: {
    icon: 'XCircle', // Con error
    bg: '#FFEBEE',
    color: '#333742',
    iconColor: '#C62828',
    title: 'Con error',
    textColor: '#C62828',
  },

  56: {
    icon: 'CheckSquare', // Autorizado
    bg: '#E5F9F6',
    color: '#333742',
    iconColor: '#08A29E',
    title: 'Autorizado',
    textColor: '#08A29E',
  },

  117: {
    icon: 'Clock', // Sin confirmar
    bg: '#FFEBEE',
    color: '#333742',
    iconColor: '#C62828',
    title: 'Sin confirmar',
    textColor: '#C62828',
  },

  75: {
    icon: 'CheckCircle', // Verificado
    bg: '#E6F8F3',
    color: '#333742',
    iconColor: '#0CA678',
    title: 'Verificado',
    textColor: '#0CA678',
  },

  105: {
    icon: 'XCircle', // Fallido
    bg: '#FFEBEE',
    color: '#333742',
    iconColor: '#C62828',
    title: 'Fallido',
    textColor: '#C62828',
  },

  107: {
    icon: 'CheckCircle', // Exitoso
    bg: '#E6F8F3',
    color: '#333742',
    iconColor: '#0CA678',
    title: 'Exitoso',
    textColor: '#0CA678',
  },

  115: {
    icon: 'CheckSquare', // Autorizado
    bg: '#E5F9F6',
    color: '#333742',
    iconColor: '#08A29E',
    title: 'Cumplido',
    textColor: '#08A29E',
  },

  116: {
    icon: 'XCircle', // Rechazado
    bg: '#FFEBEE',
    color: '#333742',
    iconColor: '#C62828',
    title: 'Anulado',
    textColor: '#C62828',
  },
}
