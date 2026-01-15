import { ICardStatus } from '@/interfaces/global'

const REGISTER_STATUS: ICardStatus = {
  title: '',
  icon: 'CircleChevronRight',
  bg: '#FFEFDE',
  color: '#975003',
  iconColor: '#975003',
  textColor: '#975003',
}

export const FIXED_ASSETS_MAP: Record<number, ICardStatus> = {
  // Estados de registro de activos
  55: { ...REGISTER_STATUS, title: 'En uso' },
  56: { ...REGISTER_STATUS, title: 'No uso' },
  57: { ...REGISTER_STATUS, title: 'Dado de baja' },
  58: { ...REGISTER_STATUS, title: 'Mantenimiento' },
  59: { ...REGISTER_STATUS, title: 'En traslado' },
  60: { ...REGISTER_STATUS, title: 'Arrendamiento' },
  61: { ...REGISTER_STATUS, title: 'Venta' },
  62: { ...REGISTER_STATUS, title: 'Garantía' },
  63: { ...REGISTER_STATUS, title: 'Custodia' },

  // Estados de importación masiva
  66: {
    title: 'Con errores',
    icon: 'CircleX',
    bg: '#FFE6E6',
    color: '#C62828',
    iconColor: '#C62828',
    textColor: '#C62828',
  },
  67: {
    icon: 'CircleCheckBig',
    bg: '#D4F7D4',
    color: '#2E7D32',
    iconColor: '#2E7D32',
    title: 'Exitoso',
    textColor: '#2E7D32',
  },
  68: {
    icon: 'Clock',
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#ED7D03',
    title: 'Cargando',
    textColor: '#ED7D03',
  },
}
