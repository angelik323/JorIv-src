import { ICardStatus } from '@/interfaces/global'

export const DISPERSION_GROUP_LETTER_STATUS_MAP: Record<number, ICardStatus> = {
  0: {
    icon: 'XCircle',
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: 'rgb(157, 158, 162)',
    title: 'Sin definir',
    textColor: '#9d9ea2',
  },
  69: {
    icon: 'CheckCircle',
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Impreso',
    textColor: '#E25D0F',
  },
  96: {
    icon: 'XCircle',
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07',
    title: 'No Impreso',
    textColor: '#d21d07',
  },
  66: {
    icon: 'CheckCircle',
    bg: '#D8F0CB',
    color: '#333742',
    iconColor: 'rgba(48, 90, 56, 1)',
    title: 'Generado',
    textColor: '#305a38',
  },
  101: {
    icon: 'CheckCircle',
    bg: '#D8F0CB',
    color: '#333742',
    iconColor: 'rgba(48, 90, 56, 1)',
    title: 'Generado',
    textColor: '#305a38',
  },
}
