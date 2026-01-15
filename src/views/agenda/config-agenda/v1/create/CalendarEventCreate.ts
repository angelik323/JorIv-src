// Vue
import { computed, watch, ref, onMounted, onBeforeUnmount } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICalendarEvent,
  IFormInformation,
  IFormNotification,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Utils
import { formatDateTime } from '@/utils'

// Stores
import { useCalendarEventsStore } from '@/stores/agenda/calendar-events'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCalendarEventCreate = () => {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction } = useCalendarEventsStore('v2')

  const notificationFormRef = ref()
  const confirmationFormRef = ref()
  const informationFormRef = ref()
  const excludeIdsUsers = ref<number[]>([])

  const keys = ['users_by_name', 'business', 'role']

  const headerProperties = {
    title: 'Crear configuración de agenda',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Agenda y notificaciones',
      },
      {
        label: 'Configurar agenda',
        route: 'CalendarEventList',
      },
      {
        label: 'Crear',
        route: 'CalendarEventCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'notification',
      label: 'Notificación',
      icon: defaultIconsLucide.bell,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'confirmation',
      label: 'Confirmación',
      icon: defaultIconsLucide.checkCircle,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    let nextIdx = tabActiveIdx.value + 1

    if (
      filteredTabs.value[nextIdx]?.name === 'confirmation' &&
      !informationFormRef.value?.getValues().required_confirm
    ) {
      nextIdx++
    }

    if (nextIdx < filteredTabs.value.length) {
      tabActiveIdx.value = nextIdx
      tabActive.value = filteredTabs.value[nextIdx].name
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const validateForms = async () => {
    if (tabActive.value === 'information') {
      return await informationFormRef.value?.validateForm()
    } else if (tabActive.value === 'notification') {
      return await notificationFormRef.value?.validateForm()
    } else if (tabActive.value === 'confirmation') {
      return await confirmationFormRef.value?.validateForm()
    }
    return true
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const info: IFormInformation = informationFormRef.value?.getValues()
    const notif: IFormNotification = notificationFormRef.value?.getValues()
    const confirm: IFormNotification = confirmationFormRef.value?.getValues()

    const today = formatDate(new Date().toISOString(), 'YYYY-MM-DD')

    if (info.start_date === today) {
      const now = new Date()
      const [h, m] = info.start_time.split(':').map(Number)

      if (h * 60 + m < now.getHours() * 60 + now.getMinutes()) {
        showAlert(
          'La hora de inicio no puede ser menor a la hora actual.',
          'error',
          undefined,
          3000
        )
        return
      }
    }

    const payload: ICalendarEvent = {
      title: info.title,
      description: info.description,
      repeat: info.repeat,
      start_date: formatDateTime(info.start_date, info.start_time),
      end_date: formatDateTime(info.end_date, info.end_time),
      required_confirm: info.required_confirm,

      notifications: {
        users: notif.users.map((u) => u.id),
        roles: notif.roles.map((r) => r.id),
        business: notif.business.map((b) => b.id),
        emails: notif.emails,
      },
    }

    if (info.required_confirm) {
      payload.confirmations = {
        users: confirm.users.map((u) => u.id),
        roles: confirm.roles.map((r) => r.id),
        business: confirm.business.map((b) => b.id),
        emails: confirm.emails,
      }
    }

    openMainLoader(true)

    const success = await _createAction(payload)

    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () => goToURL('CalendarEventList')

  watch(
    () => informationFormRef.value?.getValues().required_confirm,
    (newVal) => {
      const confirmationTab = tabs.value.find((t) => t.name === 'confirmation')
      if (confirmationTab) {
        confirmationTab.show = !!newVal
      }
    }
  )

  onMounted(async () => {
    await _getResources(
      { schedule: ['users_by_name'] },
      'filter[exclude_ids]=1,5&users_by_name_limit=10'
    )

    await _getResources({ schedule: ['business', 'roles'] })
  })

  onBeforeUnmount(() => _resetKeys({ schedule: keys }))

  return {
    nextTab,
    backTab,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    handleGoToList,
    excludeIdsUsers,
    headerProperties,
    handleSubmitForm,
    defaultIconsLucide,
    informationFormRef,
    notificationFormRef,
    confirmationFormRef,
  }
}

export default useCalendarEventCreate
