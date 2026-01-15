// Vue - Pinia - Quasar
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { IConfigCalendarRequest } from '@/interfaces/customs/agenda/ConfigCalendar'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useConfigCalendarStore } from '@/stores/agenda/config-calendar'

const useConfigCalendarEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _updateAction, _getByIdAction } = useConfigCalendarStore('v1')
  const { config_calendar_request } = storeToRefs(useConfigCalendarStore('v1'))

  const informationFormRef = ref()

  const configCalendarId = +route.params.id

  const headerProperties = {
    title: 'Editar configuración calendario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Agenda y notificaciones',
      },
      {
        label: 'Configurar calendario',
        route: 'ConfigCalendarList',
      },
      {
        label: 'Editar',
        route: 'ConfigCalendarEdit',
      },
      {
        label: configCalendarId.toString(),
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'InformationForm',
      label: 'Información básica',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const handleGoToList = () => goToURL('ConfigCalendarList')

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return

    openMainLoader(true)

    if (
      await _updateAction(
        config_calendar_request.value as IConfigCalendarRequest
      )
    )
      handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const setFormEdit = () => {
    _getByIdAction(configCalendarId.toString())
  }

  onBeforeMount(() => {
    openMainLoader(true)

    setFormEdit()

    openMainLoader(false)
  })

  return {
    tabs,
    onSubmit,
    tabActive,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    informationFormRef,
    config_calendar_request,
  }
}

export default useConfigCalendarEdit
