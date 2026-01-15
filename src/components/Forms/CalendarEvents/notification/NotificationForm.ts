// Vue - Pinia
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { TIMEOUT_ALERT } from '@/constants/alerts'
import { ActionType } from '@/interfaces/global'
import {
  IFormNotification,
  ICalendarEventView,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Composables
import { useAlert, useUtils } from '@/composables'

// Stores
import { useScheduleResourceStore } from '@/stores/resources-manager/schedules'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useNotificationsForm = (props: {
  formType: 'notification' | 'confirmation'
  action: ActionType
  data?: IFormNotification | ICalendarEventView
  tabActive?: string
  excludeIdsUsers: number[]
}) => {
  const {
    users_by_name: usersSelect,
    business: businessSelect,
    role: roleSelect,
  } = storeToRefs(useScheduleResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()

  const notificationFormRef = ref()
  const isLoadingUsers = ref(false)
  const emailInputValue = ref('')

  const notificationData = ref<IFormNotification>({
    users: [],
    roles: [],
    business: [],
    emails: [],
  })

  const notificationDataSelect = ref<IFormNotification>({
    users: [],
    roles: [],
    business: [],
    emails: [],
  })

  const hasNotificationData = computed(() => {
    return (
      notificationData.value.users?.length === 0 &&
      notificationData.value.roles?.length === 0 &&
      notificationData.value.business?.length === 0 &&
      notificationDataSelect.value.emails?.length === 0
    )
  })

  const loadEventData = () => {
    if (props.action !== 'create' && props.data) {
      const data = props.data as ICalendarEventView

      if (props.formType === 'notification') {
        notificationData.value.users = data.notifications?.users ?? []
        notificationData.value.roles = data.notifications?.roles ?? []
        notificationData.value.business = data.notifications?.business ?? []
        notificationDataSelect.value.emails = data.notifications?.emails ?? []

        props.excludeIdsUsers?.splice(
          0,
          props.excludeIdsUsers.length,
          ...notificationData.value.users.map((u) => u.id)
        )
      } else {
        notificationData.value.users = data.confirmations?.users ?? []
        notificationData.value.roles = data.confirmations?.roles ?? []
        notificationData.value.business = data.confirmations?.business ?? []
        notificationDataSelect.value.emails = data.confirmations?.emails ?? []
      }
    }
  }

  const onUserSearch = async (searchTerm: string) => {
    isLoadingUsers.value = true

    const excludeQuery =
      props.formType === 'confirmation' && props.excludeIdsUsers?.length
        ? `filter[exclude_ids]=${props.excludeIdsUsers.join(',')}&`
        : ''

    try {
      await _getResources(
        { schedule: ['users_by_name'] },
        `${
          searchTerm
            ? `filter[full_name]=${encodeURIComponent(searchTerm)}&`
            : ''
        }${excludeQuery}users_by_name_limit=10`
      )
    } finally {
      isLoadingUsers.value = false
    }
  }

  const onEmailsChange = (val: { name: string; id: number }[]) => {
    const namesToRemove = new Set(val.map((v) => v.name))

    notificationDataSelect.value.emails =
      notificationDataSelect.value.emails.filter((email) =>
        namesToRemove.has(email)
      )
  }

  const handleUpdateEmails = () => {
    const email = emailInputValue.value.trim()

    if (!email) return

    if (notificationDataSelect.value.emails.includes(email)) {
      showAlert(
        'El correo ingresado ya existe en la lista.',
        'warning',
        undefined,
        TIMEOUT_ALERT
      )
      return
    }

    notificationDataSelect.value.emails.push(email)
    emailInputValue.value = ''
  }

  const validateForm = async () => {
    const hasUsers = notificationData.value.users?.length > 0
    const hasRoles = notificationData.value.roles?.length > 0
    const hasBusiness = notificationData.value.business?.length > 0
    const hasEmail = notificationDataSelect.value.emails?.length > 0

    const hasAtLeastOne = hasUsers || hasRoles || hasBusiness || hasEmail

    if (!hasAtLeastOne) {
      showAlert(
        'Debe seleccionar a quién desea notificar el evento',
        'error',
        undefined,
        TIMEOUT_ALERT
      )
      return false
    }

    return true
  }

  const handlerExcludeIdsUser = (val: { id: number; name: string }[]) => {
    notificationData.value.users = val

    if (props.formType === 'notification') {
      props.excludeIdsUsers.splice(
        0,
        props.excludeIdsUsers.length,
        ...val.map((v) => v.id)
      )
    }

    return notificationData.value.users
  }
  const formRefName = computed(() =>
    props.formType === 'confirmation'
      ? 'confirmationFormRef'
      : 'notificationFormRef'
  )

  const emailsDefaultValue = computed(() =>
    notificationDataSelect.value.emails.map((email) => ({
      id: email,
      name: email,
    }))
  )

  watch(usersSelect, (val) => {
    const options = val ?? []

    const merged = [
      ...new Map(
        [...notificationData.value.users, ...options].map((u) => [u.id, u])
      ).values(),
    ]

    notificationDataSelect.value.users = merged
  })

  watch(roleSelect, (val) => (notificationDataSelect.value.roles = val ?? []))
  watch(
    businessSelect,
    (val) => (notificationDataSelect.value.business = val ?? [])
  )

  watch(
    () => props.data,
    () => {
      if (props.action !== 'create') loadEventData()
    },
    { immediate: true }
  )

  watch(
    () => props.excludeIdsUsers && props.excludeIdsUsers.slice(),
    async () => {
      const excludeIds = new Set(props.excludeIdsUsers || [])

      if (props.formType === 'confirmation') {
        await _getResources(
          { schedule: ['users_by_name'] },
          `filter[exclude_ids]=${props.excludeIdsUsers.join(
            ','
          )}&users_by_name_limit=10`
        )

        notificationData.value.users = (
          notificationData.value.users || []
        ).filter((u: { id: number }) => !excludeIds.has(u.id))

        notificationDataSelect.value.users = (
          notificationDataSelect.value.users || []
        ).filter((u: { id: number }) => !excludeIds.has(u.id))
      }
    },
    { immediate: true }
  )
  return {
    roleSelect,
    formRefName,
    onUserSearch,
    validateForm,
    onEmailsChange,
    isLoadingUsers,
    emailInputValue,
    notificationData,
    emailsDefaultValue,
    defaultIconsLucide,
    handleUpdateEmails,
    notificationFormRef,
    hasNotificationData,
    handlerExcludeIdsUser,
    notificationDataSelect,
  }
}

export default useNotificationsForm
