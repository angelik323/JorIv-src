import { ICardStatus } from '@/interfaces/global'

export const DERIVATIVE_CONTRACTING_MAP: Record<number, ICardStatus> = {
  56: {
    icon: 'CheckCircle', // Registrado
    bg: '#E6F8F3',
    color: '#333742',
    iconColor: '#0CA678',
    title: 'Registrado',
    textColor: '#0CA678',
  },
  57: {
    icon: 'Edit', // En registro
    bg: '#E3FAFF',
    color: '#333742',
    iconColor: '#00B8D9',
    title: 'En registro',
    textColor: '#00B8D9',
  },
  58: {
    icon: 'Eye', // En revisión
    bg: '#F0F0FF',
    color: '#333742',
    iconColor: '#5D5FEF',
    title: 'En revisión',
    textColor: '#5D5FEF',
  },
  59: {
    icon: 'Clock', // Pendiente de aprobación
    bg: '#FFF4E5',
    color: '#333742',
    iconColor: '#B36D00',
    title: 'Pendiente de aprobación',
    textColor: '#B36D00',
  },
  60: {
    icon: 'CheckSquare', // Aprobado
    bg: '#E5F9F6',
    color: '#333742',
    iconColor: '#08A29E',
    title: 'Aprobado',
    textColor: '#08A29E',
  },
  61: {
    icon: 'RefreshCw', // En ejecución
    bg: '#E3FAFF',
    color: '#333742',
    iconColor: '#00B8D9',
    title: 'En ejecución',
    textColor: '#00B8D9',
  },
  62: {
    icon: 'CheckCircle', // Ejecutado
    bg: '#E6F8F3',
    color: '#333742',
    iconColor: '#0CA678',
    title: 'Ejecutado',
    textColor: '#0CA678',
  },
  63: {
    icon: 'Flag', // Terminado
    bg: '#FFF8E1',
    color: '#333742',
    iconColor: '#E0B100',
    title: 'Terminado',
    textColor: '#E0B100',
  },
  64: {
    icon: 'PauseCircle', // Suspendido
    bg: '#E3F5FF',
    color: '#333742',
    iconColor: '#0078B4',
    title: 'Suspendido',
    textColor: '#0078B4',
  },
  65: {
    icon: 'FileText', // En liquidación
    bg: '#FFF8E1',
    color: '#333742',
    iconColor: '#E0B100',
    title: 'En liquidación',
    textColor: '#E0B100',
  },
  66: {
    icon: 'Archive', // Archivado
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2',
    title: 'Archivado',
    textColor: '#9d9ea2',
  },
  67: {
    icon: 'AlertTriangle', // Vencido
    bg: '#FFE7ED',
    color: '#333742',
    iconColor: '#8D1E3D',
    title: 'Vencido',
    textColor: '#8D1E3D',
  },
  68: {
    icon: 'XOctagon', // Anulado
    bg: '#FFE6E6',
    color: '#333742',
    iconColor: '#9C2B2B',
    title: 'Anulado',
    textColor: '#9C2B2B',
  },
}
