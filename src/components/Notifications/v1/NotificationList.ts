import { NotificationListProps } from '@/interfaces/global'
import { ref, watch } from 'vue'

import { useNotificationsStore } from '@/stores'
import { storeToRefs } from 'pinia'

import { useMainLoader } from '@/composables'

const useNotificationList = (
  props: Readonly<NotificationListProps>,
  emits: Function
) => {
  const notificationsStore = useNotificationsStore('v1')
  const { notifications, loading } = storeToRefs(notificationsStore)
  const {
    _getListAction,
    _deleteNotificationAction,
    _getCountPendingNotifications,
  } = notificationsStore

  const { openMainLoader } = useMainLoader()

  const openPanelNotification = ref(false)
  const isLoading = ref(false)

  const onLoadNotifications = async (
    index: number,
    done: (finished?: boolean) => void
  ) => {
    if (isLoading.value) {
      done(true)
      return
    }
    isLoading.value = true

    try {
      const prevLength = notifications.value.length
      await _getListAction(index)
      done(notifications.value.length === prevLength)
    } catch (error) {
      done(true)
    } finally {
      isLoading.value = false
    }
  }

  const onDeleteNotification = async (id: number) => {
    openMainLoader(true)
    await _deleteNotificationAction(id)
    await _getCountPendingNotifications()
    openMainLoader(false)
  }

  const onConfirmNotification = async (id: number) => {
    openMainLoader(true)
    await notificationsStore._confirmNotificationAction(id)
    openMainLoader(false)
  }

  watch(
    () => props.open,
    (val) => {
      openPanelNotification.value = !!val
      emits('update:open', true)
    }
  )

  return {
    notifications,
    openPanelNotification,
    loading,

    // Methods
    onLoadNotifications,
    onDeleteNotification,
    onConfirmNotification,
  }
}

export default useNotificationList
