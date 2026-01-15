import { ICardStatus } from '@/interfaces/global'

export const NOTIFICATIONS_STATUS: Record<string, ICardStatus> = {
  115: {
    icon: 'CheckCircle',
    title: 'Confirmada',
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    textColor: '#39ba2e',
  },
  116: {
    icon: 'XCircle',
    title: 'No confirmada',
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07',
    textColor: '#d21d07',
  },
}
