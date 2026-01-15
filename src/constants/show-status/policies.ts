import { ICardStatus } from '@/interfaces/global'

export const POLICIES_MAP: Record<number, ICardStatus> = {
  11: {
    icon: 'RefreshCw', // En renovación
    bg: '#E3F2FD',
    color: '#333742',
    iconColor: '#1976D2',
    title: 'En renovación',
    textColor: '#1976D2',
  },
  12: {
    icon: 'Clock', // En periodo de gracia
    bg: '#F3E5F5',
    color: '#333742',
    iconColor: '#7B1FA2',
    title: 'En periodo de gracia',
    textColor: '#7B1FA2',
  },
  13: {
    icon: 'AlertCircle', // Vencida
    bg: '#FFF3E0',
    color: '#333742',
    iconColor: '#F57C00',
    title: 'Vencida',
    textColor: '#F57C00',
  },
  14: {
    icon: 'XCircle', // Cancelada
    bg: '#F5F5F5',
    color: '#333742',
    iconColor: '#757575',
    title: 'Cancelada',
    textColor: '#757575',
  },
  15: {
    icon: 'SlashCircle', // Anulada
    bg: '#FFEBEE',
    color: '#333742',
    iconColor: '#D32F2F',
    title: 'Anulada',
    textColor: '#D32F2F',
  },
  16: {
    icon: 'PauseCircle', // Suspendida
    bg: '#FFF9C4',
    color: '#333742',
    iconColor: '#F9A825',
    title: 'Suspendida',
    textColor: '#F9A825',
  },
  63: {
    icon: 'CheckCircle', // Vigente
    bg: '#E8F5E9',
    color: '#333742',
    iconColor: '#388E3C',
    title: 'Vigente',
    textColor: '#388E3C',
  },
}
