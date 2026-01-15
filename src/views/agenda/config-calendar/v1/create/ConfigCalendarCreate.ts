// Vue - Pinia
import { onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IConfigCalendarRequest } from '@/interfaces/customs/agenda/ConfigCalendar'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useConfigCalendarStore } from '@/stores/agenda/config-calendar'
import { useResourceStore } from '@/stores/resources-selects'

const useConfigCalendarCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _createAction, _getConfigCalendarList } = useConfigCalendarStore('v1')
  const { year_list } = storeToRefs(useResourceStore('v1'))
  const { config_calendar_list, config_calendar_request } = storeToRefs(
    useConfigCalendarStore('v1')
  )

  const disabledDates = ref<string[]>([])
  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear configuración calendario',
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
        label: 'Crear',
        route: 'ConfigCalendarCreate',
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

  const onSubmit = async () => {
    const isValid = await informationFormRef.value.validateForm()
    if (!isValid) return

    openMainLoader(true)

    if (
      await _createAction(
        config_calendar_request.value as IConfigCalendarRequest
      )
    )
      handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const getDateDisables = async () =>
    await _getConfigCalendarList(
      {
        'filter[years]': year_list.value.join(','),
      },
      false,
      0
    )

  watch(
    () => config_calendar_list.value,
    () => {
      disabledDates.value = config_calendar_list.value.map((item) =>
        item.marked_day.split(' ')[0].replace(/-/g, '/')
      )
    }
  )

  onBeforeMount(() => {
    openMainLoader(true)

    getDateDisables()

    openMainLoader(false)
  })

  return {
    tabs,
    onSubmit,
    tabActive,
    tabActiveIdx,
    disabledDates,
    handleGoToList,
    headerProperties,
    informationFormRef,
  }
}

export default useConfigCalendarCreate
