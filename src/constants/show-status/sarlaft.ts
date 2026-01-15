import { ICardStatus } from '@/interfaces/global'
export const SARLAFT_STATUS_MAP: Record<number, ICardStatus> = {
  1: {
    icon: 'XCircle',
    bg: '#FFE6E2',
    color: '#333742',
    iconColor: '#B72D18',
    title: 'Alta',
    textColor: '#1A1A1A',
  },
  2: {
    icon: 'XCircle',
    bg: '#FFE6E2',
    color: '#333742',
    iconColor: '#B72D18',
    title: 'Alta',
    textColor: '#1A1A1A',
  },
  3: {
    icon: 'CircleAlert',
    bg: '#FFEFDE',
    color: '#333742',
    iconColor: '#F45100',
    title: 'Media',
    textColor: '#1A1A1A',
  },
  4: {
    icon: 'CircleMinus',
    bg: '#FFE7ED',
    color: '#333742',
    iconColor: '#FF7500',
    title: 'Baja',
    textColor: '#1A1A1A',
  },
  5: {
    // Pendiente RQ y back
    icon: 'CheckCircle',
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Sin coincidencia',
    textColor: '#1A1A1A',
  },
}
