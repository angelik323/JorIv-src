import { ICardStatus } from '@/interfaces/global'

export const TREASURY_STATUS_MAP: Record<number, ICardStatus> = {
  1: {
    icon: 'CircleCheckBig', // Exitoso
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    title: 'Exitoso',
    textColor: '#2E7D32',
  },
  2: {
    icon: 'CircleX', // Con errores
    bg: '#FFE6E6',
    color: '#C62828',
    iconColor: '#C62828',
    title: 'Con errores',
    textColor: '#C62828',
  },
  3: {
    icon: 'CircleMinus', // N/A
    bg: '#FFF3CD',
    color: '#856404',
    iconColor: '#856404',
    title: 'N/A',
    textColor: '#856404',
  },
  4: {
    icon: 'CircleX', // Errado
    bg: '#FFE6E6',
    color: '#C62828',
    iconColor: '#C62828',
    title: 'Errado',
    textColor: '#C62828',
  },
  9: {
    icon: 'CircleHourglass', // Aprobado
    bg: '#FFF3CD',
    color: '#856404',
    iconColor: '#856404',
    title: 'Aprobado',
    textColor: '#856404',
  },
  10: {
    icon: 'CircleX', // Rechazado
    bg: '#FFE6E6',
    color: '#C62828',
    iconColor: '#C62828',
    title: 'Rechazado',
    textColor: '#C62828',
  },
  11: {
    icon: 'CircleX',
    title: 'Anulado', // Anulado
    bg: '#FFE6E6',
    color: '#C62828',
    iconColor: '#C62828',
    textColor: '#C62828',
  },
  24: {
    title: 'Procesado', // Procesado
    icon: 'CircleMinus',
    bg: '#FFF3CD',
    color: '#856404',
    iconColor: '#856404',
    textColor: '#856404',
  },
  25: {
    icon: 'CircleMinus', // Pendiente
    bg: '#FFF3CD',
    color: '#856404',
    iconColor: '#856404',
    title: 'Pendiente',
    textColor: '#856404',
  },
  55: {
    icon: 'Clock', // Por autorizar
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#333742',
    title: 'Por autorizar',
    textColor: '#333742',
  },
  63: {
    icon: 'CheckCircle', // Registrado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Registrado',
    textColor: '#E25D0F',
  },
  64: {
    title: 'Validado', // Validado
    icon: 'CircleCheckBig',
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    textColor: '#2E7D32',
  },

  66: {
    title: 'Generado', // Generado
    icon: 'CircleCheckBig',
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    textColor: '#2E7D32',
  },
  68: {
    icon: 'CircleCheckBig', // Procesado parcialmente
    bg: '#d3e6d3ff',
    color: '#0c490fff',
    iconColor: '#0c490fff',
    title: 'Procesado parcialmente',
    textColor: '#0c490fff',
  },
  69: {
    title: 'Impreso', // Impreso
    icon: 'PrinterCheck',
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    textColor: '#2E7D32',
  },
  71: {
    icon: 'CircleCheckBig', // Autorizado
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    title: 'Autorizado',
    textColor: '#2E7D32',
  },
  72: {
    title: 'Cargado', // Cargado
    icon: 'CloudUpload',
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    textColor: '#2E7D32',
  },
  73: {
    title: 'Cargado con errores', // Cargado con errores
    icon: 'CircleX',
    bg: '#FFE6E6',
    color: '#C62828',
    iconColor: '#C62828',
    textColor: '#C62828',
  },
  90: {
    title: 'Agrupado', // Agrupado
    icon: 'Group',
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    textColor: '#2E7D32',
  },
  96: {
    title: 'No impreso', // No impreso
    icon: 'CircleMinus',
    bg: '#FFF3CD',
    color: '#856404',
    iconColor: '#856404',
    textColor: '#856404',
  },
  97: {
    icon: 'CircleMinus', // Pre-cargado
    bg: '#FFF3CD',
    color: '#856404',
    iconColor: '#856404',
    title: 'Pre-cargado',
    textColor: '#856404',
  },
  98: {
    icon: 'Clock', // Validación errada
    bg: '#ddc5c5ff',
    color: '#333742',
    iconColor: '#68110eff',
    title: 'Validación errada',
    textColor: '#68110eff',
  },
  99: {
    icon: 'Clock', // Validado parcialmente
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#ED7D03',
    title: 'Validado parcialmente',
    textColor: '#ED7D03',
  },
  100: {
    title: 'Procesado con errores', // Procesado con errores
    icon: 'CircleX',
    bg: '#FFE6E6',
    color: '#C62828',
    iconColor: '#C62828',
    textColor: '#C62828',
  },
  101: {
    icon: 'CircleCheck', // Reimpreso
    bg: '#FFF3CD',
    color: '#856404',
    iconColor: '#856404',
    title: 'Reimpreso',
    textColor: '#856404',
  },
  109: {
    icon: 'CircleCheck', // Recibida
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    title: 'Recibida',
    textColor: '#2E7D32',
  },
  110: {
    icon: 'CircleX', // Rechazado
    bg: '#FFE6E6',
    color: '#C62828',
    iconColor: '#C62828',
    title: 'Rechazado',
    textColor: '#C62828',
  },
  111: {
    icon: 'CircleCheck', // Aprobación parcial
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    title: 'Aprobación parcial',
    textColor: '#2E7D32',
  },
  112: {
    icon: 'Clock', // Cargue Errado
    bg: '#f3e7deff',
    color: '#333742',
    iconColor: '#eda303ff',
    title: 'Cargue Errado',
    textColor: '#eda303ff',
  },
}
