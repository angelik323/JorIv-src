import { ICardStatus } from '@/interfaces/global'

export const BILLING_PORTFOLIO_STATUS_MAP: Record<number, ICardStatus> = {
  0: {
    icon: 'XCircle',
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: 'rgb(157, 158, 162)',
    title: 'Sin definir',
    textColor: '#9d9ea2',
  },
  3: {
    icon: 'Clock', // Pendiente
    bg: '#FFE7ED',
    color: '#000',
    iconColor: '#8D1E3D',
    title: 'Pendiente',
    textColor: '#000',
  },
  4: {
    icon: 'XCircle', // Cancelado
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07', // rgba(210,29,7,255)
    title: 'Cancelado',
    textColor: '#d21d07',
  },
  6: {
    icon: 'RefreshCw', // En progreso
    bg: '#E3FAFF',
    color: '#333742',
    iconColor: '#00B8D9',
    title: 'En progreso',
    textColor: '#00B8D9',
  },
  7: {
  icon: 'CheckCircle', // Liquidado
  bg: '#FFF8E1',
  color: '#333742',
  iconColor: '#E0B100',
  title: 'Liquidado',
  textColor: '#E0B100',
  },
  12: {
    icon: 'CheckSquare', // Autorizado
    bg: '#E5F9F6',
    color: '#333742',
    iconColor: '#08A29E',
    title: 'Autorizado',
    textColor: '#08A29E',
  },
  13: {
    icon: 'XOctagon', // Anulado
    bg: '#FFE6E6',
    color: '#333742',
    iconColor: '#9C2B2B',
    title: 'Anulado',
    textColor: '#9C2B2B',
  },
  15: {
    icon: 'FileText', // Facturado
    bg: '#F0F0FF',
    color: '#333742',
    iconColor: '#5D5FEF',
    title: 'Facturado',
    textColor: '#5D5FEF',
  },
  16: {
    icon: 'Clock', // Pagada
    bg: '#FFE7ED',
    color: '#333742',
    iconColor: '#8D1E3D',
    title: 'Pagada',
    textColor: '#8D1E3D',
  },
  17: {
    icon: 'CheckCircle', // Pagado
    bg: '#E6F8F3',
    color: '#333742',
    iconColor: '#0CA678',
    title: 'Pagado',
    textColor: '#0CA678',
  },
  20: {
    icon: 'CreditCard', // Pendiente de pago
    bg: '#FFF4E5',
    color: '#333742',
    iconColor: '#B36D00',
    title: 'Pendiente de pago',
    textColor: '#B36D00',
  },
  21: {
    icon: 'PieChart', // Parcialmente pagado
    bg: '#E3F5FF',
    color: '#333742',
    iconColor: '#0078B4',
    title: 'Parcialmente pagado',
    textColor: '#0078B4',
  },
  22: {
    icon: 'Clock', //Pendiente con errores
    bg: '#FFE7ED',
    color: '#333742',
    iconColor: '#8D1E3D',
    title: 'Pendiente con errores',
    textColor: '#8D1E3D',
  },
  23: {
    icon: 'CheckCircle', // Cerrado
    bg: '#E6F8F3',
    color: '#333742',
    iconColor: '#0CA678',
    title: 'Cerrado',
    textColor: '#0CA678',
  },
}
