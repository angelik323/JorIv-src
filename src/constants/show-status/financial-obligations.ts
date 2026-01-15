import { ICardStatus } from '@/interfaces/global'

export const FINANCIAL_OBLIGATIONS_STATUS_MAP: Record<number, ICardStatus> = {
  0: {
    icon: 'XCircle',
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: 'rgb(157, 158, 162)',
    title: 'Sin definir',
    textColor: '#9d9ea2',
  },
  1: {
    icon: 'Clock',
    bg: '#FFF3E0',
    color: '#212121',
    iconColor: '#FF9800',
    title: 'Pendiente',
    textColor: '#FF9800',
  },
  2: {
    icon: 'CheckCircle',
    bg: '#D8F0CB',
    color: '#333742',
    iconColor: 'rgba(48, 90, 56, 1)',
    title: 'Pagada',
    textColor: '#305a38',
  },
  3: {
    icon: 'Minus',
    bg: '#FFEAEB',
    color: '#333742',
    iconColor: '#D20008',
    title: 'Vencida',
    textColor: '#D20008',
  },
  4: {
    icon: 'Bookmark',
    bg: '#B1D4FF',
    color: '#333742',
    iconColor: 'rgba(0, 62, 137, 1)',
    title: 'Amortizada',
    textColor: '#003e89',
  },
  5: {
    icon: 'XCircle',
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Cancelada',
    textColor: '#E25D0F',
  },
}
