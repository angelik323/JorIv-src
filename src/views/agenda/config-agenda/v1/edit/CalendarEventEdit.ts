// Vue - Router
import { computed, watch, ref, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICalendarEvent,
  IFormInformation,
  IFormNotification,
  ICalendarEventView,
} from '@/interfaces/customs/agenda/CalendarEvents'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Utils
import { formatDateTime } from '@/utils'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useCalendarEventsStore } from '@/stores/agenda/calendar-events'

const useCalendarEventEdit = () => {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const route = useRoute()

  const { _getByIdAction } = useCalendarEventsStore('v1')
  const { _updateAction } = useCalendarEventsStore('v2')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const notificationFormRef = ref()
  const confirmationFormRef = ref()
  const excludeIdsUsers = ref<number[]>([])

  const isLoaded = ref(false)

  const keys = ['users_by_name', 'business', 'role']

  const id = route.params.id as string

  const initialData = ref<
    ICalendarEventView & {
      start_time?: string
      end_time?: string
    }
  >({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    repeat: '',
    required_confirm: false,
    notifications: {
      users: [],
      roles: [],
      business: [],
      emails: [],
    },
    confirmations: {
      users: [],
      roles: [],
      business: [],
      emails: [],
    },
  })

  const headerProperties = computed(() => ({
    title: 'Editar configuración de agenda',
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
        label: 'Editar',
        route: 'CalendarEventEdit',
      },
      {
        label: id,
      },
    ],
  }))

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
      show: false,
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

  const modelForm = computed(() => initialData.value as ICalendarEventView)

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

  const loadData = async () => {
    openMainLoader(true)

    const success = await _getByIdAction(id)

    if (success) {
      initialData.value = success
      isLoaded.value = true
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
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
      id: Number(id),
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

    const success = await _updateAction(payload)

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

  onMounted(() => loadData())

  onMounted(async () => {
    await _getResources(
      { schedule: ['users_by_name'] },
      'users_by_name_limit=10'
    )

    await _getResources({ schedule: ['business', 'roles'] })

    await loadData()
  })

  onBeforeMount(() => _resetKeys({ schedule: keys }))

  return {
    nextTab,
    backTab,
    isLoaded,
    tabActive,
    modelForm,
    filteredTabs,
    tabActiveIdx,
    handleGoToList,
    excludeIdsUsers,
    handleSubmitForm,
    headerProperties,
    defaultIconsLucide,
    informationFormRef,
    notificationFormRef,
    confirmationFormRef,
  }
}

export default useCalendarEventEdit
