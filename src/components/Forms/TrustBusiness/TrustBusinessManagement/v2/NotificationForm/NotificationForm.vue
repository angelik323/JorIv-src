<template>
  <section v-if="!isLoading">
    <TableCommon
      :data="notify_data_raw"
      :action="action"
      :title="'Notificaciones'"
      @update:models="(val) => updateModels('Notificación', val)"
    />

    <TableCommon
      :data="authorize_data_raw"
      :action="action"
      :title="'Autorizaciones'"
      @update:models="(val) => updateModels('Autorización', val)"
    />
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data?: ITrustbusinessNotificationForm | null
    action: ActionType
  }>(),
  {}
)

const emits =
  defineEmits<
    (e: 'update:models', value: ITrustbusinessNotificationForm) => void
  >()

// components
import TableCommon from '@/components/Forms/TrustBusiness/TrustBusinessManagement/v2/NotificationForm/TableCommon/TableCommon.vue'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { ITrustbusinessNotificationForm } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// logic-view
import useNotificationForm from './NotificationForm'

const {
  notify_data_raw,
  authorize_data_raw,
  isLoading,
  updateModels,
  validateForm,
} = useNotificationForm(props, emits)

defineExpose({
  validateForm,
})
</script>
