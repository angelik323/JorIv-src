// Vue - Router
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

// Interfaces
import { ICalendarEventView } from '@/interfaces/customs/agenda/CalendarEvents'
import { ITabs } from '@/interfaces/customs/Tab'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCalendarEventsStore } from '@/stores/agenda/calendar-events'

const useCalendarEventView = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _getByIdAction } = useCalendarEventsStore('v1')

  const isLoaded = ref(false)

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
  ])

  const headerProperties = {
    title: 'Ver configuración de agenda',
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
        label: 'Ver',
        route: 'CalendarEventView',
      },
      {
        label: id,
      },
    ],
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

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

  const handleGoToList = () => goToURL('CalendarEventList')

  onMounted(async () => await loadData())

  return {
    tabs,
    isLoaded,
    tabActive,
    initialData,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
  }
}

export default useCalendarEventView
