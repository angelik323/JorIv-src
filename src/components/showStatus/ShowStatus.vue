<script setup lang="ts">
import { ICardStatus } from '@/interfaces/global'
import { computed } from 'vue'
import Icon from '@/components/common/Icon/Icon.vue'

const statusProps = withDefaults(
  defineProps<{
    type: number
    classCustom?: string
    clickable?: boolean
    statusType?: 'default' | 'financial/obligations' | 'custom/status'
    labelName?: string
  }>(),
  {
    clickable: false,
    statusType: 'default',
    labelName: 'Sin definir',
  }
)

const emits = defineEmits(['click'])

const showCardStyled = (
  currentType: 'default' | 'financial/obligations' | 'custom/status'
) => {
  if (currentType === 'default') {
    const cardStyles: Record<number, ICardStatus> = {
      0: {
        icon: 'XCircle', // Sin definir
        bg: '#dcdcdc',
        color: '#333742',
        iconColor: '#9d9ea2', // rgb(157, 158, 162)
        title: statusProps.labelName,
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
      34: {
        icon: 'CheckCircle', // Programado
        bg: '#e7ffe4',
        color: '#333742',
        iconColor: '#39ba2e',
        title: 'Programado',
        textColor: '#39ba2e',
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
      64: {
        icon: 'CheckCircle', // Validado
        bg: '#FFEEE3',
        color: '#333742',
        iconColor: '#E25D0F',
        title: 'Validado',
        textColor: '#E25D0F',
      },
      65: {
        icon: 'CheckCircle', // Actualizado
        bg: '#FFEEE3',
        color: '#333742',
        iconColor: '#E25D0F',
        title: 'Actualizado',
        textColor: '#E25D0F',
      },
      71: {
        icon: 'CheckCircle', // Autorizado
        bg: '#e7ffe4',
        color: '#333742',
        iconColor: '#39ba2e',
        title: 'Autorizado',
        textColor: '#39ba2e',
      },
      72: {
        icon: 'XCircle', // Error
        bg: '#F8DEE0',
        color: '#333742',
        iconColor: '#af0002', // rgba(175, 0, 2, 1)
        title: 'Error',
        textColor: '#af0002',
      },
      74: {
        icon: 'Clock', // Autorizado parcialmente
        bg: '#FFE7ED',
        color: '#333742',
        iconColor: '#8D1E3D',
        title: 'Autorizado parcialmente',
        textColor: '#8D1E3D',
      },
      75: {
        icon: 'CheckCircle', // Exitoso
        bg: '#e7ffe4',
        color: '#333742',
        iconColor: '#39ba2e',
        title: 'Exitoso',
        textColor: '#39ba2e',
      },
      76: {
        icon: 'CheckCircle', // Validado
        bg: '#e7ffe4',
        color: '#333742',
        iconColor: '#39ba2e',
        title: 'Validado',
        textColor: '#39ba2e',
      },
      105: {
        icon: 'XCircle', // Con error
        bg: '#F8DEE0',
        color: '#333742',
        iconColor: '#af0002',
        title: 'Con error',
        textColor: '#af0002',
      },
      107: {
        icon: 'CheckCircle', // Exitoso
        bg: '#e7ffe4',
        color: '#333742',
        iconColor: '#39ba2e',
        title: 'Exitoso',
        textColor: '#39ba2e',
      },
    }
    return cardStyles
  }
  if (currentType === 'financial/obligations') {
    const cardStyles: Record<number, ICardStatus> = {
      0: {
        icon: 'XCircle',
        bg: '#dcdcdc',
        color: '#333742',
        iconColor: 'rgb(157, 158, 162)',
        title: 'Sin definir',
        textColor: '#9d9ea2',
      },
      1: {
        icon: 'Clock',
        bg: '#FFF3E0',
        color: '#212121',
        iconColor: '#FF9800',
        title: 'Pendiente',
        textColor: '#FF9800',
      },
      2: {
        icon: 'CheckCircle',
        bg: '#D8F0CB',
        color: '#333742',
        iconColor: 'rgba(48, 90, 56, 1)',
        title: 'Pagada',
        textColor: '#305a38',
      },
      3: {
        icon: 'Minus',
        bg: '#FFEAEB',
        color: '#333742',
        iconColor: '#D20008',
        title: 'Vencida',
        textColor: '#D20008',
      },
      4: {
        icon: 'Bookmark',
        bg: '#B1D4FF',
        color: '#333742',
        iconColor: 'rgba(0, 62, 137, 1)',
        title: 'Amortizada',
        textColor: '#003e89',
      },
      5: {
        icon: 'XCircle',
        bg: '#FFEEE3',
        color: '#333742',
        iconColor: '#E25D0F',
        title: 'Cancelada',
        textColor: '#E25D0F',
      },
    }
    return cardStyles
  }

  if (currentType === 'custom/status') {
    const capitalize = (text: string): string =>
      text.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
    return {
      icon: 'XCircle',
      bg: '#D3E3EA',
      color: '#545C60',
      iconColor: '#545C60',
      title: capitalize(statusProps.labelName) ?? 'Sin definir',
      textColor: '#545C60',
    }
  }
}
const getStatusProps = computed(() => showCardStyled(statusProps.statusType))

const currentStatus = computed<ICardStatus>(() => {
  const statusMap = getStatusProps.value ?? {}
  if (typeof statusMap === 'object' && statusMap !== null && '0' in statusMap) {
    return statusMap[statusProps.type as number] ?? statusMap[0]
  }
  return statusMap as ICardStatus
})
</script>

<template>
  <q-chip
    v-if="statusProps.type"
    dense
    :class="classCustom"
    :style="{
      background: currentStatus.bg,
      color: currentStatus.color,
      borderRadius: '50px',
      fontWeight: '500',
    }"
    :title="currentStatus.title"
    :clickable="clickable"
    @click="$emit('click')"
  >
    <p
      class="q-mb-none status__title"
      :style="{ color: currentStatus.textColor }"
    >
      {{ currentStatus.title }}
    </p>
    <Icon
      :name="currentStatus.icon"
      :color="currentStatus.iconColor"
      :size="18"
      class="q-ml-sm"
    />
  </q-chip>

  <q-chip
    v-else
    dense
    :style="{
      background: currentStatus.bg,
      color: currentStatus.color,
      padding: '0 8px',
      borderRadius: '50px',
      fontWeight: '500',
    }"
    :title="currentStatus.title"
  >
    <p class="q-mb-none status__title">{{ currentStatus.title }}</p>
    <Icon
      :name="currentStatus.icon"
      :color="currentStatus.iconColor"
      :size="18"
      class="q-ml-sm"
    />
  </q-chip>
</template>
