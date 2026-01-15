import { ICardStatus } from '@/interfaces/global'

export const TREASURY_STATUS_MAP: Record<number, ICardStatus> = {
  1: {
    icon: 'CircleCheckBig',
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    title: 'Exitoso',
    textColor: '#2E7D32',
  },
  2: {
    icon: 'CircleX',
    bg: '#FFE6E6',
    color: '#C62828',
    iconColor: '#C62828',
    title: 'Con errores',
    textColor: '#C62828',
  },
  3: {
    icon: 'CircleMinus',
    bg: '#FFF3CD',
    color: '#856404',
    iconColor: '#856404',
    title: 'N/A',
    textColor: '#856404',
  },
}
