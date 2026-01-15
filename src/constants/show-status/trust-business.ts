import {
  BalancePointStatusID,
  ICardStatus,
  TrustBusinessStatusID,
  PaymentPlanStatusID,
  ProjectStatusID,
} from '@/interfaces/global'

export const TRUST_BUSINESS_STATUS_MAP: Record<number, ICardStatus> = {
  [TrustBusinessStatusID.PREOPERATIONAL]: {
    icon: 'Clock', // Preoperativo
    bg: '#FFE7ED',
    color: '#000',
    iconColor: '#8D1E3D',
    title: 'Preoperativo',
    textColor: '#000',
  },
  [TrustBusinessStatusID.VALID]: {
    icon: 'CircleCheck', // Vigente
    bg: '#FFEEE3',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'Vigente',
    textColor: '#000',
  },
  [TrustBusinessStatusID.EXPIRED]: {
    icon: 'XCircle', // Expirado
    bg: '#FFE6E2',
    color: '#000',
    iconColor: '#B72D18',
    title: 'Vencido',
    textColor: '#000',
  },
  [TrustBusinessStatusID.LIQUIDATION]: {
    icon: 'XCircle', // En liquidación
    bg: '#FFEFDE',
    color: '#000',
    iconColor: '#ED7D03',
    title: 'En liquidación',
    textColor: '#000',
  },
  [TrustBusinessStatusID.SUSPENDED]: {
    icon: 'Ban', // Suspendido
    bg: '#DCDCDC',
    color: '#000',
    iconColor: '#9D9EA2',
    title: 'Suspendido',
    textColor: '#000',
  },
  [TrustBusinessStatusID.LIQUIDATED]: {
    icon: 'CircleCheck', // Liquidado
    bg: '#FFEFDE',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'Liquidado',
    textColor: '#000',
  },
}

export const BALANCE_POINT_STATUS_MAP: Record<number, ICardStatus> = {
  [BalancePointStatusID.AUTHORIZED]: {
    icon: 'CircleCheck', // Autorizado
    bg: '#FFEEE3',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'Autorizado',
    textColor: '#000',
  },
  [BalancePointStatusID.REGISTERED]: {
    icon: 'CircleCheck', // Registrado
    bg: '#FFEEE3',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'Registrado',
    textColor: '#000',
  },
  [BalancePointStatusID.REJECTED]: {
    icon: 'XCircle', // Rechazado
    bg: '#FFE6E2',
    color: '#000',
    iconColor: '#B72D18',
    title: 'Rechazado',
    textColor: '#000',
  },
}

export const PROJECT_STATUS_MAP: Record<number, ICardStatus> = {
  [ProjectStatusID.REGISTERED]: {
    icon: 'CircleCheck', // Registrado
    bg: '#FFEEE3',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'Registrado',
    textColor: '#000',
  },
  [ProjectStatusID.AVAILABLE]: {
    icon: 'CircleCheck', // Disponible
    bg: '#FFEEE3',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'Disponible',
    textColor: '#000',
  },
  [ProjectStatusID.PENDING]: {
    icon: 'Clock', // Por gestionar
    bg: '#FFE7ED',
    color: '#000',
    iconColor: '#8D1E3D',
    title: 'Por gestionar',
    textColor: '#000',
  },
  [ProjectStatusID.FINISHED]: {
    icon: 'CircleCheck', // Terminado
    bg: '#FFEFDE',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'Terminado',
    textColor: '#000',
  },
  [ProjectStatusID.PRE_SALE]: {
    icon: 'Clock', // En preventa
    bg: '#FFE7ED',
    color: '#000',
    iconColor: '#8D1E3D',
    title: 'En preventa',
    textColor: '#000',
  },
  [ProjectStatusID.IN_PROGRESS]: {
    icon: 'CircleCheck', // En ejecución
    bg: '#FFEFDE',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'En ejecución',
    textColor: '#000',
  },
  [ProjectStatusID.PLANNING]: {
    icon: 'Clock', // En planeación
    bg: '#FFE7ED',
    color: '#000',
    iconColor: '#8D1E3D',
    title: 'En planeación',
    textColor: '#000',
  },
  [ProjectStatusID.SUSPENDED]: {
    icon: 'Ban', // Suspendido
    bg: '#DCDCDC',
    color: '#000',
    iconColor: '#9D9EA2',
    title: 'Suspendido',
    textColor: '#000',
  },
}

export const PAYMENT_PLAN_STATUS_MAP: Record<number, ICardStatus> = {
  [PaymentPlanStatusID.AMORTIZED]: {
    icon: 'CircleCheck', // Amortizada
    bg: '#FFEEE3',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'Amortizada',
    textColor: '#000',
  },
  [PaymentPlanStatusID.PAID]: {
    icon: 'CircleCheck', // Pagado
    bg: '#FFEEE3',
    color: '#000',
    iconColor: '#E25D0F',
    title: 'Pagado',
    textColor: '#000',
  },
  [PaymentPlanStatusID.OVERDUE]: {
    icon: 'XCircle', // Vencido
    bg: '#FFE6E2',
    color: '#000',
    iconColor: '#B72D18',
    title: 'Vencido',
    textColor: '#000',
  },
  [PaymentPlanStatusID.CANCELED]: {
    icon: 'XCircle', // Cancelado
    bg: '#FFE6E2',
    color: '#000',
    iconColor: '#B72D18',
    title: 'Cancelado',
    textColor: '#000',
  },
  [PaymentPlanStatusID.PENDING]: {
    icon: 'Clock', // Pendiente
    bg: '#FFE7ED',
    color: '#000',
    iconColor: '#8D1E3D',
    title: 'Pendiente',
    textColor: '#000',
  },
}
