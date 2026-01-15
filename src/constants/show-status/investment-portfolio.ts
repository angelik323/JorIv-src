import { ICardStatus } from '@/interfaces/global'

export const INVESTMENT_PORTFOLIO_STATUS_MAP: Record<number, ICardStatus> = {
  0: {
    icon: 'XCircle',
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: 'rgb(157, 158, 162)',
    title: 'Sin definir',
    textColor: '#9d9ea2',
  },
  1: {
    icon: 'CheckCircle', // Activo
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Activo',
    textColor: '#E25D0F',
  },
  65: {
    icon: 'Clock', // Pendiente
    bg: '#FFE7ED',
    color: '#333742',
    iconColor: '#8D1E3D',
    title: 'Pendiente',
    textColor: '#8D1E3D',
  },
  66: {
    icon: 'XCircle', // Con error
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07',
    title: 'Con error',
    textColor: '#d21d07',
  },
  67: {
    icon: 'CheckCircle', // Exitoso
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Exitoso',
    textColor: '#E25D0F',
  },
  68: {
    icon: 'Clock', // Cargando
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Cargando',
    textColor: '#E25D0F',
  },
  81: {
    icon: 'CheckCircle', // Englobado
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Englobado',
    textColor: '#39ba2e',
  },
  72: {
    icon: 'CheckCircle', // Fraccionado
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Fraccionado',
    textColor: '#39ba2e',
  },
  82: {
    icon: 'Clock', // Por liquidar
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Por liquidar',
    textColor: '#E25D0F',
  },
  83: {
    icon: 'CheckCircle', // Liquidado
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Liquidado',
    textColor: '#39ba2e',
  },
}
