import { ICardStatus } from '@/interfaces/global'

export const ACCOUNTING_VOUCHERS_STATUS_MAP: Record<number, ICardStatus> = {
  73: {
    icon: 'CircleCheckBig', // Procesado parcialmente
    bg: '#d3e6d3ff',
    color: '#0c490fff',
    iconColor: '#0c490fff',
    title: 'Procesado parcialmente',
    textColor: '#0c490fff',
  },
  85: {
    icon: 'CheckCircle',
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Proceso exitoso',
    textColor: '#E25D0F',
  },
}
