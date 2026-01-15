import { ICardStatus } from '@/interfaces/global'

export const DEFAULT_STATUS_MAP: Record<number, ICardStatus> = {
  0: {
    icon: 'XCircle', // Sin definir
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2', // rgb(157, 158, 162)
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
  2: {
    icon: 'Ban', // Inactivo
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2', // rgb(157, 158, 162)
    title: 'Inactivo',
    textColor: '#9d9ea2',
  },
  3: {
    icon: 'UserSquare', // Nuevo
    bg: '#D8F0CB',
    color: '#333742',
    iconColor: '#305a38', // rgba(48, 90, 56, 1)
    title: 'Nuevo',
    textColor: '#305a38',
  },
  5: {
    icon: 'XCircle', // Devuelto
    bg: '#FFEAEB',
    color: '#333742',
    iconColor: '#D20008',
    title: 'Devuelto',
    textColor: '#D20008',
  },
  6: {
    icon: 'Send', // Enviado
    bg: '#FFEFDE',
    color: '#333742',
    iconColor: '#ED7D03',
    title: 'Enviado',
    textColor: '#ED7D03',
  },
  7: {
    icon: 'CheckCircle', // Finalizado
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Finalizado',
    textColor: '#39ba2e',
  },
  9: {
    icon: 'CheckCircle', // Aprobado
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Aprobado',
    textColor: '#39ba2e',
  },
  10: {
    icon: 'XCircle', // Rechazado
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07', // rgba(210,29,7,255)
    title: 'Rechazado',
    textColor: '#d21d07',
  },
  11: {
    icon: 'XCircle', // Anulado
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07', // rgba(210,29,7,255)
    title: 'Anulado',
    textColor: '#d21d07',
  },
  15: {
    icon: 'CheckCircle', // Recibido
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Recibido',
    textColor: '#39ba2e',
  },
  17: {
    icon: 'CheckCircle', // Bueno
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Bueno',
    textColor: '#39ba2e',
  },
  18: {
    icon: 'Clock', // Regular
    bg: '#f8f8c6',
    color: '#333742',
    iconColor: '#ecc508', // rgb(236,197,8)
    title: 'Regular',
    textColor: '#ecc508',
  },
  19: {
    icon: 'XCircle', // Malo
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07', // rgba(210,29,7,255)
    title: 'Malo',
    textColor: '#d21d07',
  },
  20: {
    icon: 'Clock', // Cargando
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Cargando',
    textColor: '#E25D0F',
  },
  29: {
    icon: 'CheckCircle', // Completado
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Completado',
    textColor: '#39ba2e',
  },
  30: {
    icon: 'XCircle', // Errores
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07', // rgba(210,29,7,255)
    title: 'Errores',
    textColor: '#d21d07',
  },
  // Depreciations:
  23: {
    icon: 'XCircle', // Reversado
    bg: '#FFE4CB',
    color: '#333742',
    iconColor: '#FF7C03',
    title: 'Reversado',
    textColor: '#FF7C03',
  },
  24: {
    icon: 'Clock', // Procesado
    bg: '#F9EBFF',
    color: '#333742',
    iconColor: '#7A00DA',
    title: 'Procesado',
    textColor: '#7A00DA',
  },
  25: {
    icon: 'Clock', // Pendiente
    bg: '#FFE7ED',
    color: '#333742',
    iconColor: '#8D1E3D',
    title: 'Pendiente',
    textColor: '#8D1E3D',
  },
  26: {
    icon: 'Clock', // En proceso
    bg: '#F9EBFF',
    color: '#333742',
    iconColor: '#7A00DA',
    title: 'En proceso',
    textColor: '#7A00DA',
  },
  32: {
    icon: 'XCircle', // Cerrado
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2', // rgb(157, 158, 162)
    title: 'Cerrado',
    textColor: '#9d9ea2',
  },
  37: {
    icon: 'CheckCircle', // Realizado
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Realizado',
    textColor: '#39ba2e',
  },
  38: {
    icon: 'Clock', // Pendiente - Depreciación
    bg: '#FFFAC0',
    color: '#333742',
    iconColor: '#EAC102',
    title: 'Pendiente - Depreciación',
    textColor: '#EAC102',
  },
  39: {
    icon: 'XCircle', // Cancelado
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07', // rgba(210,29,7,255)
    title: 'Cancelado',
    textColor: '#d21d07',
  },
  50: {
    icon: 'XCircle', // Enajenado
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07', // rgba(210,29,7,255)
    title: 'Enajenado',
    textColor: '#d21d07',
  },
  51: {
    icon: 'XCircle', // Bloqueado
    bg: '#F8DEE0',
    color: '#333742',
    iconColor: '#af0002', // rgba(175, 0, 2, 1)
    title: 'Bloqueado',
    textColor: '#af0002',
  },
  52: {
    icon: 'Minus', // Retirado
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2', // rgb(157, 158, 162)
    title: 'Retirado',
    textColor: '#9d9ea2',
  },
  53: {
    icon: 'Calendar', // Vacaciones
    bg: '#B1D4FF',
    color: '#333742',
    iconColor: '#003e89', // rgba(0, 62, 137, 1)
    title: 'Vacaciones',
    textColor: '#003e89',
  },
  54: {
    icon: 'Bookmark', // Directorio activo
    bg: '#B1D4FF',
    color: '#333742',
    iconColor: '#003e89', // rgba(0, 62, 137, 1)
    title: 'Directorio activo',
    textColor: '#003e89',
  },
  55: {
    icon: 'Clock', // Por autorizar
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2', // rgb(157, 158, 162)
    title: 'Por autorizar',
    textColor: '#9d9ea2',
  },
  56: {
    icon: 'Clock', // Pre operativo
    bg: '#FFE7ED',
    color: '#FFFF',
    iconColor: '#581845', // rgb(157, 158, 162)
    title: 'Preoperativo',
    textColor: '#000000',
  },
  57: {
    icon: 'CheckCircle', // Vigente
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Vigente',
    textColor: '#39ba2e',
  },
  58: {
    icon: 'XCircle', // Vencido
    bg: '#FFE6E2',
    color: '#333742',
    iconColor: '#B72D18',
    title: 'Vencido',
    textColor: '#D20008',
  },
  59: {
    icon: 'XCircle', // En liquidación
    bg: '#dcdcdc',
    color: '#333742',
    iconColor: '#9d9ea2',
    title: 'En liquidación',
    textColor: '#9d9ea2',
  },
  63: {
    icon: 'CheckCircle', // Registrado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Registrado',
    textColor: '#E25D0F',
  },
  60: {
    icon: 'XCircle', // Suspendido
    bg: '#FFE6E2',
    color: '#333742',
    iconColor: '#B72D18',
    title: 'Suspendido',
    textColor: '#D20008',
  },
  64: {
    icon: 'CheckCircle', // Validado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#ED7D03',
    title: 'Validado',
    textColor: '#ED7D03',
  },
  65: {
    icon: 'CheckCircle', // Actualizado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Actualizado',
    textColor: '#E25D0F',
  },
  67: {
    icon: 'SendHorizontal', // Liquidado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Liquidado',
    textColor: '#E25D0F',
  },
  68: {
    icon: 'SendHorizontal', // Parcialmente Procesado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Parcialmente Procesado',
    textColor: '#E25D0F',
  },
  69: {
    icon: 'CheckCircle', // Compra ETF's
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: "Compra ETF's",
    textColor: '#E25D0F',
  },
  70: {
    icon: 'CheckCircle', // Vendido ETF's
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: "Vendido ETF's",
    textColor: '#E25D0F',
  },
  71: {
    icon: 'CheckCircle', // Autorizado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Autorizado',
    textColor: '#E25D0F',
  },
  72: {
    icon: 'CheckCircle', // Cargado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Cargado',
    textColor: '#E25D0F',
  },
  73: {
    icon: 'XCircle', // Cargado con errores
    bg: '#FFE6E2',
    color: '#333742',
    iconColor: '#B72D18',
    title: 'Cargado con errores',
    textColor: '#D20008',
  },
  74: {
    icon: 'CheckCircle', // Reclamado
    bg: '#FFE7ED',
    color: '#FFE7ED',
    iconColor: '#8D1E3D',
    title: 'Reclamado',
    textColor: '#1A1A1A',
  },
  75: {
    icon: 'CheckCircle', // Renovado
    bg: '#FFE7ED',
    color: '#FFE7ED',
    iconColor: '#8D1E3D',
    title: 'Renovado',
    textColor: '#1A1A1A',
  },
  76: {
    icon: 'CheckCircle', // Liberado
    bg: '#FFE7ED',
    color: '#FFE7ED',
    iconColor: '#8D1E3D',
    title: 'Liberado',
    textColor: '#1A1A1A',
  },
  77: {
    icon: 'CheckCircle', // Ejecutado
    bg: '#FFE7ED',
    color: '#FFE7ED',
    iconColor: '#8D1E3D',
    title: 'Ejecutado',
    textColor: '#1A1A1A',
  },
  78: {
    icon: 'Clock', // En planeación
    bg: '#FFE7ED',
    color: '#FFE7ED',
    iconColor: '#8D1E3D',
    title: 'En planeación',
    textColor: '#1A1A1A',
  },
  79: {
    icon: 'Clock', // En ejecución
    bg: '#FFE7ED',
    color: '#FFE7ED',
    iconColor: '#8D1E3D',
    title: 'En ejecución',
    textColor: '#1A1A1A',
  },
  80: {
    icon: 'Clock', // En preventa
    bg: '#FFE7ED',
    color: '#FFE7ED',
    iconColor: '#8D1E3D',
    title: 'En preventa',
    textColor: '#1A1A1A',
  },
  81: {
    icon: 'CheckCircle', // Terminado
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Terminado',
    textColor: '#39ba2e',
  },
  82: {
    icon: 'Clock', // Por gestionar
    bg: '#F9EBFF',
    color: '#333742',
    iconColor: '#7A00DA',
    title: 'Por gestionar',
    textColor: '#7A00DA',
  },
  83: {
    icon: 'Clock', // Disponible
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Disponible',
    textColor: '#E25D0F',
  },
  84: {
    icon: 'XCircle', // Fallido
    bg: '#FFE7ED',
    color: '#FFFF',
    iconColor: '#581845',
    title: 'Fallido',
    textColor: '#000000',
  },
  85: {
    icon: 'CheckCircle', // Generado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Generado',
    textColor: '#E25D0F',
  },
  86: {
    icon: 'XCircle', // Proceso de homologación fallido
    bg: '#FFE7ED',
    color: '#FFFF',
    iconColor: '#581845',
    title: 'Homologación fallida',
    textColor: '#000000',
  },
  87: {
    icon: 'SendHorizontal', // Registro de homologación exitoso
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Homologado',
    textColor: '#E25D0F',
  },
  88: {
    icon: 'Clock', // Registro de homologación fallido
    bg: '#FFE7ED',
    color: '#FFFF',
    iconColor: '#581845', // rgb(157, 158, 162)
    title: 'Sin homologar',
    textColor: '#000000',
  },
  89: {
    icon: 'SendHorizontal', // Registro de homologación eliminada
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Registro de homologación eliminada',
    textColor: '#E25D0F',
  },
  90: {
    icon: 'SendHorizontal', // Liquidado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Parcialmente homologado',
    textColor: '#E25D0F',
  },
  91: {
    icon: 'Ban', // Desistido
    bg: '#FFE6E2',
    color: '#333742',
    iconColor: '#B72D18',
    title: 'Desistido',
    textColor: '#D20008',
  },
  92: {
    icon: 'CheckCircle', // Pagada
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Pagada',
    textColor: '#E25D0F',
  },
  93: {
    icon: 'CheckCircle', // Amortizada
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Amortizada',
    textColor: '#E25D0F',
  },
  94: {
    icon: 'CheckCircle', // Reservado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Reservado',
    textColor: '#E25D0F',
  },
  95: {
    icon: 'CheckCircle', // Vendido
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Vendido',
    textColor: '#E25D0F',
  },
  102: {
    icon: 'CheckCircle', // Aplicado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Aplicado',
    textColor: '#E25D0F',
  },
  103: {
    icon: 'CheckCircle', // Debitado
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Debitado',
    textColor: '#E25D0F',
  },
  104: {
    icon: 'CheckCircle', // Exitoso
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Exitoso',
    textColor: '#E25D0F',
  },
  105: {
    icon: 'XCircle',
    bg: '#fbebec',
    color: '#333742',
    iconColor: '#d21d07',
    title: 'Con errores',
    textColor: '#d21d07',
  },
  113: {
    icon: 'CheckCircle', // Levantado
    bg: '#e7ffe4',
    color: '#333742',
    iconColor: '#39ba2e',
    title: 'Levantado',
    textColor: '#39ba2e',
  },
  114: {
    icon: 'Clock', // Levantamiento temporal
    bg: '#FFEEE3',
    color: '#333742',
    iconColor: '#E25D0F',
    title: 'Levantamiento temporal',
    textColor: '#E25D0F',
  },
}
